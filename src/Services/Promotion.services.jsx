import Caller from './Caller.services';

/**
 * 🎁 PromotionService
 * Service pour la gestion des promotions
 */
const PromotionService = {
    // ==========================================
    // 🔍 CONSULTATION PUBLIQUE
    // ==========================================

    /**
     * Récupérer les promotions d'un prestataire (public)
     * GET /api/promotions/prestataire/:prestataireId
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

    // ==========================================
    // 🏪 GESTION MES PROMOTIONS (Prestataire connecté)
    // ==========================================

    /**
     * Récupérer mes promotions pour une fiche spécifique
     * GET /api/promotions/me/fiche/:prestataireId
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
     * POST /api/promotions
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
     * PUT /api/promotions/:id
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
     * PUT /api/promotions/:id/toggle
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
     * DELETE /api/promotions/:id
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
};

export default PromotionService;
