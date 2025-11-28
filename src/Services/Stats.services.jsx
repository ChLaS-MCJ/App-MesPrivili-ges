import Caller from './Caller.services';

const StatsService = {
    /**
     * Récupérer la vue d'ensemble de toutes les fiches
     * @returns {Promise}
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
     * Récupérer les statistiques détaillées d'une fiche
     * @param {number} prestataireId - ID de la fiche
     * @param {number} periode - Nombre de jours (7, 30, 90, 365)
     * @returns {Promise}
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
    }
};

export default StatsService;