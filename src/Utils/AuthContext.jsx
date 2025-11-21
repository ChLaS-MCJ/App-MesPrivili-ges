import React, { createContext, useContext, useState, useEffect } from 'react';
import AuthService from '../Services/Auth.services';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Vérifier l'authentification au démarrage
    useEffect(() => {
        checkAuth();
    }, []);

    /**
     * Vérifier si l'utilisateur est connecté
     */
    const checkAuth = async () => {
        try {
            const storedToken = await AuthService.getToken();
            const storedUser = await AuthService.getUser();

            if (storedToken && storedUser) {
                // Vérifier que le token est toujours valide
                const result = await AuthService.getProfile();

                if (result.success) {
                    setToken(storedToken);
                    setUser(result.data);
                    setIsAuthenticated(true);
                } else {
                    // Token invalide, nettoyer
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

    /**
     * Connexion classique (email/password)
     */
    const login = async (email, password, rememberMe = false) => {
        try {
            const result = await AuthService.login(email, password, rememberMe);

            if (result.success) {
                setUser(result.data.user);
                setToken(result.data.token);
                setIsAuthenticated(true);
            }

            return result;
        } catch (error) {
            console.error('Erreur login:', error);
            return { success: false, message: error.message };
        }
    };

    /**
     * Inscription
     */
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

    /**
     * Connexion avec Google OAuth
     */
    const loginWithGoogle = async (googleData) => {
        try {
            const result = await AuthService.loginWithGoogle(googleData);

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

    /**
     * Connexion avec Apple OAuth
     */
    const loginWithApple = async (appleData) => {
        try {
            const result = await AuthService.loginWithApple(appleData);

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

    /**
     * Déconnexion
     */
    const logout = async () => {
        try {
            await AuthService.logout();
            setUser(null);
            setToken(null);
            setIsAuthenticated(false);
        } catch (error) {
            console.error('Erreur logout:', error);
        }
    };

    /**
     * Mettre à jour le profil
     */
    const updateProfile = async (data) => {
        try {
            const result = await AuthService.updateProfile(data);

            if (result.success) {
                setUser(result.data);
            }

            return result;
        } catch (error) {
            console.error('Erreur updateProfile:', error);
            return { success: false, message: error.message };
        }
    };

    /**
     * Changer le mot de passe
     */
    const changePassword = async (currentPassword, newPassword) => {
        try {
            return await AuthService.changePassword(currentPassword, newPassword);
        } catch (error) {
            console.error('Erreur changePassword:', error);
            return { success: false, message: error.message };
        }
    };

    /**
     * Supprimer le compte
     */
    const deleteAccount = async () => {
        try {
            const result = await AuthService.deleteAccount();

            if (result.success) {
                setUser(null);
                setToken(null);
                setIsAuthenticated(false);
            }

            return result;
        } catch (error) {
            console.error('Erreur deleteAccount:', error);
            return { success: false, message: error.message };
        }
    };

    /**
     * Récupérer les statistiques
     */
    const getStats = async () => {
        try {
            return await AuthService.getStats();
        } catch (error) {
            console.error('Erreur getStats:', error);
            return { success: false, message: error.message };
        }
    };

    const value = {
        // États
        user,
        token,
        loading,
        isAuthenticated,

        // Méthodes d'authentification
        login,
        register,
        loginWithGoogle,
        loginWithApple,
        logout,
        checkAuth,

        // Méthodes de gestion du profil
        updateProfile,
        changePassword,
        deleteAccount,
        getStats,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};