import Axios from 'axios';
import AuthService from './Auth.services';

const axiosInstance = Axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://cacao.mesprivileges.fr/api',
});

// FLAG pour éviter les boucles infinies
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Intercepteur pour ajouter le token d'authentification
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

// Intercepteur pour gérer les erreurs de réponse
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Si c'est une erreur 401
        if (error.response?.status === 401 && !originalRequest._retry) {

            // ⚠️ NE PAS rafraîchir si c'est déjà une requête de refresh-token
            if (originalRequest.url?.includes('/refresh-token')) {

                isRefreshing = false;
                processQueue(error, null);
                await AuthService.logout();
                window.location.href = '/login';
                return Promise.reject(error);
            }

            // Si un refresh est déjà en cours, mettre en file d'attente
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(token => {
                        originalRequest.headers['Authorization'] = `Bearer ${token}`;
                        return axiosInstance(originalRequest);
                    })
                    .catch(err => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const newToken = await AuthService.refreshToken();

                if (newToken) {

                    originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

                    processQueue(null, newToken);
                    isRefreshing = false;

                    return axiosInstance(originalRequest);
                }
            } catch (refreshError) {
                console.error('❌ Échec du refresh token:', refreshError);
                processQueue(refreshError, null);
                isRefreshing = false;

                await AuthService.logout();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;