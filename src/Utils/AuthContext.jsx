import React, { createContext, useContext, useState, useEffect } from 'react';
import AuthService from '../Services/Auth.services';
import UserService from '../Services/User.service';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }

    const getProfileImageUrl = () => {
        const profileImage = context.user?.client?.profileImage;

        if (!profileImage) return null;

        // Si c'est une URL complète (Google/Apple), la retourner telle quelle
        if (profileImage.startsWith('http://') || profileImage.startsWith('https://')) {
            return profileImage;
        }

        // Si c'est un chemin local, construire l'URL complète
        const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8100';

        const cleanPath = profileImage.replace('/api', '');

        const timestamp = new Date().getTime();
        const fullUrl = `${baseURL}${cleanPath}?t=${timestamp}`;

        return fullUrl;
    };

    return {
        ...context,
        getProfileImageUrl
    };
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [prestataire, setPrestataire] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const storedToken = await AuthService.getToken();
            const storedUser = await AuthService.getUser();

            // Si pas de token ou pas d'utilisateur stocké, pas authentifié
            if (!storedToken || !storedUser) {
                // Nettoyer le storage au cas où il y a des données corrompues
                await AuthService.clearStorage();
                setLoading(false);
                return;
            }

            // On a un token et un user stocké, on considère authentifié
            // même si le getProfile échoue (offline, erreur réseau, etc.)
            setToken(storedToken);
            setUser(storedUser);
            setIsAuthenticated(true);

            // Si c'est un prestataire, charger ses données stockées
            if (storedUser.role?.name === 'prestataire' || storedUser.role === 'prestataire') {
                try {
                    const storedPrestataire = localStorage.getItem('prestataire');
                    if (storedPrestataire && storedPrestataire !== 'undefined') {
                        setPrestataire(JSON.parse(storedPrestataire));
                    }
                } catch (e) {
                    console.warn('Erreur parsing prestataire:', e);
                    localStorage.removeItem('prestataire');
                }
            }

            // Essayer de rafraîchir le profil en background (non bloquant)
            try {
                const result = await AuthService.getProfile();

                if (result.success) {
                    // Fusionner les données du backend avec les données stockées localement
                    const mergedUser = {
                        ...storedUser,
                        ...result.data,
                        client: {
                            ...storedUser?.client,
                            ...result.data.client
                        }
                    };

                    setUser(mergedUser);
                    await AuthService.setUser(mergedUser);
                } else {
                    // ============================================================
                    // ⚠️ Le getProfile a échoué mais on garde l'utilisateur connecté
                    // avec les données locales. On ne déconnecte que si c'est une
                    // erreur d'authentification claire (401 après refresh échoué)
                    // ============================================================
                    console.warn('⚠️ getProfile échoué, utilisation des données locales');

                    // Vérifier si c'est une vraie erreur d'auth (token invalide)
                    // Dans ce cas, le message contiendra généralement "401" ou "unauthorized"
                    const isAuthError = result.message?.toLowerCase().includes('401') ||
                        result.message?.toLowerCase().includes('unauthorized') ||
                        result.message?.toLowerCase().includes('token');

                    if (isAuthError) {
                        // Essayer de refresh le token une fois
                        try {
                            await AuthService.refreshToken();
                            // Si ça marche, réessayer getProfile
                            const retryResult = await AuthService.getProfile();
                            if (retryResult.success) {
                                const mergedUser = {
                                    ...storedUser,
                                    ...retryResult.data,
                                    client: {
                                        ...storedUser?.client,
                                        ...retryResult.data.client
                                    }
                                };
                                setUser(mergedUser);
                                await AuthService.setUser(mergedUser);
                            }
                        } catch (refreshError) {
                            console.error('❌ Refresh token échoué, déconnexion');
                            await AuthService.clearStorage();
                            setUser(null);
                            setPrestataire(null);
                            setToken(null);
                            setIsAuthenticated(false);
                        }
                    }
                    // Si ce n'est pas une erreur d'auth, on garde les données locales
                }
            } catch (error) {
                // Erreur réseau ou autre, on garde les données locales
                console.warn('⚠️ Erreur lors du refresh profil:', error.message);
            }

        } catch (error) {
            console.error('Erreur checkAuth:', error);
            await AuthService.clearStorage();
            setUser(null);
            setPrestataire(null);
            setToken(null);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    const refreshUserData = async () => {
        try {
            const result = await UserService.getProfile();
            if (result.success) {
                // Fusionner avec l'user existant au lieu d'écraser
                setUser(prevUser => {
                    const updatedUser = {
                        ...prevUser,
                        ...result.data,
                        client: {
                            ...prevUser?.client,
                            ...result.data.client
                        }
                    };
                    // Sauvegarder dans localStorage
                    AuthService.setUser(updatedUser);
                    return updatedUser;
                });
            }
        } catch (error) {
            console.error('Erreur refresh user:', error);
        }
    };

    /**
     * Rafraîchir les données utilisateur après un paiement/achat
     * Utilisé notamment après AbonnementSuccess
     */
    const refreshUser = async () => {
        try {
            const result = await AuthService.getProfile();
            if (result.success) {
                const storedUser = await AuthService.getUser();
                const mergedUser = {
                    ...storedUser,
                    ...result.data,
                    client: {
                        ...storedUser?.client,
                        ...result.data.client
                    }
                };
                setUser(mergedUser);
                await AuthService.setUser(mergedUser);
                return { success: true };
            }
            return { success: false };
        } catch (error) {
            console.error('Erreur refreshUser:', error);
            return { success: false, message: error.message };
        }
    };

    const login = async (email, password, rememberMe = false) => {
        try {
            const result = await AuthService.login(email, password, rememberMe);

            if (result.success) {
                setUser(result.data.user);
                setToken(result.data.token);
                setIsAuthenticated(true);

                // Si c'est un prestataire, stocker ses données
                if (result.data.user?.role?.name === 'prestataire' && result.data.prestataire) {
                    setPrestataire(result.data.prestataire);
                    localStorage.setItem('prestataire', JSON.stringify(result.data.prestataire));
                }
            }

            return result;
        } catch (error) {
            console.error('Erreur login:', error);
            return { success: false, message: error.message };
        }
    };

    const register = async (userData) => {
        try {
            const result = await AuthService.register(userData);

            if (result.success) {
                setUser(result.data.user);
                setToken(result.data.token);
                setIsAuthenticated(true);
            }

            return result;
        } catch (error) {
            console.error('Erreur register:', error);
            return { success: false, message: error.message };
        }
    };

    // ==========================================
    // INSCRIPTION PRESTATAIRE
    // ==========================================

    /**
     * Inscription prestataire avec validation SIRET/APE
     */
    const registerPrestataire = async (userData) => {
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8100';

            const response = await fetch(`${API_URL}/prestataires/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            const result = await response.json();

            if (result.success) {
                // Stocker les tokens
                localStorage.setItem('token', result.data.token);
                localStorage.setItem('refreshToken', result.data.refreshToken);

                // Mettre à jour l'état utilisateur
                setUser(result.data.user);
                setToken(result.data.token);
                setIsAuthenticated(true);

                // Stocker les données prestataire
                setPrestataire(result.data.prestataire);
                localStorage.setItem('prestataire', JSON.stringify(result.data.prestataire));

                // Sauvegarder l'utilisateur
                await AuthService.setUser(result.data.user);

                return {
                    success: true,
                    message: result.message,
                    data: result.data,
                    nextStep: result.data.nextStep // 'COMPLETER_FICHE' si la fiche n'est pas complète
                };
            } else {
                return {
                    success: false,
                    message: result.message,
                    error: result.error
                };
            }
        } catch (error) {
            console.error('Erreur inscription prestataire:', error);
            return {
                success: false,
                message: 'Une erreur est survenue lors de l\'inscription'
            };
        }
    };

    /**
     * Inscription prestataire via Google OAuth + SIRET
     */
    const registerPrestataireGoogle = async (userData) => {
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8100';

            const response = await fetch(`${API_URL}/prestataires/register/google`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            const result = await response.json();

            if (result.success) {
                localStorage.setItem('token', result.data.token);
                localStorage.setItem('refreshToken', result.data.refreshToken);

                setUser(result.data.user);
                setToken(result.data.token);
                setIsAuthenticated(true);

                setPrestataire(result.data.prestataire);
                localStorage.setItem('prestataire', JSON.stringify(result.data.prestataire));

                await AuthService.setUser(result.data.user);

                return {
                    success: true,
                    message: result.message,
                    data: result.data,
                    nextStep: result.data.nextStep
                };
            } else {
                return {
                    success: false,
                    message: result.message,
                    error: result.error
                };
            }
        } catch (error) {
            console.error('Erreur inscription prestataire Google:', error);
            return {
                success: false,
                message: 'Une erreur est survenue lors de l\'inscription Google'
            };
        }
    };

    /**
     * Vérifier un SIRET avant inscription (pour pré-validation)
     */
    const verifySiret = async (siret) => {
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8100';
            const siretClean = siret.replace(/[\s-]/g, '');

            const response = await fetch(`${API_URL}/prestataires/verify-siret/${siretClean}`);
            return await response.json();
        } catch (error) {
            console.error('Erreur vérification SIRET:', error);
            return {
                success: false,
                message: 'Erreur de vérification du SIRET'
            };
        }
    };

    /**
     * Vérifier SIRET et Code APE
     */
    const verifySiretAndApe = async (siret, codeApe) => {
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8100';
            const siretClean = siret.replace(/[\s-]/g, '');

            const response = await fetch(`${API_URL}/prestataires/verify-siret-ape/${siretClean}/${codeApe}`);
            return await response.json();
        } catch (error) {
            console.error('Erreur vérification SIRET/APE:', error);
            return {
                success: false,
                message: 'Erreur de vérification'
            };
        }
    };

    // ==========================================
    // FIN INSCRIPTION PRESTATAIRE
    // ==========================================

    const loginWithGoogle = async (googleData) => {
        try {
            const result = await AuthService.loginWithGoogle({
                ...googleData,
                profileImage: googleData.picture
            });

            if (result.success) {
                setUser(result.data.user);
                setToken(result.data.token);
                setIsAuthenticated(true);
            }

            return result;
        } catch (error) {
            console.error('Erreur loginWithGoogle:', error);
            return { success: false, message: error.message };
        }
    };

    const loginWithApple = async (appleData) => {
        try {
            const result = await AuthService.loginWithApple({
                ...appleData,
                profileImage: appleData.picture
            });

            if (result.success) {
                setUser(result.data.user);
                setToken(result.data.token);
                setIsAuthenticated(true);
            }

            return result;
        } catch (error) {
            console.error('Erreur loginWithApple:', error);
            return { success: false, message: error.message };
        }
    };

    const logout = async () => {
        try {
            await AuthService.logout();
            setUser(null);
            setPrestataire(null);
            setToken(null);
            setIsAuthenticated(false);
            localStorage.removeItem('prestataire');
        } catch (error) {
            console.error('Erreur logout:', error);
        }
    };

    const updateProfile = async (data) => {
        try {
            const result = await AuthService.updateProfile(data);

            if (result.success) {
                // Fusionner les nouvelles données avec l'user existant
                setUser(prevUser => ({
                    ...prevUser,
                    ...result.data,
                    client: {
                        ...prevUser?.client,
                        ...result.data.client
                    }
                }));
            }

            return result;
        } catch (error) {
            console.error('Erreur updateProfile:', error);
            return { success: false, message: error.message };
        }
    };

    const changePassword = async (currentPassword, newPassword) => {
        try {
            return await AuthService.changePassword(currentPassword, newPassword);
        } catch (error) {
            console.error('Erreur changePassword:', error);
            return { success: false, message: error.message };
        }
    };

    const deleteAccount = async () => {
        try {
            const result = await AuthService.deleteAccount();

            if (result.success) {
                setUser(null);
                setPrestataire(null);
                setToken(null);
                setIsAuthenticated(false);
                localStorage.removeItem('prestataire');
            }

            return result;
        } catch (error) {
            console.error('Erreur deleteAccount:', error);
            return { success: false, message: error.message };
        }
    };

    const getStats = async () => {
        try {
            return await AuthService.getStats();
        } catch (error) {
            console.error('Erreur getStats:', error);
            return { success: false, message: error.message };
        }
    };

    /**
     * Vérifie si l'utilisateur est un prestataire
     */
    const isPrestataire = () => {
        return user?.role?.name === 'prestataire' || user?.role === 'prestataire';
    };

    /**
     * Vérifie si l'utilisateur est un client
     */
    const isClient = () => {
        return user?.role?.name === 'client' || user?.role === 'client';
    };

    /**
     * Vérifie si l'utilisateur est admin
     */
    const isAdmin = () => {
        return user?.role?.name === 'admin' || user?.role === 'admin';
    };

    const value = {
        user,
        prestataire,
        token,
        loading,
        isAuthenticated,
        // Auth basique
        login,
        register,
        loginWithGoogle,
        loginWithApple,
        logout,
        checkAuth,
        // Profil
        updateProfile,
        changePassword,
        deleteAccount,
        getStats,
        refreshUserData,
        refreshUser,
        // Inscription prestataire
        registerPrestataire,
        registerPrestataireGoogle,
        verifySiret,
        verifySiretAndApe,
        // Helpers
        isPrestataire,
        isClient,
        isAdmin,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};