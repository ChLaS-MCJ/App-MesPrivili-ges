import Axios from 'axios';
import AuthService from './Auth.service';

const axiosInstance = Axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://cacao.mesprivileges.fr/api',
});

// Intercepteur pour ajouter le token d'authentification dans les en-têtes
axiosInstance.interceptors.request.use(
    async (config) => {
        const token = await AuthService.getToken();
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Intercepteur pour gérer les erreurs de réponse (token expiré, etc.)
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Si le token est expiré (401) et qu'on n'a pas déjà tenté de le rafraîchir
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Tenter de rafraîchir le token
                const newToken = await AuthService.refreshToken();

                if (newToken) {
                    // Mettre à jour le header avec le nouveau token
                    originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                    // Réessayer la requête originale
                    return axiosInstance(originalRequest);
                }
            } catch (refreshError) {
                // Si le refresh échoue, déconnecter l'utilisateur
                await AuthService.logout();
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;