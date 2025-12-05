import Caller from './Caller.services';

/**
 * 📊 StatsService
 * Service pour les statistiques prestataire
 */
const StatsService = {
    /**
     * Récupérer l'overview des statistiques
     * GET /api/stats/overview
     */
    getOverview: async () => {
        try {
            const response = await Caller.get('/stats/overview');
            return response.data;
        } catch (error) {
            console.error('Erreur getOverview:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur lors de la récupération'
            };
        }
    },

    /**
     * Récupérer les statistiques d'un prestataire
     * GET /api/stats/prestataire/:prestataireId
     */
    getByPrestataire: async (prestataireId, periode = 30) => {
        try {
            const response = await Caller.get(`/stats/prestataire/${prestataireId}?periode=${periode}`);
            return response.data;
        } catch (error) {
            console.error('Erreur getByPrestataire:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur lors de la récupération'
            };
        }
    },
};

export default StatsService;
