import axiosInstance from './Caller.services';
import Axios from 'axios';

const axiosWithoutInterceptor = Axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://cacao.mesprivileges.fr/api',
});

/**
 * 🔐 AuthService
 * Service d'authentification pour l'application
 * Compatible avec: Email/Password, Google OAuth, Apple OAuth
 */
const AuthService = {
    // ========================================
    // 📝 INSCRIPTION
    // ========================================

    /**
     * Inscription classique (email/password)
     * POST /api/users/register
     */
    async register(data) {
        try {
            const response = await axiosInstance.post('/users/register', data);

            if (response.data.success && response.data.data.token) {

                await this.setToken(response.data.data.token);
                await this.setRefreshToken(response.data.data.refreshToken);
                await this.setUser(response.data.data.user);
                await this.setRememberMe(true);

                return {
                    success: true,
                    message: response.data.message,
                    data: {
                        user: response.data.data.user,
                        token: response.data.data.token
                    }
                };
            }

            throw new Error(response.data.message || 'Erreur lors de l\'inscription');
        } catch (error) {
            console.error('❌ Erreur register:', error);
            return {
                success: false,
                message: error.response?.data?.message || error.message || 'Erreur lors de l\'inscription',
                errors: error.response?.data?.errors || null
            };
        }
    },

    // ========================================
    // 🔑 CONNEXION
    // ========================================

    /**
     * Connexion classique (email/password)
     * POST /api/users/login
     */
    async login(email, password, rememberMe = false) {
        try {
            const response = await axiosInstance.post('/users/login', {
                email,
                password
            });

            if (response.data.success && response.data.data.token) {
                await this.setToken(response.data.data.token);
                await this.setRefreshToken(response.data.data.refreshToken);
                await this.setUser(response.data.data.user);
                await this.setRememberMe(rememberMe);

                return {
                    success: true,
                    data: {
                        user: response.data.data.user,
                        token: response.data.data.token,
                        prestataire: response.data.data.prestataire || null
                    }
                };
            }

            throw new Error(response.data.message || 'Identifiants incorrects');
        } catch (error) {
            console.error('❌ Erreur login:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Email ou mot de passe incorrect'
            };
        }
    },

    /**
     * Connexion avec Google OAuth
     * POST /api/users/google
     */
    async loginWithGoogle(googleData) {
        try {
            const response = await axiosInstance.post('/users/google', {
                googleId: googleData.googleId,
                email: googleData.email,
                prenom: googleData.prenom || '',
                nom: googleData.nom || ''
            });

            if (response.data.success && response.data.data.token) {
                await this.setToken(response.data.data.token);
                await this.setRefreshToken(response.data.data.refreshToken);
                await this.setUser(response.data.data.user);
                await this.setRememberMe(true);

                return {
                    success: true,
                    data: {
                        user: response.data.data.user,
                        token: response.data.data.token
                    }
                };
            }

            throw new Error(response.data.message || 'Erreur lors de la connexion Google');
        } catch (error) {
            console.error('❌ Erreur loginWithGoogle:', error);
            return {
                success: false,
                message: error.response?.data?.message || error.message || 'Erreur lors de la connexion Google'
            };
        }
    },

    /**
     * Connexion avec Apple OAuth
     * POST /api/users/apple
     */
    async loginWithApple(appleData) {
        try {
            const response = await axiosInstance.post('/users/apple', {
                appleId: appleData.appleId,
                email: appleData.email
            });

            if (response.data.success && response.data.data.token) {
                await this.setToken(response.data.data.token);
                await this.setRefreshToken(response.data.data.refreshToken);
                await this.setUser(response.data.data.user);
                await this.setRememberMe(true);

                return {
                    success: true,
                    data: {
                        user: response.data.data.user,
                        token: response.data.data.token
                    }
                };
            }

            throw new Error(response.data.message || 'Erreur lors de la connexion Apple');
        } catch (error) {
            console.error('❌ Erreur loginWithApple:', error);
            return {
                success: false,
                message: error.response?.data?.message || error.message || 'Erreur lors de la connexion Apple'
            };
        }
    },

    /**
 * Inscription prestataire (SIRET)
 * POST /api/prestataires/register
 */
    async registerPrestataire(data) {
        try {
            const response = await axiosInstance.post('/prestataires/register', data);

            if (response.data.success && response.data.data.token) {
                await this.setToken(response.data.data.token);
                await this.setRefreshToken(response.data.data.refreshToken);
                await this.setUser(response.data.data.user);
                await this.setRememberMe(true);

                return {
                    success: true,
                    message: response.data.message,
                    data: {
                        user: response.data.data.user,
                        entreprise: response.data.data.entreprise,
                        token: response.data.data.token,
                        nextStep: response.data.data.nextStep
                    }
                };
            }

            throw new Error(response.data.message || 'Erreur lors de l\'inscription');
        } catch (error) {
            console.error('❌ Erreur registerPrestataire:', error);
            return {
                success: false,
                message: error.response?.data?.message || error.message || 'Erreur lors de l\'inscription prestataire',
                errors: error.response?.data?.errors || null
            };
        }
    },

    // ========================================
    // 🚪 DÉCONNEXION
    // ========================================

    /**
     * Déconnexion complète
     */
    async logout() {
        try {
            await this.clearStorage();
            return { success: true };
        } catch (error) {
            console.error('❌ Erreur logout:', error);
            await this.clearStorage();
            throw error;
        }
    },

    // ========================================
    // 🔄 TOKEN MANAGEMENT
    // ========================================

    /**
     * Rafraîchir le token JWT
     * POST /api/users/refresh-token
     */
    async refreshToken() {
        try {
            const refreshToken = await this.getRefreshToken();

            if (!refreshToken) {
                throw new Error('Aucun refresh token disponible');
            }

            const response = await axiosWithoutInterceptor.post('/users/refresh-token', {
                refreshToken
            });

            if (response.data.success && response.data.data.token) {
                await this.setToken(response.data.data.token);

                // Si le backend renvoie aussi un nouveau refreshToken
                if (response.data.data.refreshToken) {
                    await this.setRefreshToken(response.data.data.refreshToken);
                }

                return response.data.data.token;
            }

            throw new Error('Erreur lors du rafraîchissement du token');
        } catch (error) {
            console.error('❌ Erreur refreshToken:', error);
            throw error;
        }
    },

    // ========================================
    // 👤 PROFIL UTILISATEUR
    // ========================================

    /**
     * Récupérer le profil de l'utilisateur connecté
     * GET /api/users/me
     */
    async getProfile() {
        try {
            const response = await axiosInstance.get('/users/me');

            if (response.data.success) {
                await this.setUser(response.data.data);
                return {
                    success: true,
                    data: response.data.data
                };
            }

            throw new Error('Erreur lors de la récupération du profil');
        } catch (error) {
            console.error('❌ Erreur getProfile:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur lors de la récupération du profil'
            };
        }
    },

    /**
     * Mettre à jour le profil
     * PUT /api/users/me
     */
    async updateProfile(data) {
        try {
            const response = await axiosInstance.put('/users/me', data);

            if (response.data.success) {

                const currentUser = await this.getUser();

                // Fusionner avec les nouvelles données
                const updatedUser = {
                    ...currentUser,
                    ...response.data.data,
                    client: {
                        ...currentUser?.client,
                        ...response.data.data.client
                    }
                };

                await this.setUser(updatedUser);

                return {
                    success: true,
                    message: response.data.message,
                    data: updatedUser
                };
            }

            throw new Error('Erreur lors de la mise à jour du profil');
        } catch (error) {
            console.error('❌ Erreur updateProfile:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur lors de la mise à jour du profil'
            };
        }
    },

    /**
     * Changer le mot de passe
     * PUT /api/users/me/password
     */
    async changePassword(currentPassword, newPassword) {
        try {
            const response = await axiosInstance.put('/users/me/password', {
                currentPassword,
                newPassword
            });

            return {
                success: response.data.success,
                message: response.data.message
            };
        } catch (error) {
            console.error('❌ Erreur changePassword:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur lors du changement de mot de passe'
            };
        }
    },

    /**
     * Supprimer son compte
     * DELETE /api/users/me
     */
    async deleteAccount() {
        try {
            const response = await axiosInstance.delete('/users/me');

            if (response.data.success) {
                await this.clearStorage();
                return {
                    success: true,
                    message: response.data.message
                };
            }

            throw new Error('Erreur lors de la suppression du compte');
        } catch (error) {
            console.error('❌ Erreur deleteAccount:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur lors de la suppression du compte'
            };
        }
    },

    /**
     * Récupérer les statistiques de l'utilisateur
     * GET /api/users/me/stats
     */
    async getStats() {
        try {
            const response = await axiosInstance.get('/users/me/stats');

            if (response.data.success) {
                return {
                    success: true,
                    data: response.data.data
                };
            }

            throw new Error('Erreur lors de la récupération des statistiques');
        } catch (error) {
            console.error('❌ Erreur getStats:', error);
            return {
                success: false,
                message: 'Erreur lors de la récupération des statistiques'
            };
        }
    },

    // ========================================
    // ✅ UTILITAIRES D'AUTHENTIFICATION
    // ========================================

    /**
     * Vérifier si l'utilisateur est connecté
     */
    async isAuthenticated() {
        const token = await this.getToken();
        return !!token;
    },

    /**
     * Récupérer l'utilisateur actuellement connecté
     */
    async getCurrentUser() {
        return await this.getUser();
    },

    // ========================================
    // 💾 STORAGE (localStorage)
    // ========================================

    /**
     * Stocker le token JWT
     */
    async setToken(token) {
        if (token && token !== 'undefined' && token !== 'null') {
            localStorage.setItem('token', token);
        }
    },

    /**
     * Récupérer le token JWT
     */
    async getToken() {
        const token = localStorage.getItem('token');
        // Vérifier que ce n'est pas une valeur invalide
        if (!token || token === 'undefined' || token === 'null') {
            return null;
        }
        return token;
    },

    /**
     * Stocker le refresh token
     */
    async setRefreshToken(refreshToken) {
        if (refreshToken && refreshToken !== 'undefined' && refreshToken !== 'null') {
            localStorage.setItem('refreshToken', refreshToken);
        }
    },

    /**
     * Récupérer le refresh token
     */
    async getRefreshToken() {
        const token = localStorage.getItem('refreshToken');
        // Vérifier que ce n'est pas une valeur invalide
        if (!token || token === 'undefined' || token === 'null') {
            return null;
        }
        return token;
    },

    /**
     * Stocker les infos utilisateur
     */
    async setUser(user) {
        // Ne stocker que si user est valide
        if (user && typeof user === 'object') {
            localStorage.setItem('user', JSON.stringify(user));
        }
    },

    /**
     * Récupérer les infos utilisateur
     */
    async getUser() {
        try {
            const userStr = localStorage.getItem('user');
            // Vérifier que ce n'est pas une valeur invalide
            if (!userStr || userStr === 'undefined' || userStr === 'null') {
                return null;
            }
            return JSON.parse(userStr);
        } catch (error) {
            // Si le JSON est invalide, nettoyer et retourner null
            console.error('❌ Erreur parsing user:', error);
            localStorage.removeItem('user');
            return null;
        }
    },

    /**
     * Stocker le flag "remember me"
     */
    async setRememberMe(remember) {
        if (remember) {
            localStorage.setItem('rememberMe', 'true');
        } else {
            localStorage.removeItem('rememberMe');
        }
    },

    /**
     * Vérifier si "remember me" est activé
     */
    async getRememberMe() {
        return localStorage.getItem('rememberMe') === 'true';
    },

    /**
     * Nettoyer tout le storage
     */
    async clearStorage() {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('prestataire');
    }
};

export default AuthService;
