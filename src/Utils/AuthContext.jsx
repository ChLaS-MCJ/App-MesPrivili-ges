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

        const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8100';
        const timestamp = new Date().getTime();
        const fullUrl = `${baseURL}${profileImage}?t=${timestamp}`;

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

            if (!storedToken || !storedUser) {
                await AuthService.clearStorage();
                setLoading(false);
                return;
            }

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
            // ✅ Utilise UserService au lieu de AuthService
            try {
                const result = await UserService.getProfile();

                if (result.success) {
                    // getProfile fait déjà la fusion et met à jour le localStorage
                    setUser(result.data);
                } else {
                    console.warn('⚠️ getProfile échoué, utilisation des données locales');

                    const isAuthError = result.message?.toLowerCase().includes('401') ||
                        result.message?.toLowerCase().includes('unauthorized') ||
                        result.message?.toLowerCase().includes('token');

                    if (isAuthError) {
                        try {
                            await AuthService.refreshToken();
                            const retryResult = await UserService.getProfile();
                            if (retryResult.success) {
                                setUser(retryResult.data);
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
                }
            } catch (error) {
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

    // ✅ Utilise UserService
    const refreshUserData = async () => {
        try {
            const result = await UserService.getProfile();
            if (result.success) {
                // getProfile fait déjà la fusion et met à jour le localStorage
                setUser(result.data);
            }
        } catch (error) {
            console.error('Erreur refresh user:', error);
        }
    };

    // ✅ Utilise UserService
    const refreshUser = async () => {
        try {
            const result = await UserService.getProfile();
            if (result.success) {
                // getProfile fait déjà la fusion et met à jour le localStorage
                setUser(result.data);
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

                if (result.data.user?.role?.name === 'prestataire' && result.data.prestataire) {
                    setPrestataire(result.data.prestataire);
                    localStorage.setItem('prestataire', JSON.stringify(result.data.prestataire));
                }

                // Récupérer le profil complet (avec image) après le login
                try {
                    const profileResult = await UserService.getProfile();
                    if (profileResult.success) {
                        setUser(profileResult.data);
                    }
                } catch (e) {
                    console.warn('Impossible de récupérer le profil complet:', e);
                }
            }

            return result;
        } catch (error) {
            console.error('Erreur login:', error);
            return { success: false, message: error.message };
        }
    };

    const register = async (data) => {
        try {
            const result = await AuthService.register(data);

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

    const registerPrestataire = async (data) => {
        try {
            const result = await AuthService.registerPrestataire(data);

            if (result.success) {
                setUser(result.data.user);
                setToken(result.data.token);
                setIsAuthenticated(true);
            }

            return result;
        } catch (error) {
            console.error('Erreur registerPrestataire:', error);
            return { success: false, message: error.message };
        }
    };

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

                // Récupérer le profil complet après le login
                try {
                    const profileResult = await UserService.getProfile();
                    if (profileResult.success) {
                        setUser(profileResult.data);
                    }
                } catch (e) {
                    console.warn('Impossible de récupérer le profil complet:', e);
                }
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

                // Récupérer le profil complet après le login
                try {
                    const profileResult = await UserService.getProfile();
                    if (profileResult.success) {
                        setUser(profileResult.data);
                    }
                } catch (e) {
                    console.warn('Impossible de récupérer le profil complet:', e);
                }
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

    // ✅ Utilise UserService
    const updateProfile = async (data) => {
        try {
            const result = await UserService.updateProfile(data);

            if (result.success) {
                // Récupérer les données fusionnées du localStorage (UserService les a déjà mises à jour)
                const updatedUser = await AuthService.getUser();
                setUser(updatedUser);
            }

            return result;
        } catch (error) {
            console.error('Erreur updateProfile:', error);
            return { success: false, message: error.message };
        }
    };

    // ✅ Utilise UserService
    const changePassword = async (currentPassword, newPassword) => {
        try {
            return await UserService.changePassword(currentPassword, newPassword);
        } catch (error) {
            console.error('Erreur changePassword:', error);
            return { success: false, message: error.message };
        }
    };

    // ✅ Utilise UserService
    const deleteAccount = async () => {
        try {
            const result = await UserService.deleteAccount();

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

    // ✅ Utilise UserService
    const getStats = async () => {
        try {
            return await UserService.getStats();
        } catch (error) {
            console.error('Erreur getStats:', error);
            return { success: false, message: error.message };
        }
    };

    /**
     * Vérifier si l'utilisateur est un prestataire
     */
    const isPrestataire = () => {
        return user?.role?.name === 'prestataire' || user?.role === 'prestataire';
    };

    /**
     * Vérifier si l'utilisateur est un client
     */
    const isClient = () => {
        return user?.role?.name === 'client' || user?.role === 'client';
    };

    /**
     * Vérifier si l'utilisateur est admin
     */
    const isAdmin = () => {
        return user?.role?.name === 'admin' || user?.role === 'admin';
    };

    /**
     * Vérifier un SIRET avant inscription
     */
    const verifySiret = async (siret) => {
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8100';
            const siretClean = siret.replace(/[\s-]/g, '');

            const response = await fetch(`${API_URL}/prestataires/verify-siret/${siretClean}`);
            return await response.json();
        } catch (error) {
            console.error('Erreur vérification SIRET:', error);
            return { success: false, message: 'Erreur de vérification du SIRET' };
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
            return { success: false, message: 'Erreur de vérification' };
        }
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
        registerPrestataire,
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
        // Vérification SIRET
        verifySiret,
        verifySiretAndApe,
        // Helpers
        isPrestataire,
        isClient,
        isAdmin,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};