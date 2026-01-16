/**
 * DeepLinkHandler.jsx
 * 
 * Gère les deep links pour le retour depuis Stripe
 * URLs gérées :
 *   - mesprivileges://payment/success?session_id=xxx
 *   - mesprivileges://payment/cancel
 *   - mesprivileges://payment/card-updated?success=true|false
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import { App as CapApp } from '@capacitor/app';

const DeepLinkHandler = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Seulement sur les plateformes natives
        if (!Capacitor.isNativePlatform()) {
            return;
        }

        // Gérer les deep links reçus quand l'app est ouverte
        const setupDeepLinkListener = async () => {
            try {
                // Listener pour les URLs reçues pendant que l'app tourne
                await CapApp.addListener('appUrlOpen', (event) => {
                    handleDeepLink(event.url);
                });

                // Vérifier si l'app a été lancée avec une URL
                const launchUrl = await CapApp.getLaunchUrl();
                if (launchUrl && launchUrl.url) {
                    handleDeepLink(launchUrl.url);
                }
            } catch (error) {
                console.error('🔗 [DeepLink] Erreur setup:', error);
            }
        };

        setupDeepLinkListener();

        // Cleanup
        return () => {
            CapApp.removeAllListeners();
        };
    }, []);

    const handleDeepLink = (url) => {
        try {
            console.log('🔗 [DeepLink] Traitement URL:', url);

            // Parser l'URL
            // Format: mesprivileges://payment/success?session_id=xxx
            const urlObj = new URL(url);
            const path = urlObj.hostname + urlObj.pathname; // "payment/success" ou "payment"
            const params = new URLSearchParams(urlObj.search);

            // Route selon le path
            if (path.includes('payment/success') || path === 'payment' && params.get('session_id')) {
                const sessionId = params.get('session_id');
                if (sessionId) {
                    navigate(`/auth/abonnement/success?session_id=${sessionId}`, { replace: true });
                } else {
                    navigate('/auth/gestion-abonnement', { replace: true });
                }
            }
            else if (path.includes('payment/cancel')) {
                navigate('/auth/abonnement?canceled=true', { replace: true });
            }
            else if (path.includes('payment/card-updated') || path.includes('card-updated')) {
                const success = params.get('success') === 'true';
                navigate(`/auth/gestion-abonnement?card_updated=${success}`, { replace: true });
            }
            else {
                console.log('🔗 [DeepLink] Path non reconnu:', path);
            }

        } catch (error) {
            console.error('🔗 [DeepLink] Erreur parsing URL:', error);
        }
    };

    // Ce composant ne rend rien visuellement
    return null;
};

export default DeepLinkHandler;
