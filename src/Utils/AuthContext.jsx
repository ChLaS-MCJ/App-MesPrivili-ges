import React, { createContext, useContext, useState, useEffect } from 'react';
import AuthService from '../Services/Auth.services';
import UserService from '../Services/User.service';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }

    /**
     * Obtenir l'URL de l'image de profil
     * Simple : on retourne client.profileImage (peu importe la source)
     */
    const getProfileImageUrl = () => {
        const profileImage = context.user?.client?.profileImage;

        if (!profileImage) return null;

        // Si c'est une URL complète (Google/Apple), la retourner telle quelle
        if (profileImage.startsWith('http://') || profileImage.startsWith('https://')) {
            return profileImage;
        }

        // Si c'est un chemin local, construire l'URL complète
        const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8100';
        // Enlever /api du chemin car baseURL le contient déjà
        const cleanPath = profileImage.replace('/api', '');
        return `${baseURL}${cleanPath}`;
    };

    return {
        ...context,
        getProfileImageUrl
    };
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
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
                    setUser(result.data);
                    setIsAuthenticated(true);
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
                setUser(result.data);
                await AuthService.saveUser(result.data);
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

    const loginWithGoogle = async (googleData) => {
        try {
            const result = await AuthService.loginWithGoogle({
                ...googleData,
                profileImage: googleData.picture // Image Google
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
                profileImage: appleData.picture // Image Apple si disponible
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
            setToken(null);
            setIsAuthenticated(false);
        } catch (error) {
            console.error('Erreur logout:', error);
        }
    };

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
                setToken(null);
                setIsAuthenticated(false);
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

    const value = {
        user,
        token,
        loading,
        isAuthenticated,
        login,
        register,
        loginWithGoogle,
        loginWithApple,
        logout,
        checkAuth,
        updateProfile,
        changePassword,
        deleteAccount,
        getStats,
        refreshUserData,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};