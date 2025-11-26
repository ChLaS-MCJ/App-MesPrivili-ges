import Caller from './Caller.services';

const PromotionService = {
    /**
     * Récupérer mes promotions (pour un prestataire spécifique)
     * @param {number} prestataireId - ID du prestataire
     * @returns {Promise}
     */
    getMyPromotions: async (prestataireId) => {
        try {
            const url = prestataireId 
                ? `/promotions/me?prestataireId=${prestataireId}`
                : '/promotions/me';
            const response = await Caller.get(url);
            return response.data;
        } catch (error) {
            console.error('Erreur getMyPromotions:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur lors de la récupération',
                data: []
            };
        }
    },

    /**
     * Récupérer les promotions d'un prestataire (public)
     * @param {number} prestataireId - ID du prestataire
     * @returns {Promise}
     */
    getByPrestataireId: async (prestataireId) => {
        try {
            const response = await Caller.get(`/prestataires/${prestataireId}/promotions`);
            return response.data;
        } catch (error) {
            console.error('Erreur getByPrestataireId:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur lors de la récupération',
                data: []
            };
        }
    },

    /**
     * Créer une promotion
     * @param {object} data - Données de la promotion
     * @returns {Promise}
     */
    create: async (data) => {
        try {
            const response = await Caller.post('/promotions', data);
            return response.data;
        } catch (error) {
            console.error('Erreur create:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur lors de la création'
            };
        }
    },

    /**
     * Modifier une promotion
     * @param {number} id - ID de la promotion
     * @param {object} data - Données à mettre à jour
     * @returns {Promise}
     */
    update: async (id, data) => {
        try {
            const response = await Caller.put(`/promotions/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Erreur update:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur lors de la mise à jour'
            };
        }
    },

    /**
     * Supprimer une promotion
     * @param {number} id - ID de la promotion
     * @returns {Promise}
     */
    delete: async (id) => {
        try {
            const response = await Caller.delete(`/promotions/${id}`);
            return response.data;
        } catch (error) {
            console.error('Erreur delete:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur lors de la suppression'
            };
        }
    },

    /**
     * Activer/désactiver une promotion
     * @param {number} id - ID de la promotion
     * @param {boolean} estActive - Nouvel état
     * @returns {Promise}
     */
    toggleActive: async (id, estActive) => {
        try {
            const response = await Caller.put(`/promotions/${id}/toggle`, { estActive });
            return response.data;
        } catch (error) {
            console.error('Erreur toggleActive:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur lors de la mise à jour'
            };
        }
    }
};

export default PromotionService;
