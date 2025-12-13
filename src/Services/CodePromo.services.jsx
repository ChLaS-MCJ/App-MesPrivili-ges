import Caller from './Caller.services';

/**
 * 🎁 CodePromoService
 * Service pour la gestion des codes promotionnels
 */
const CodePromoService = {
    /**
     * Vérifier si un code existe (feedback temps réel)
     * GET /api/codes-promo/check/:code
     * 
     * @param {string} code - Le code à vérifier
     * @returns {Object} { success, exists, data? }
     */
    checkCode: async (code) => {
        try {
            if (!code || code.length < 3) {
                return { success: false, exists: false };
            }

            const response = await Caller.get(`/codes-promo/check/${encodeURIComponent(code.toUpperCase())}`);
            return response.data;
        } catch (error) {
            console.error('Erreur checkCode:', error);
            return { success: false, exists: false };
        }
    },

    /**
     * Valider un code promo avant de l'appliquer
     * POST /api/codes-promo/validate
     * 
     * @param {string} code - Le code promo
     * @param {number|null} categoryId - ID de la catégorie (optionnel)
     * @returns {Object} { success, message, data? }
     */
    validateCode: async (code, categoryId = null) => {
        try {
            const response = await Caller.post('/codes-promo/validate', {
                code: code.toUpperCase().trim(),
                categoryId
            });
            return response.data;
        } catch (error) {
            console.error('Erreur validateCode:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur lors de la validation du code'
            };
        }
    },

    /**
     * Appliquer un code promo et créer la souscription
     * POST /api/codes-promo/apply
     * 
     * @param {string} code - Le code promo
     * @param {number|null} prestataireId - ID de la fiche à activer (optionnel)
     * @returns {Object} { success, message, data? }
     */
    applyCode: async (code, prestataireId = null) => {
        try {
            const response = await Caller.post('/codes-promo/apply', {
                code: code.toUpperCase().trim(),
                prestataireId
            });
            return response.data;
        } catch (error) {
            console.error('Erreur applyCode:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur lors de l\'application du code promo'
            };
        }
    },

    /**
     * Récupérer mes codes promo utilisés
     * GET /api/codes-promo/mes-codes
     * 
     * @returns {Object} { success, data: Array }
     */
    getMesCodesUtilises: async () => {
        try {
            const response = await Caller.get('/codes-promo/mes-codes');
            return response.data;
        } catch (error) {
            console.error('Erreur getMesCodesUtilises:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur lors de la récupération',
                data: []
            };
        }
    },
    /**
     * Valider un code promo pour le checkout (codes réduction uniquement)
     * POST /api/codes-promo/validate-for-checkout
     * 
     * @param {string} code - Le code promo
     * @param {string} abonnementCode - Code de l'abonnement sélectionné
     * @param {number} nombreFiches - Nombre de fiches
     * @returns {Object} { success, message, data? }
     */
    validateForCheckout: async (code, abonnementCode, nombreFiches = 1) => {
        try {
            const response = await Caller.post('/codes-promo/validate-for-checkout', {
                code: code.toUpperCase().trim(),
                abonnementCode,
                nombreFiches
            });
            return response.data;
        } catch (error) {
            console.error('Erreur validateForCheckout:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur lors de la validation du code'
            };
        }
    },
};

export default CodePromoService;
