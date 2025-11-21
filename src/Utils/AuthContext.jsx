import React, { createContext, useContext, useState, useEffect } from 'react';

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

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

    // Vérifier le token au démarrage
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const storedToken = localStorage.getItem('token');

            if (!storedToken) {
                setLoading(false);
                return;
            }

            // Vérifier si le token est valide
            const response = await fetch(`${API_URL}/users/me`, {
                headers: {
                    'Authorization': `Bearer ${storedToken}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data.data);
                setToken(storedToken);
                setIsAuthenticated(true);
            } else {
                // Token invalide
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
            }
        } catch (error) {
            console.error('Erreur vérification auth:', error);
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
        } finally {
            setLoading(false);
        }
    };

    // Connexion classique (email/password)
    const login = async (email, password, rememberMe = false) => {
        try {
            const response = await fetch(`${API_URL}/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erreur de connexion');
            }

            // Stocker le token
            localStorage.setItem('token', data.data.token);
            localStorage.setItem('refreshToken', data.data.refreshToken);

            if (rememberMe) {
                localStorage.setItem('rememberMe', 'true');
            }

            setToken(data.data.token);
            setUser(data.data.user);
            setIsAuthenticated(true);

            return { success: true, data: data.data };
        } catch (error) {
            console.error('Erreur login:', error);
            return { success: false, message: error.message };
        }
    };

    // Connexion Google
    const loginWithGoogle = async (googleData) => {
        try {
            const response = await fetch(`${API_URL}/users/google`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(googleData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erreur de connexion Google');
            }

            localStorage.setItem('token', data.data.token);
            localStorage.setItem('refreshToken', data.data.refreshToken);

            setToken(data.data.token);
            setUser(data.data.user);
            setIsAuthenticated(true);

            return { success: true, data: data.data };
        } catch (error) {
            console.error('Erreur login Google:', error);
            return { success: false, message: error.message };
        }
    };

    // Connexion Apple
    const loginWithApple = async (appleData) => {
        try {
            const response = await fetch(`${API_URL}/users/apple`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(appleData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erreur de connexion Apple');
            }

            localStorage.setItem('token', data.data.token);
            localStorage.setItem('refreshToken', data.data.refreshToken);

            setToken(data.data.token);
            setUser(data.data.user);
            setIsAuthenticated(true);

            return { success: true, data: data.data };
        } catch (error) {
            console.error('Erreur login Apple:', error);
            return { success: false, message: error.message };
        }
    };

    // Inscription
    const register = async (userData) => {
        try {
            const response = await fetch(`${API_URL}/users/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erreur lors de l\'inscription');
            }

            // Auto-login après inscription
            localStorage.setItem('token', data.data.token);
            localStorage.setItem('refreshToken', data.data.refreshToken);

            setToken(data.data.token);
            setUser(data.data.user);
            setIsAuthenticated(true);

            return { success: true, data: data.data };
        } catch (error) {
            console.error('Erreur register:', error);
            return { success: false, message: error.message };
        }
    };

    // Déconnexion
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('rememberMe');
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
    };

    const value = {
        user,
        token,
        loading,
        isAuthenticated,
        login,
        loginWithGoogle,
        loginWithApple,
        register,
        logout,
        checkAuth,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};