import Caller from './Caller.services';

/**
 * ⭐ AvisService
 * Service pour gérer les avis/notes
 */
const AvisService = {
    /**
     * Créer un avis après un scan
     * POST /api/avis
     * 
     * @param {number} scanId - ID du scan
     * @param {number} note - Note de 1 à 5
     */
    async create(scanId, note) {
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
                message: error.response?.data?.message || 'Erreur lors de l\'envoi de l\'avis'
            };
        }
    },

    /**
     * Récupérer les avis d'un prestataire
     * GET /api/avis/prestataire/:prestataireId
     * 
     * @param {number} prestataireId - ID du prestataire
     * @param {number} page - Numéro de page (défaut: 1)
     * @param {number} limit - Nombre par page (défaut: 20)
     */
    async getByPrestataire(prestataireId, page = 1, limit = 20) {
        try {
            const response = await Caller.get(`/avis/prestataire/${prestataireId}`, {
                params: { page, limit }
            });
            return response.data;
        } catch (error) {
            console.error('Erreur getByPrestataire:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur lors de la récupération des avis',
                data: { avis: [], pagination: {} }
            };
        }
    },

    /**
     * Récupérer mes avis (client connecté)
     * GET /api/avis/me
     */
    async getMine() {
        try {
            const response = await Caller.get('/avis/me');
            return response.data;
        } catch (error) {
            console.error('Erreur getMine:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur lors de la récupération de vos avis',
                data: []
            };
        }
    },

    /**
     * Vérifier si l'utilisateur peut noter un prestataire
     * (basé sur s'il a un scan non noté)
     * 
     * @param {number} prestataireId - ID du prestataire
     */
    async canRate(prestataireId) {
        try {
            // On récupère les scans du user pour ce prestataire
            const response = await Caller.get(`/scans/me/prestataire/${prestataireId}`);

            if (response.data.success && response.data.data) {
                // Chercher un scan non noté
                const scanNonNote = response.data.data.find(scan => !scan.aEteNote);
                return {
                    success: true,
                    canRate: !!scanNonNote,
                    scanId: scanNonNote?.id || null
                };
            }

            return {
                success: true,
                canRate: false,
                scanId: null
            };
        } catch (error) {
            console.error('Erreur canRate:', error);
            return {
                success: false,
                canRate: false,
                scanId: null
            };
        }
    }
};

export default AvisService;