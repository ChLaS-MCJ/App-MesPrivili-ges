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

            if (storedToken && storedUser) {
                const result = await AuthService.getProfile();

                if (result.success) {
                    setToken(storedToken);

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
                    setIsAuthenticated(true);

                    // Si c'est un prestataire, charger ses données
                    if (result.data.role?.name === 'prestataire' || storedUser.role === 'prestataire') {
                        const storedPrestataire = localStorage.getItem('prestataire');
                        if (storedPrestataire) {
                            setPrestataire(JSON.parse(storedPrestataire));
                        }
                    }
                } else {
                    await AuthService.clearStorage();
                }
            }
        } catch (error) {
            console.error('Erreur checkAuth:', error);
            await AuthService.clearStorage();
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