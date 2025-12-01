import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { IonIcon } from '@ionic/react';
import { ArrowLeftOutlined } from '@ant-design/icons';
import {
    checkmarkCircleOutline,
    closeCircleOutline,
    timeOutline,
    storefrontOutline,
    calendarOutline,
    layersOutline,
    walletOutline,
    arrowForwardOutline,
    reloadOutline,
    sparklesOutline,
    ribbonOutline
} from 'ionicons/icons';
import { useAuth } from '../../Utils/AuthContext';
import AbonnementService from '../../Services/Abonnement.services';


const AbonnementSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { refreshUser } = useAuth();

    const previousPath = location.state?.previousPath || '/auth/maps';

    const [status, setStatus] = useState('loading');
    const [souscription, setSouscription] = useState(null);
    const [maxFiches, setMaxFiches] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');

    const hasVerified = useRef(false);
    const isVerifying = useRef(false);

    useEffect(() => {
        const sessionId = searchParams.get('session_id');

        if (!sessionId) {
            setStatus('error');
            setErrorMessage('Session de paiement non trouvée');
            return;
        }

        if (hasVerified.current || isVerifying.current) {
            return;
        }

        isVerifying.current = true;

        const verifyPayment = async () => {
            try {
                const result = await AbonnementService.verifyCheckout(sessionId);
                hasVerified.current = true;

                if (result.success && result.data) {
                    if (result.data.status === 'success') {
                        setStatus('success');
                        setSouscription(result.data.souscription);
                        setMaxFiches(result.data.maxFiches || 0);

                        if (refreshUser) {
                            try {
                                await refreshUser();
                            } catch (e) {
                                console.warn('Erreur refresh user:', e);
                            }
                        }
                    } else if (result.data.status === 'pending') {
                        setStatus('pending');
                    } else {
                        setStatus('error');
                        setErrorMessage('Le paiement a échoué');
                    }
                } else {
                    setStatus('error');
                    setErrorMessage(result.message || 'Erreur lors de la vérification');
                }
            } catch (error) {
                hasVerified.current = true;
                setStatus('error');
                setErrorMessage(error.message || 'Erreur lors de la vérification du paiement');
            } finally {
                isVerifying.current = false;
            }
        };

        verifyPayment();
    }, []);

    const handleGoBack = () => {
        navigate(previousPath, { state: { openDrawer: true } });
    };

    const handleGoToCommerce = () => {
        navigate('/auth/mon-commerce');
    };

    const handleGoToAbonnement = () => {
        navigate('/auth/abonnement');
    };

    const handleRetry = () => {
        hasVerified.current = false;
        isVerifying.current = false;
        setStatus('loading');
        setErrorMessage('');
        window.location.reload();
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR'
        }).format(price);
    };

    return (
        <div className="abonnement-success-page">
            {/* Header */}
            <div className="page-header">
                <button className="header-btn back" onClick={handleGoBack}>
                    <ArrowLeftOutlined />
                </button>
                <h1 className="page-title">
                    {status === 'success' ? 'Paiement confirmé' :
                        status === 'error' ? 'Erreur' :
                            status === 'pending' ? 'En cours...' : 'Vérification'}
                </h1>
                <div className="header-btn placeholder"></div>
            </div>

            {/* Contenu */}
            <div className="success-content">

                {/* Loading */}
                {status === 'loading' && (
                    <div className="status-container">
                        <div className="status-card loading">
                            <div className="loading-animation">
                                <div className="spinner"></div>
                            </div>
                            <h2>Vérification en cours...</h2>
                            <p>Nous vérifions votre paiement auprès de Stripe</p>
                        </div>
                    </div>
                )}

                {/* Succès */}
                {status === 'success' && (
                    <div className="status-container">
                        <div className="status-card success">
                            {/* Icône animée */}
                            <div className="status-icon-wrapper success">
                                <IonIcon icon={checkmarkCircleOutline} />
                                <div className="icon-ring"></div>
                            </div>


                            <h2>Paiement réussi !</h2>
                            <p>Votre abonnement est maintenant actif</p>

                            {/* Détails de la souscription */}
                            {souscription && (
                                <div className="souscription-card">
                                    <div className="souscription-header">
                                        <IonIcon icon={ribbonOutline} />
                                        <span>Récapitulatif</span>
                                    </div>

                                    <div className="souscription-details">
                                        <div className="detail-row">
                                            <div className="detail-icon">
                                                <IonIcon icon={sparklesOutline} />
                                            </div>
                                            <div className="detail-info">
                                                <span className="detail-label">Abonnement</span>
                                                <span className="detail-value">{souscription.abonnement?.nom || 'Standard'}</span>
                                            </div>
                                        </div>

                                        <div className="detail-row">
                                            <div className="detail-icon">
                                                <IonIcon icon={calendarOutline} />
                                            </div>
                                            <div className="detail-info">
                                                <span className="detail-label">Valide jusqu'au</span>
                                                <span className="detail-value">{formatDate(souscription.dateFin)}</span>
                                            </div>
                                        </div>

                                        <div className="detail-row">
                                            <div className="detail-icon">
                                                <IonIcon icon={layersOutline} />
                                            </div>
                                            <div className="detail-info">
                                                <span className="detail-label">Fiches achetées</span>
                                                <span className="detail-value">{souscription.nombreFiches || 1} fiche{(souscription.nombreFiches || 1) > 1 ? 's' : ''}</span>
                                            </div>
                                        </div>

                                        {maxFiches > 0 && (
                                            <div className="detail-row">
                                                <div className="detail-icon highlight">
                                                    <IonIcon icon={storefrontOutline} />
                                                </div>
                                                <div className="detail-info">
                                                    <span className="detail-label">Total disponible</span>
                                                    <span className="detail-value highlight">{maxFiches} fiche{maxFiches > 1 ? 's' : ''}</span>
                                                </div>
                                            </div>
                                        )}

                                        {souscription.montantPayeTTC && (
                                            <div className="detail-row total">
                                                <div className="detail-icon">
                                                    <IonIcon icon={walletOutline} />
                                                </div>
                                                <div className="detail-info">
                                                    <span className="detail-label">Montant payé</span>
                                                    <span className="detail-value highlight">{formatPrice(souscription.montantPayeTTC)}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Boutons d'action */}
                            <div className="action-buttons">
                                <button className="btn-primary" onClick={handleGoToCommerce}>
                                    <IonIcon icon={storefrontOutline} />
                                    <span>Créer ma fiche commerce</span>
                                    <IonIcon icon={arrowForwardOutline} className="arrow" />
                                </button>

                                <button className="btn-secondary" onClick={handleGoToAbonnement}>
                                    Voir mon abonnement
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* En attente */}
                {status === 'pending' && (
                    <div className="status-container">
                        <div className="status-card pending">
                            <div className="status-icon-wrapper pending">
                                <IonIcon icon={timeOutline} />
                                <div className="icon-ring"></div>
                            </div>

                            <h2>Paiement en cours</h2>
                            <p>Votre paiement est en cours de validation. Cela peut prendre quelques instants.</p>

                            <div className="action-buttons">
                                <button className="btn-primary" onClick={handleRetry}>
                                    <IonIcon icon={reloadOutline} />
                                    <span>Vérifier à nouveau</span>
                                </button>

                                <button className="btn-secondary" onClick={handleGoToAbonnement}>
                                    Retour aux abonnements
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Erreur */}
                {status === 'error' && (
                    <div className="status-container">
                        <div className="status-card error">
                            <div className="status-icon-wrapper error">
                                <IonIcon icon={closeCircleOutline} />
                                <div className="icon-ring"></div>
                            </div>

                            <h2>Une erreur est survenue</h2>
                            <p>{errorMessage || 'Impossible de vérifier le paiement.'}</p>

                            <div className="action-buttons">
                                <button className="btn-primary" onClick={handleRetry}>
                                    <IonIcon icon={reloadOutline} />
                                    <span>Réessayer</span>
                                </button>

                                <button className="btn-secondary" onClick={handleGoToAbonnement}>
                                    Retour aux abonnements
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AbonnementSuccess;