import axiosInstance from './Caller.services';

/**
 * 👤 UserService
 * Service pour gérer les données utilisateur et l'historique
 */
const UserService = {
    // ========================================
    // 📊 PROFIL & STATISTIQUES
    // ========================================

    /**
     * Récupérer le profil de l'utilisateur
     * GET /api/users/me
     */
    async getProfile() {
        try {
            const response = await axiosInstance.get('/users/me');
            return {
                success: true,
                data: response.data.data
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur lors de la récupération du profil',
                status: error.response?.status
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
            return {
                success: true,
                data: response.data.data
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur lors de la récupération des stats',
                status: error.response?.status
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
            return {
                success: true,
                data: response.data.data
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur lors de la mise à jour',
                status: error.response?.status
            };
        }
    },

    /**
    * Uploader l'image de profil
    */
    async uploadProfileImage(file) {
        try {
            const formData = new FormData();
            formData.append('profileImage', file);

            const response = await axiosInstance.post('/users/me/profile-image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return {
                success: true,
                data: response.data.data,
                message: response.data.message
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur lors de l\'upload de l\'image',
                status: error.response?.status
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
                success: true,
                message: response.data.message
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur lors du changement de mot de passe',
                status: error.response?.status
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
            return {
                success: true,
                message: response.data.message
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur lors de la suppression du compte',
                status: error.response?.status
            };
        }
    },

    // ========================================
    // 📜 HISTORIQUE DES SCANS
    // ========================================

    /**
     * Récupérer l'historique des scans du client
     * GET /api/scans/me
     * 
     * @param {number} page - Numéro de page (défaut: 1)
     * @param {number} limit - Nombre de résultats par page (défaut: 20)
     */
    async getMyScans(page = 1, limit = 20) {
        try {
            const response = await axiosInstance.get('/scans/me', {
                params: { page, limit }
            });
            return {
                success: true,
                data: response.data.data
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur lors de la récupération de l\'historique',
                status: error.response?.status
            };
        }
    },

    /**
     * Récupérer les statistiques des scans du client
     * GET /api/scans/me/stats
     */
    async getScanStats() {
        try {
            const response = await axiosInstance.get('/scans/me/stats');
            return {
                success: true,
                data: response.data.data
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur lors de la récupération des stats',
                status: error.response?.status
            };
        }
    },

    // ========================================
    // ⭐ AVIS
    // ========================================

    /**
     * Récupérer les avis laissés par l'utilisateur
     * GET /api/avis/me
     */
    async getMyReviews() {
        try {
            const response = await axiosInstance.get('/avis/me');
            return {
                success: true,
                data: response.data.data
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur lors de la récupération des avis',
                status: error.response?.status
            };
        }
    },

    /**
     * Laisser un avis
     * POST /api/avis
     */
    async createReview(scanId, note) {
        try {
            const response = await axiosInstance.post('/avis', {
                scanId,
                note
            });
            return {
                success: true,
                data: response.data.data
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur lors de la création de l\'avis',
                status: error.response?.status
            };
        }
    },

    // ========================================
    // 🔍 QR CODE
    // ========================================

    /**
     * Récupérer le QR code de l'utilisateur
     * Le QR code est dans les données du profil client
     */
    async getQRCode() {
        try {
            const profileResult = await this.getProfile();
            if (!profileResult.success) {
                return profileResult;
            }

            const qrCode = profileResult.data.client?.qrCode;
            if (!qrCode) {
                return {
                    success: false,
                    message: 'QR Code non trouvé'
                };
            }

            return {
                success: true,
                data: qrCode
            };
        } catch (error) {
            return {
                success: false,
                message: 'Erreur lors de la récupération du QR Code',
                status: error.response?.status
            };
        }
    },
};

export default UserService;