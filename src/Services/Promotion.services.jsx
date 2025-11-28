import Caller from './Caller.services';

const PromotionService = {
    /**
     * Récupérer toutes les promotions actives
     * @param {object} params - ville, categoryId (optionnel)
     * @returns {Promise}
     */
    getAll: async (params = {}) => {
        try {
            const queryParams = new URLSearchParams();
            if (params.ville) queryParams.append('ville', params.ville);
            if (params.categoryId) queryParams.append('categoryId', params.categoryId);

            const queryString = queryParams.toString();
            const url = `/promotions${queryString ? '?' + queryString : ''}`;

            const response = await Caller.get(url);
            return response.data;
        } catch (error) {
            console.error('Erreur getAll promotions:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur lors de la récupération',
                data: []
            };
        }
    },

    /**
     * Récupérer une promotion par ID
     * @param {number} id - ID de la promotion
     * @returns {Promise}
     */
    getById: async (id) => {
        try {
            const response = await Caller.get(`/promotions/${id}`);
            return response.data;
        } catch (error) {
            console.error('Erreur getById promotion:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur lors de la récupération'
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
            const response = await Caller.get(`/promotions/prestataire/${prestataireId}`);
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
     * Récupérer mes promotions (prestataire connecté) - toutes les fiches
     * @returns {Promise}
     */
    getMine: async () => {
        try {
            const response = await Caller.get('/promotions/me/list');
            return response.data;
        } catch (error) {
            console.error('Erreur getMine promotions:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur lors de la récupération',
                data: []
            };
        }
    },

    /**
     * Récupérer mes promotions pour une fiche spécifique
     * @param {number} prestataireId - ID de la fiche
     * @returns {Promise}
     */
    getMyPromotions: async (prestataireId) => {
        try {
            const response = await Caller.get(`/promotions/me/fiche/${prestataireId}`);
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
     * Créer une promotion
     * @param {object} data - titre, description, etiquette, dateDebut, dateFin, prestataireId
     * @returns {Promise}
     */
    create: async (data) => {
        try {
            const response = await Caller.post('/promotions', data);
            return response.data;
        } catch (error) {
            console.error('Erreur create promotion:', error);
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
            console.error('Erreur update promotion:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur lors de la mise à jour'
            };
        }
    },

    /**
     * Activer/Désactiver une promotion
     * @param {number} id - ID de la promotion
     * @param {boolean} estActive - Nouvel état
     * @returns {Promise}
     */
    toggleActive: async (id, estActive) => {
        try {
            const response = await Caller.put(`/promotions/${id}/toggle`, { estActive });
            return response.data;
        } catch (error) {
            console.error('Erreur toggleActive promotion:', error);
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
            console.error('Erreur delete promotion:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur lors de la suppression'
            };
        }
    },

    /**
     * Utiliser une promotion (lors d'un scan)
     * @param {number} id - ID de la promotion
     * @param {boolean} nouveauClient - Si c'est un nouveau client
     * @returns {Promise}
     */
    usePromotion: async (id, nouveauClient = false) => {
        try {
            const response = await Caller.post(`/promotions/${id}/use`, { nouveauClient });
            return response.data;
        } catch (error) {
            console.error('Erreur usePromotion:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur lors de l\'utilisation'
            };
        }
    }
};

export default PromotionService;