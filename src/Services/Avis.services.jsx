import Caller from './Caller.services';

/**
 * ⭐ AvisService
 * Service pour la gestion des avis
 */
const AvisService = {
    /**
     * Créer un avis après un scan
     * POST /api/avis
     */
    create: async (scanId, note) => {
        try {
            const response = await Caller.post('/avis', {
                scanId,
                note
            });
            return response.data;
        } catch (error) {
            console.error('Erreur create avis:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur lors de la création de l\'avis'
            };
        }
    },

    /**
     * Récupérer mes avis
     * GET /api/avis/me
     */
    getMine: async () => {
        try {
            const response = await Caller.get('/avis/me');
            return response.data;
        } catch (error) {
            console.error('Erreur getMine avis:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur lors de la récupération',
                data: []
            };
        }
    },

    /**
     * Vérifier si j'ai déjà visité un prestataire (pour savoir si je peux noter)
     * GET /api/scans/me/prestataire/:prestataireId
     */
    checkCanRate: async (prestataireId) => {
        try {
            const response = await Caller.get(`/scans/me/prestataire/${prestataireId}`);
            return response.data;
        } catch (error) {
            console.error('Erreur checkCanRate:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur lors de la vérification',
                data: { canRate: false, scans: [] }
            };
        }
    },
};

export default AvisService;
