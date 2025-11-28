// Services/Scan.services.js
import Caller from './Caller.services';

const ScanService = {
    /**
     * Récupérer mes fiches avec leurs promotions (PRESTATAIRE)
     */
    getMyFichesWithPromos: async () => {
        try {
            const response = await Caller.get('/prestataires/me/fiches');
            return response.data;
        } catch (error) {
            throw error.response?.data || { success: false, message: 'Erreur lors de la récupération des fiches' };
        }
    },

    /**
     * Scanner le QR code d'un client (PRESTATAIRE)
     */
    scan: async (qrCode, promotionId, prestataireId) => {
        try {
            const response = await Caller.post('/scans/scan', {
                qrCode,
                promotionId,
                prestataireId
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { success: false, message: 'Erreur lors du scan' };
        }
    },

    /**
     * Récupérer mes promotions actives (PRESTATAIRE)
     */
    getMyPromotions: async () => {
        try {
            const response = await Caller.get('/promotions/me/list');
            return response.data;
        } catch (error) {
            throw error.response?.data || { success: false, message: 'Erreur lors de la récupération' };
        }
    },

    /**
     * Historique des scans (PRESTATAIRE)
     */
    getHistory: async () => {
        try {
            const response = await Caller.get('/scans/history');
            return response.data;
        } catch (error) {
            throw error.response?.data || { success: false, message: 'Erreur lors de la récupération' };
        }
    },

    /**
     * Mes scans (CLIENT)
     */
    getMyScans: async () => {
        try {
            const response = await Caller.get('/scans/me');
            return response.data;
        } catch (error) {
            throw error.response?.data || { success: false, message: 'Erreur lors de la récupération' };
        }
    }
};

export default ScanService;