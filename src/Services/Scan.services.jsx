import Caller from './Caller.services';

/**
 * 📱 ScanService
 * Service pour les opérations de scan QR code
 */
const ScanService = {
    /**
     * Récupérer mes fiches avec leurs promotions (PRESTATAIRE)
     * Utilisé par: ScanModal.jsx ligne 50
     * GET /api/prestataires/me/fiches
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
     * Utilisé par: ScanModal.jsx ligne 180
     * POST /api/scans/scan
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
     * Récupérer l'historique des scans (côté prestataire)
     * GET /api/scans/history
     */
    getHistory: async () => {
        try {
            const response = await Caller.get('/scans/history');
            return response.data;
        } catch (error) {
            console.error('Erreur getHistory:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur lors de la récupération',
                data: []
            };
        }
    },

    /**
     * Récupérer mes scans (côté client)
     * GET /api/scans/me
     */
    getMyScans: async () => {
        try {
            const response = await Caller.get('/scans/me');
            return response.data;
        } catch (error) {
            console.error('Erreur getMyScans:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur lors de la récupération',
                data: []
            };
        }
    },

    /**
     * Récupérer le dernier scan en attente de notation (côté client)
     * Utilisé par: QRCodeModal.jsx
     * GET /api/scans/last-pending
     */
    getLastPending: async () => {
        try {
            const response = await Caller.get('/scans/last-pending');
            return response.data;
        } catch (error) {
            console.error('Erreur getLastPending:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur lors de la récupération',
                data: null
            };
        }
    },
};

export default ScanService;
