import Caller from './Caller.services';

const FiltreService = {
    /**
     * Récupérer tous les filtres d'une catégorie
     * @param {number} categoryId - ID de la catégorie
     * @returns {Promise} - Liste des filtres
     */
    getByCategory: async (categoryId) => {
        try {
            const response = await Caller.get(`/filtres/category/${categoryId}`);
            return response.data;
        } catch (error) {
            console.error('Erreur getByCategory:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur lors de la récupération des filtres',
                data: []
            };
        }
    },

    /**
     * Récupérer les filtres d'un prestataire
     * @param {number} prestataireId - ID du prestataire
     * @returns {Promise} - Liste des filtres du prestataire
     */
    getByPrestataire: async (prestataireId) => {
        try {
            const response = await Caller.get(`/filtres/prestataire/${prestataireId}`);
            return response.data;
        } catch (error) {
            console.error('Erreur getByPrestataire:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur lors de la récupération des filtres',
                data: []
            };
        }
    },

    /**
     * Assigner des filtres à un prestataire
     * @param {number} prestataireId - ID du prestataire
     * @param {array} filtreIds - Liste des IDs de filtres à assigner
     * @returns {Promise}
     */
    assignToPrestataire: async (prestataireId, filtreIds) => {
        try {
            const response = await Caller.post(`/filtres/prestataire/${prestataireId}`, { filtreIds });
            return response.data;
        } catch (error) {
            console.error('Erreur assignToPrestataire:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur lors de l\'assignation des filtres'
            };
        }
    },

    /**
     * Récupérer tous les filtres (admin)
     * @returns {Promise}
     */
    getAll: async () => {
        try {
            const response = await Caller.get('/filtres');
            return response.data;
        } catch (error) {
            console.error('Erreur getAll:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur lors de la récupération des filtres',
                data: []
            };
        }
    },

    /**
     * Créer un filtre (admin)
     * @param {object} filtreData - Données du filtre
     * @returns {Promise}
     */
    create: async (filtreData) => {
        try {
            const response = await Caller.post('/filtres', filtreData);
            return response.data;
        } catch (error) {
            console.error('Erreur create:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur lors de la création du filtre'
            };
        }
    },

    /**
     * Mettre à jour un filtre (admin)
     * @param {number} id - ID du filtre
     * @param {object} filtreData - Données à mettre à jour
     * @returns {Promise}
     */
    update: async (id, filtreData) => {
        try {
            const response = await Caller.put(`/filtres/${id}`, filtreData);
            return response.data;
        } catch (error) {
            console.error('Erreur update:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur lors de la mise à jour du filtre'
            };
        }
    },

    /**
     * Supprimer un filtre (admin)
     * @param {number} id - ID du filtre
     * @returns {Promise}
     */
    delete: async (id) => {
        try {
            const response = await Caller.delete(`/filtres/${id}`);
            return response.data;
        } catch (error) {
            console.error('Erreur delete:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur lors de la suppression du filtre'
            };
        }
    }
};

export default FiltreService;