import Caller from './Caller.services';

const PrestataireService = {
    /**
     * Récupérer tous les prestataires avec filtres
     * @param {object} params - Paramètres de recherche
     * @returns {Promise}
     */
    getAll: async (params = {}) => {
        try {
            const queryParams = new URLSearchParams();

            if (params.page) queryParams.append('page', params.page);
            if (params.limit) queryParams.append('limit', params.limit);
            if (params.ville) queryParams.append('ville', params.ville);
            if (params.categoryId) queryParams.append('categoryId', params.categoryId);
            if (params.typeCommerce) queryParams.append('typeCommerce', params.typeCommerce);
            if (params.noteMin) queryParams.append('noteMin', params.noteMin);
            if (params.search) queryParams.append('search', params.search);
            if (params.filtres && params.filtres.length > 0) {
                queryParams.append('filtres', params.filtres.join(','));
            }

            const response = await Caller.get(`/prestataires?${queryParams.toString()}`);
            return response.data;
        } catch (error) {
            console.error('Erreur getAll:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur lors de la récupération',
                data: { prestataires: [], pagination: {} }
            };
        }
    },

    /**
     * Récupérer les prestataires par ville avec filtres
     * @param {string} ville - Nom de la ville
     * @param {number} categoryId - ID de la catégorie (optionnel)
     * @param {array} filtreIds - IDs des filtres sélectionnés (optionnel)
     * @returns {Promise}
     */
    getByVille: async (ville, categoryId = null, filtreIds = []) => {
        try {
            const queryParams = new URLSearchParams();

            if (categoryId) queryParams.append('categoryId', categoryId);
            if (filtreIds && filtreIds.length > 0) {
                queryParams.append('filtres', filtreIds.join(','));
            }

            const queryString = queryParams.toString();
            const url = `/prestataires/ville/${encodeURIComponent(ville)}${queryString ? '?' + queryString : ''}`;

            const response = await Caller.get(url);
            return response.data;
        } catch (error) {
            console.error('Erreur getByVille:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur lors de la récupération',
                data: { prestataires: [] }
            };
        }
    },

    /**
     * Récupérer un prestataire par ID
     * @param {number} id - ID du prestataire
     * @returns {Promise}
     */
    getById: async (id) => {
        try {
            const response = await Caller.get(`/prestataires/${id}`);
            return response.data;
        } catch (error) {
            console.error('Erreur getById:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur lors de la récupération'
            };
        }
    },

    /**
     * Recherche par proximité GPS avec filtres
     * @param {object} params - latitude, longitude, rayon, categoryId, filtres
     * @returns {Promise}
     */
    searchNearby: async (params) => {
        try {
            const queryParams = new URLSearchParams();

            queryParams.append('latitude', params.latitude);
            queryParams.append('longitude', params.longitude);
            if (params.rayon) queryParams.append('rayon', params.rayon);
            if (params.categoryId) queryParams.append('categoryId', params.categoryId);
            if (params.filtres && params.filtres.length > 0) {
                queryParams.append('filtres', params.filtres.join(','));
            }

            const response = await Caller.get(`/prestataires/search/nearby?${queryParams.toString()}`);
            return response.data;
        } catch (error) {
            console.error('Erreur searchNearby:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur lors de la recherche'
            };
        }
    },

    /**
     * Récupérer les promotions d'un prestataire
     * @param {number} id - ID du prestataire
     * @returns {Promise}
     */
    getPromotions: async (id) => {
        try {
            const response = await Caller.get(`/prestataires/${id}/promotions`);
            return response.data;
        } catch (error) {
            console.error('Erreur getPromotions:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur lors de la récupération'
            };
        }
    },

    // ==========================================
    // CATEGORIES
    // ==========================================

    /**
     * Récupérer toutes les catégories
     * @returns {Promise}
     */
    getCategories: async () => {
        try {
            const response = await Caller.get('/categories');
            return response.data;
        } catch (error) {
            console.error('Erreur getCategories:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur lors de la récupération',
                data: []
            };
        }
    },

    // ==========================================
    // GESTION DES FICHES (Mon Commerce)
    // ==========================================

    /**
     * Récupérer mes fiches commerce
     * @returns {Promise}
     */
    getMyFiches: async () => {
        try {
            const response = await Caller.get('/prestataires/me/fiches');
            return response.data;
        } catch (error) {
            console.error('Erreur getMyFiches:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur lors de la récupération',
                data: { fiches: [], maxFiches: 1, peutCreer: false }
            };
        }
    },

    /**
     * Créer une nouvelle fiche commerce
     * @param {object} data - Données de la fiche
     * @returns {Promise}
     */
    createFiche: async (data) => {
        try {
            const response = await Caller.post('/prestataires/me/fiches', data);
            return response.data;
        } catch (error) {
            console.error('Erreur createFiche:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur lors de la création'
            };
        }
    },

    /**
     * Modifier une fiche commerce
     * @param {number} ficheId - ID de la fiche
     * @param {object} data - Données à mettre à jour
     * @returns {Promise}
     */
    updateFiche: async (ficheId, data) => {
        try {
            const response = await Caller.put(`/prestataires/me/fiches/${ficheId}`, data);
            return response.data;
        } catch (error) {
            console.error('Erreur updateFiche:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur lors de la mise à jour'
            };
        }
    },

    /**
     * Supprimer une fiche commerce
     * @param {number} ficheId - ID de la fiche
     * @returns {Promise}
     */
    deleteFiche: async (ficheId) => {
        try {
            const response = await Caller.delete(`/prestataires/me/fiches/${ficheId}`);
            return response.data;
        } catch (error) {
            console.error('Erreur deleteFiche:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur lors de la suppression'
            };
        }
    },

    /**
     * Réactiver une fiche commerce
     * @param {number} ficheId - ID de la fiche
     * @returns {Promise}
     */
    reactivateFiche: async (ficheId) => {
        try {
            const response = await Caller.post(`/prestataires/me/fiches/${ficheId}/reactivate`);
            return response.data;
        } catch (error) {
            console.error('Erreur reactivateFiche:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur lors de la réactivation'
            };
        }
    },

    // ==========================================
    // ROUTES PRESTATAIRE (authentifié) - LEGACY
    // ==========================================

    /**
     * Créer un nouveau commerce
     * @param {object} data - Données du commerce + filtreIds
     * @returns {Promise}
     */
    create: async (data) => {
        try {
            const response = await Caller.post('/prestataires', data);
            return response.data;
        } catch (error) {
            console.error('Erreur create:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur lors de la création'
            };
        }
    },

    /**
     * Récupérer tous mes commerces
     * @returns {Promise}
     */
    getAllMine: async () => {
        try {
            const response = await Caller.get('/prestataires/me/all');
            return response.data;
        } catch (error) {
            console.error('Erreur getAllMine:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur lors de la récupération',
                data: []
            };
        }
    },

    /**
     * Récupérer mon commerce (premier)
     * @returns {Promise}
     */
    getMe: async () => {
        try {
            const response = await Caller.get('/prestataires/me/info');
            return response.data;
        } catch (error) {
            console.error('Erreur getMe:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur lors de la récupération'
            };
        }
    },

    /**
     * Récupérer un de mes commerces spécifique
     * @param {number} prestataireId - ID du prestataire
     * @returns {Promise}
     */
    getMine: async (prestataireId) => {
        try {
            const response = await Caller.get(`/prestataires/me/${prestataireId}`);
            return response.data;
        } catch (error) {
            console.error('Erreur getMine:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur lors de la récupération'
            };
        }
    },

    /**
     * Modifier un de mes commerces
     * @param {number} prestataireId - ID du prestataire
     * @param {object} data - Données à mettre à jour + filtreIds
     * @returns {Promise}
     */
    updateMine: async (prestataireId, data) => {
        try {
            const response = await Caller.put(`/prestataires/me/${prestataireId}`, data);
            return response.data;
        } catch (error) {
            console.error('Erreur updateMine:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur lors de la mise à jour'
            };
        }
    },

    /**
     * Modifier mon commerce (premier)
     * @param {object} data - Données à mettre à jour
     * @returns {Promise}
     */
    updateMe: async (data) => {
        try {
            const response = await Caller.put('/prestataires/me', data);
            return response.data;
        } catch (error) {
            console.error('Erreur updateMe:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur lors de la mise à jour'
            };
        }
    },

    /**
     * Supprimer un de mes commerces
     * @param {number} prestataireId - ID du prestataire
     * @returns {Promise}
     */
    deleteMine: async (prestataireId) => {
        try {
            const response = await Caller.delete(`/prestataires/me/${prestataireId}`);
            return response.data;
        } catch (error) {
            console.error('Erreur deleteMine:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur lors de la suppression'
            };
        }
    },

    /**
     * Ajouter une image
     * @param {string} url - URL de l'image
     * @param {number} prestataireId - ID du prestataire (optionnel)
     * @returns {Promise}
     */
    addImage: async (url, prestataireId = null) => {
        try {
            const data = { url };
            if (prestataireId) data.prestataireId = prestataireId;

            const response = await Caller.post('/prestataires/me/images', data);
            return response.data;
        } catch (error) {
            console.error('Erreur addImage:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur lors de l\'ajout'
            };
        }
    },

    /**
     * Supprimer une image
     * @param {number} index - Index de l'image
     * @param {number} prestataireId - ID du prestataire (optionnel)
     * @returns {Promise}
     */
    deleteImage: async (index, prestataireId = null) => {
        try {
            const queryParams = prestataireId ? `?prestataireId=${prestataireId}` : '';
            const response = await Caller.delete(`/prestataires/me/images/${index}${queryParams}`);
            return response.data;
        } catch (error) {
            console.error('Erreur deleteImage:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur lors de la suppression'
            };
        }
    },

    /**
     * Modifier les horaires
     * @param {object} horaires - Horaires
     * @param {number} prestataireId - ID du prestataire (optionnel)
     * @returns {Promise}
     */
    updateHoraires: async (horaires, prestataireId = null) => {
        try {
            const data = { horaires };
            if (prestataireId) data.prestataireId = prestataireId;

            const response = await Caller.put('/prestataires/me/horaires', data);
            return response.data;
        } catch (error) {
            console.error('Erreur updateHoraires:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur lors de la mise à jour'
            };
        }
    },

    /**
     * Récupérer les statistiques
     * @param {number} prestataireId - ID du prestataire (optionnel)
     * @returns {Promise}
     */
    getStats: async (prestataireId = null) => {
        try {
            const queryParams = prestataireId ? `?prestataireId=${prestataireId}` : '';
            const response = await Caller.get(`/prestataires/me/stats${queryParams}`);
            return response.data;
        } catch (error) {
            console.error('Erreur getStats:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur lors de la récupération'
            };
        }
    },

    /**
     * Récupérer l'historique des scans
     * @param {object} params - page, limit, prestataireId
     * @returns {Promise}
     */
    getScans: async (params = {}) => {
        try {
            const queryParams = new URLSearchParams();
            if (params.page) queryParams.append('page', params.page);
            if (params.limit) queryParams.append('limit', params.limit);
            if (params.prestataireId) queryParams.append('prestataireId', params.prestataireId);

            const response = await Caller.get(`/prestataires/me/scans?${queryParams.toString()}`);
            return response.data;
        } catch (error) {
            console.error('Erreur getScans:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur lors de la récupération'
            };
        }
    },

    /**
     * Récupérer les derniers visiteurs d'un prestataire
     * @param {number} id - ID du prestataire
     * @param {number} limit - Nombre de visiteurs (défaut: 5)
     * @returns {Promise}
     */
    getRecentVisitors: async (id, limit = 5) => {
        try {
            const response = await Caller.get(`/prestataires/${id}/visitors?limit=${limit}`);
            return response.data;
        } catch (error) {
            console.error('Erreur getRecentVisitors:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur lors de la récupération',
                data: []
            };
        }
    },
};

export default PrestataireService;