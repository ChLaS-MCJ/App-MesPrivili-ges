import Caller from './Caller.services';

/**
 * 🏷️ FiltreService
 * Service pour la gestion des filtres par catégorie
 */
const FiltreService = {
    /**
     * Récupérer les filtres d'une catégorie
     * GET /api/filtres/category/:categoryId
     */
    getByCategory: async (categoryId) => {
        try {
            const response = await Caller.get(`/filtres/category/${categoryId}`);
            return response.data;
        } catch (error) {
            console.error('Erreur getByCategory:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur lors de la récupération',
                data: []
            };
        }
    },
};

export default FiltreService;
