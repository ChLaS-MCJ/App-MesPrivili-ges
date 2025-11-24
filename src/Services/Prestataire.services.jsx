import axiosInstance from './Caller.services';

/**
 * 🏪 PrestataireService
 * Service pour gérer les prestataires et la carte
 */
const PrestataireService = {
    /**
     * Récupérer tous les prestataires
     * GET /api/prestataires
     */
    async getAll(params = {}) {
        try {
            const response = await axiosInstance.get('/prestataires', { params });
            return {
                success: true,
                data: response.data.data
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur lors de la récupération des prestataires',
                status: error.response?.status
            };
        }
    },

    /**
     * Récupérer les prestataires par ville
     * GET /api/prestataires/ville/:ville
     */
    async getByVille(ville, categoryId = null) {
        try {
            const params = categoryId ? { categoryId } : {};
            const response = await axiosInstance.get(`/prestataires/ville/${encodeURIComponent(ville)}`, { params });
            return {
                success: true,
                data: response.data.data
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur lors de la récupération',
                status: error.response?.status
            };
        }
    },

    /**
     * Récupérer les prestataires à proximité
     * GET /api/prestataires/search/nearby
     */
    async searchNearby(latitude, longitude, rayon = 50, categoryId = null) {
        try {
            const params = { latitude, longitude, rayon };
            if (categoryId) params.categoryId = categoryId;
            
            const response = await axiosInstance.get('/prestataires/search/nearby', { params });
            return {
                success: true,
                data: response.data.data
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur lors de la recherche',
                status: error.response?.status
            };
        }
    },

    /**
     * Récupérer un prestataire par ID
     * GET /api/prestataires/:id
     */
    async getById(id) {
        try {
            const response = await axiosInstance.get(`/prestataires/${id}`);
            return {
                success: true,
                data: response.data.data
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur lors de la récupération',
                status: error.response?.status
            };
        }
    },

    /**
     * Récupérer toutes les catégories
     * GET /api/categories
     */
    async getCategories() {
        try {
            const response = await axiosInstance.get('/categories');
            return {
                success: true,
                data: response.data.data
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur lors de la récupération des catégories',
                status: error.response?.status
            };
        }
    },

    /**
     * Récupérer les promotions d'un prestataire
     * GET /api/prestataires/:id/promotions
     */
    async getPromotions(prestataireId) {
        try {
            const response = await axiosInstance.get(`/prestataires/${prestataireId}/promotions`);
            return {
                success: true,
                data: response.data.data
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur lors de la récupération des promotions',
                status: error.response?.status
            };
        }
    }
};

export default PrestataireService;
