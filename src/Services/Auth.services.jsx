import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { Device } from '@capacitor/device';
import axiosInstance from './Caller.service';

/**
 * 🔐 AuthService
 * Service d'authentification moderne pour l'application
 * Compatible avec: Email/Password, Google OAuth, Apple OAuth
 */
const AuthService = {
    // ========================================
    // 🚀 INITIALISATION
    // ========================================

    /**
     * Initialiser Google Auth (à appeler au démarrage de l'app)
     */
    async initGoogleAuth() {
        try {
            await GoogleAuth.initialize({
                clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
                scopes: ['profile', 'email'],
                grantOfflineAccess: false
            });
            console.log('✅ Google Auth initialisé');
            return true;
        } catch (error) {
            console.error('❌ Erreur init Google Auth:', error);
            throw error;
        }
    },

    // ========================================
    // 📝 INSCRIPTION
    // ========================================

    /**
     * Inscription classique (email/password)
     * POST /api/users/register
     * 
     * @param {Object} data - Données d'inscription
     * @param {string} data.email - Email
     * @param {string} data.password - Mot de passe (min 8 caractères, 1 majuscule, 1 chiffre, 1 caractère spécial)
     * @param {string} data.role - Role: 'client' ou 'prestataire' (défaut: 'client')
     * @param {string} [data.prenom] - Prénom (optionnel)
     * @param {string} [data.nom] - Nom (optionnel)
     * @param {string} [data.telephone] - Téléphone (optionnel, format: 0612345678)
     * @param {string} [data.nomCommerce] - Nom du commerce (requis si role='prestataire')
     * @param {string} [data.adresse] - Adresse (requis si role='prestataire')
     * @param {string} [data.ville] - Ville (requis si role='prestataire')
     * @param {string} [data.codePostal] - Code postal (requis si role='prestataire')
     * 
     * @returns {Promise<Object>} { success, message, data: { user, token, refreshToken } }
     */
    async register(data) {
        try {
            const response = await axiosInstance.post('/users/register', data);

            if (response.data.success && response.data.data.token) {
                // Stocker les tokens et infos utilisateur
                await this.setToken(response.data.data.token);
                await this.setRefreshToken(response.data.data.refreshToken);
                await this.setUser(response.data.data.user);

                return {
                    success: true,
                    message: response.data.message,
                    user: response.data.data.user,
                    token: response.data.data.token
                };
            }

            throw new Error(response.data.message || 'Erreur lors de l\'inscription');
        } catch (error) {
            console.error('❌ Erreur register:', error);
            throw {
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
     * 
     * @param {string} email - Email
     * @param {string} password - Mot de passe
     * @returns {Promise<Object>} { success, user, token }
     */
    async login(email, password) {
        try {
            const response = await axiosInstance.post('/users/login', {
                email,
                password
            });

            if (response.data.success && response.data.data.token) {
                await this.setToken(response.data.data.token);
                await this.setRefreshToken(response.data.data.refreshToken);
                await this.setUser(response.data.data.user);

                return {
                    success: true,
                    user: response.data.data.user,
                    token: response.data.data.token
                };
            }

            throw new Error(response.data.message || 'Identifiants incorrects');
        } catch (error) {
            console.error('❌ Erreur login:', error);
            throw {
                message: error.response?.data?.message || 'Email ou mot de passe incorrect',
                status: error.response?.status
            };
        }
    },

    /**
     * Connexion avec Google OAuth
     * POST /api/users/google
     * 
     * @returns {Promise<Object>} { success, user, token }
     */
    async loginWithGoogle() {
        try {
            // Nettoyer la session Google précédente
            try {
                await GoogleAuth.signOut();
            } catch (signOutError) {
                // Ignorer les erreurs de déconnexion
            }

            // Se connecter avec Google
            const googleUser = await GoogleAuth.signIn();

            if (!googleUser || !googleUser.id || !googleUser.email) {
                throw new Error('Échec de l\'authentification Google');
            }

            // Envoyer au backend
            const response = await axiosInstance.post('/users/google', {
                googleId: googleUser.id,
                email: googleUser.email,
                prenom: googleUser.givenName || '',
                nom: googleUser.familyName || ''
            });

            if (response.data.success && response.data.data.token) {
                await this.setToken(response.data.data.token);
                await this.setRefreshToken(response.data.data.refreshToken);
                await this.setUser(response.data.data.user);

                return {
                    success: true,
                    user: response.data.data.user,
                    token: response.data.data.token
                };
            }

            throw new Error(response.data.message || 'Erreur lors de la connexion Google');
        } catch (error) {
            console.error('❌ Erreur loginWithGoogle:', error);
            throw {
                message: error.response?.data?.message || error.message || 'Erreur lors de la connexion Google'
            };
        }
    },

    /**
     * Connexion avec Apple OAuth
     * POST /api/users/apple
     * 
     * @param {Object} appleData - Données Apple (appleId, email)
     * @returns {Promise<Object>} { success, user, token }
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

                return {
                    success: true,
                    user: response.data.data.user,
                    token: response.data.data.token
                };
            }

            throw new Error(response.data.message || 'Erreur lors de la connexion Apple');
        } catch (error) {
            console.error('❌ Erreur loginWithApple:', error);
            throw {
                message: error.response?.data?.message || error.message || 'Erreur lors de la connexion Apple'
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
            // Déconnexion Google si connecté avec Google
            try {
                await GoogleAuth.signOut();
            } catch (googleError) {
                // Ignorer les erreurs Google
            }

            // Nettoyer le storage local
            await this.clearStorage();

            return { success: true };
        } catch (error) {
            console.error('❌ Erreur logout:', error);
            // Même en cas d'erreur, on nettoie le storage
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
     * 
     * @returns {Promise<string>} Nouveau token
     */
    async refreshToken() {
        try {
            const refreshToken = await this.getRefreshToken();

            if (!refreshToken) {
                throw new Error('Aucun refresh token disponible');
            }

            const response = await axiosInstance.post('/users/refresh-token', {
                refreshToken
            });

            if (response.data.success && response.data.data.token) {
                const newToken = response.data.data.token;
                const newRefreshToken = response.data.data.refreshToken;

                await this.setToken(newToken);
                await this.setRefreshToken(newRefreshToken);

                return newToken;
            }

            throw new Error('Erreur lors du rafraîchissement du token');
        } catch (error) {
            console.error('❌ Erreur refreshToken:', error);
            // Si le refresh token est invalide, déconnecter l'utilisateur
            await this.clearStorage();
            throw error;
        }
    },

    // ========================================
    // 👤 PROFIL UTILISATEUR
    // ========================================

    /**
     * Récupérer le profil de l'utilisateur connecté
     * GET /api/users/me
     * 
     * @returns {Promise<Object>} Profil complet
     */
    async getProfile() {
        try {
            const response = await axiosInstance.get('/users/me');

            if (response.data.success) {
                await this.setUser(response.data.data);
                return response.data.data;
            }

            throw new Error('Erreur lors de la récupération du profil');
        } catch (error) {
            console.error('❌ Erreur getProfile:', error);
            throw error;
        }
    },

    /**
     * Mettre à jour le profil
     * PUT /api/users/me
     * 
     * @param {Object} data - Données à mettre à jour (prenom, nom, telephone, etc.)
     * @returns {Promise<Object>} Profil mis à jour
     */
    async updateProfile(data) {
        try {
            const response = await axiosInstance.put('/users/me', data);

            if (response.data.success) {
                await this.setUser(response.data.data);
                return response.data.data;
            }

            throw new Error('Erreur lors de la mise à jour du profil');
        } catch (error) {
            console.error('❌ Erreur updateProfile:', error);
            throw {
                message: error.response?.data?.message || 'Erreur lors de la mise à jour du profil',
                errors: error.response?.data?.errors || null
            };
        }
    },

    /**
     * Changer le mot de passe
     * PUT /api/users/me/password
     * 
     * @param {string} currentPassword - Mot de passe actuel
     * @param {string} newPassword - Nouveau mot de passe
     * @returns {Promise<Object>} { success, message }
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
            throw {
                message: error.response?.data?.message || 'Erreur lors du changement de mot de passe'
            };
        }
    },

    /**
     * Supprimer son compte
     * DELETE /api/users/me
     * 
     * @returns {Promise<Object>} { success, message }
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
            throw {
                message: error.response?.data?.message || 'Erreur lors de la suppression du compte'
            };
        }
    },

    /**
     * Récupérer les statistiques de l'utilisateur
     * GET /api/users/me/stats
     * 
     * @returns {Promise<Object>} Statistiques (scans, avis, etc.)
     */
    async getStats() {
        try {
            const response = await axiosInstance.get('/users/me/stats');

            if (response.data.success) {
                return response.data.data;
            }

            throw new Error('Erreur lors de la récupération des statistiques');
        } catch (error) {
            console.error('❌ Erreur getStats:', error);
            throw error;
        }
    },

    // ========================================
    // 🔑 MOT DE PASSE OUBLIÉ
    // ========================================

    /**
     * Demander une réinitialisation de mot de passe
     * POST /api/users/forgot-password
     * 
     * @param {string} email - Email du compte
     * @returns {Promise<Object>} { success, message }
     */
    async forgotPassword(email) {
        try {
            const response = await axiosInstance.post('/users/forgot-password', {
                email
            });

            return {
                success: response.data.success,
                message: response.data.message
            };
        } catch (error) {
            console.error('❌ Erreur forgotPassword:', error);
            throw {
                message: error.response?.data?.message || 'Erreur lors de la demande de réinitialisation'
            };
        }
    },

    /**
     * Réinitialiser le mot de passe avec le token reçu par email
     * POST /api/users/reset-password
     * 
     * @param {string} token - Token reçu par email
     * @param {string} newPassword - Nouveau mot de passe
     * @returns {Promise<Object>} { success, message }
     */
    async resetPassword(token, newPassword) {
        try {
            const response = await axiosInstance.post('/users/reset-password', {
                token,
                newPassword
            });

            return {
                success: response.data.success,
                message: response.data.message
            };
        } catch (error) {
            console.error('❌ Erreur resetPassword:', error);
            throw {
                message: error.response?.data?.message || 'Token invalide ou expiré'
            };
        }
    },

    // ========================================
    // ✅ UTILITAIRES D'AUTHENTIFICATION
    // ========================================

    /**
     * Vérifier si l'utilisateur est connecté
     * @returns {Promise<boolean>}
     */
    async isAuthenticated() {
        const token = await this.getToken();
        return !!token;
    },

    /**
     * Récupérer l'utilisateur actuellement connecté
     * @returns {Promise<Object|null>}
     */
    async getCurrentUser() {
        return await this.getUser();
    },

    /**
     * Vérifier si l'utilisateur est un admin
     * @returns {Promise<boolean>}
     */
    async isAdmin() {
        const user = await this.getUser();
        return user?.role === 'admin';
    },

    /**
     * Vérifier si l'utilisateur est un prestataire
     * @returns {Promise<boolean>}
     */
    async isPrestataire() {
        const user = await this.getUser();
        return user?.role === 'prestataire';
    },

    /**
     * Vérifier si l'utilisateur est un client
     * @returns {Promise<boolean>}
     */
    async isClient() {
        const user = await this.getUser();
        return user?.role === 'client';
    },

    // ========================================
    // 💾 STORAGE (localStorage)
    // ========================================

    /**
     * Stocker le token JWT
     */
    async setToken(token) {
        localStorage.setItem('token', token);
    },

    /**
     * Récupérer le token JWT
     */
    async getToken() {
        return localStorage.getItem('token');
    },

    /**
     * Stocker le refresh token
     */
    async setRefreshToken(refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
    },

    /**
     * Récupérer le refresh token
     */
    async getRefreshToken() {
        return localStorage.getItem('refreshToken');
    },

    /**
     * Stocker les infos utilisateur
     */
    async setUser(user) {
        localStorage.setItem('user', JSON.stringify(user));
    },

    /**
     * Récupérer les infos utilisateur
     */
    async getUser() {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    /**
     * Nettoyer tout le storage
     */
    async clearStorage() {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
    },

    // ========================================
    // 📱 DEVICE INFO
    // ========================================

    /**
     * Récupérer l'ID de l'appareil
     */
    async getDeviceId() {
        try {
            const { identifier } = await Device.getId();
            return identifier;
        } catch (error) {
            console.warn('Device ID non disponible, utilisation d\'un ID par défaut');
            return 'web-device-' + Date.now();
        }
    },

    /**
     * Récupérer les infos de l'appareil
     */
    async getDeviceInfo() {
        try {
            const info = await Device.getInfo();
            return {
                platform: info.platform,
                model: info.model,
                osVersion: info.osVersion,
                manufacturer: info.manufacturer
            };
        } catch (error) {
            console.warn('Device info non disponible');
            return null;
        }
    }
};

export default AuthService;