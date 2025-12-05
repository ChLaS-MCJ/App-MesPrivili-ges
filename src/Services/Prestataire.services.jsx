import Caller from './Caller.services';

/**
 * 🏪 PrestataireService
 * Service pour la gestion des fiches commerce
 */
const PrestataireService = {
    // ==========================================
    // 🔍 RECHERCHE PUBLIQUE
    // ==========================================

    /**
     * Récupérer tous les prestataires avec filtres
     * GET /api/prestataires
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
     * GET /api/prestataires/ville/:ville
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
     * GET /api/prestataires/:id
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

    // ==========================================
    // 📁 CATEGORIES
    // ==========================================

    /**
     * Récupérer toutes les catégories
     * GET /api/categories
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
    // 🏪 GESTION MES FICHES (Prestataire connecté)
    // ==========================================

    /**
     * Récupérer mes fiches commerce
     * GET /api/prestataires/me/fiches
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
     * POST /api/prestataires/me/fiches
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
     * PUT /api/prestataires/me/fiches/:id
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
     * DELETE /api/prestataires/me/fiches/:id
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

    // ==========================================
    // 💳 SOUSCRIPTIONS & ACTIVATION
    // ==========================================

    /**
     * Récupérer les souscriptions disponibles pour activer une fiche
     * GET /api/prestataires/me/souscriptions-disponibles
     */
    getSouscriptionsDisponibles: async () => {
        try {
            const response = await Caller.get('/prestataires/me/souscriptions-disponibles');
            return response.data;
        } catch (error) {
            console.error('Erreur getSouscriptionsDisponibles:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur lors de la récupération',
                data: []
            };
        }
    },

    /**
     * Activer une fiche avec une souscription
     * POST /api/prestataires/me/fiches/:id/activer
     */
    activerFicheAvecSouscription: async (ficheId, souscriptionId) => {
        try {
            const response = await Caller.post(`/prestataires/me/fiches/${ficheId}/activer`, {
                souscriptionId
            });
            return response.data;
        } catch (error) {
            console.error('Erreur activerFicheAvecSouscription:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur lors de l\'activation'
            };
        }
    },

    // ==========================================
    // 📊 STATISTIQUES & VISITES
    // ==========================================

    /**
     * Enregistrer une visite sur une fiche
     * POST /api/prestataires/:id/visit
     */
    trackVisit: async (id) => {
        try {
            await Caller.post(`/prestataires/${id}/visit`);
        } catch (error) {
            // Silencieux - pas grave si ça échoue
        }
    },

    /**
     * Récupérer les derniers visiteurs d'un prestataire
     * GET /api/prestataires/:id/visitors
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
