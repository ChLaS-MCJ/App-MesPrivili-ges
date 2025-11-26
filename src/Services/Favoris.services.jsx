import Caller from './Caller.services';

/**
 * 💖 FavorisService
 * Service pour gérer les commerces favoris
 */
const FavorisService = {
    /**
     * Récupérer la liste des favoris
     * GET /api/users/me/favoris
     */
    async getAll() {
        try {
            const response = await Caller.get('/users/me/favoris');
            return response.data;
        } catch (error) {
            console.error('Erreur getAll favoris:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur lors de la récupération des favoris',
                data: []
            };
        }
    },

    /**
     * Vérifier si un commerce est en favori
     * GET /api/users/me/favoris/:prestataireId
     * 
     * @param {number} prestataireId - ID du prestataire
     */
    async checkFavori(prestataireId) {
        try {
            const response = await Caller.get(`/users/me/favoris/${prestataireId}`);
            return response.data;
        } catch (error) {
            console.error('Erreur checkFavori:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur lors de la vérification',
                data: { isFavori: false }
            };
        }
    },

    /**
     * Ajouter un commerce aux favoris
     * POST /api/users/me/favoris/:prestataireId
     * 
     * @param {number} prestataireId - ID du prestataire
     */
    async addFavori(prestataireId) {
        try {
            const response = await Caller.post(`/users/me/favoris/${prestataireId}`);
            return response.data;
        } catch (error) {
            console.error('Erreur addFavori:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur lors de l\'ajout aux favoris'
            };
        }
    },

    /**
     * Retirer un commerce des favoris
     * DELETE /api/users/me/favoris/:prestataireId
     * 
     * @param {number} prestataireId - ID du prestataire
     */
    async removeFavori(prestataireId) {
        try {
            const response = await Caller.delete(`/users/me/favoris/${prestataireId}`);
            return response.data;
        } catch (error) {
            console.error('Erreur removeFavori:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur lors du retrait des favoris'
            };
        }
    },

    /**
     * Toggle favori (ajoute si pas favori, retire si déjà favori)
     * Méthode helper côté front
     * 
     * @param {number} prestataireId - ID du prestataire
     * @param {boolean} currentState - État actuel du favori
     */
    async toggleFavori(prestataireId, currentState) {
        if (currentState) {
            return this.removeFavori(prestataireId);
        } else {
            return this.addFavori(prestataireId);
        }
    }
};

export default FavorisService;
