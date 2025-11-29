import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { IonIcon } from '@ionic/react';
import {
    checkmarkCircle,
    storefrontOutline,
    arrowForwardOutline,
    receiptOutline,
    alertCircleOutline
} from 'ionicons/icons';
import AbonnementService from '../../Services/Abonnement.services';
import { useAuth } from '../../Utils/AuthContext';


const AbonnementSuccess = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { refreshUser } = useAuth();

    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'pending', 'error'
    const [souscription, setSouscription] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        verifyPayment();
    }, []);

    const verifyPayment = async () => {
        const sessionId = searchParams.get('session_id');

        if (!sessionId) {
            setStatus('error');
            setError('Session de paiement invalide');
            setLoading(false);
            return;
        }

        try {
            // Vérifier le paiement
            const result = await AbonnementService.verifyCheckout(sessionId);

            if (result.success) {
                if (result.data.status === 'success') {
                    setStatus('success');
                    setSouscription(result.data.souscription);
                    // Rafraîchir les données utilisateur (maxFiches a changé)
                    await refreshUser();
                } else if (result.data.status === 'pending') {
                    setStatus('pending');
                } else {
                    setStatus('error');
                    setError('Le paiement n\'a pas abouti');
                }
            } else {
                setStatus('error');
                setError(result.message || 'Erreur lors de la vérification');
            }
        } catch (err) {
            console.error('Erreur verification:', err);
            setStatus('error');
            setError('Une erreur est survenue');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="success-page">
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Vérification du paiement...</p>
                </div>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="success-page">
                <div className="result-container error">
                    <div className="result-icon error">
                        <IonIcon icon={alertCircleOutline} />
                    </div>
                    <h1>Erreur</h1>
                    <p>{error}</p>
                    <button
                        className="primary-btn"
                        onClick={() => navigate('/prestataire/abonnement')}
                    >
                        Réessayer
                    </button>
                </div>
            </div>
        );
    }

    if (status === 'pending') {
        return (
            <div className="success-page">
                <div className="result-container pending">
                    <div className="result-icon pending">
                        <div className="spinner"></div>
                    </div>
                    <h1>Paiement en cours</h1>
                    <p>Votre paiement est en cours de traitement. Vous recevrez un email de confirmation.</p>
                    <button
                        className="primary-btn"
                        onClick={() => navigate('/prestataire/mon-commerce')}
                    >
                        Retour à mon commerce
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="success-page">
            <div className="result-container success">
                {/* Animation confetti */}
                <div className="confetti-container">
                    {[...Array(50)].map((_, i) => (
                        <div key={i} className={`confetti confetti-${i % 5}`} />
                    ))}
                </div>

                <div className="result-icon success">
                    <IonIcon icon={checkmarkCircle} />
                </div>

                <h1>Paiement réussi !</h1>
                <p>Merci pour votre confiance. Votre abonnement est maintenant actif.</p>

                {/* Détails souscription */}
                {souscription && (
                    <div className="subscription-summary">
                        <div className="summary-item">
                            <span className="label">Abonnement</span>
                            <span className="value">{souscription.abonnement?.nom}</span>
                        </div>
                        <div className="summary-item">
                            <span className="label">Début</span>
                            <span className="value">{formatDate(souscription.dateDebut)}</span>
                        </div>
                        <div className="summary-item">
                            <span className="label">Fin</span>
                            <span className="value">{formatDate(souscription.dateFin)}</span>
                        </div>
                        <div className="summary-item">
                            <span className="label">Montant payé</span>
                            <span className="value">{souscription.montantPayeTTC?.toFixed(2)} €</span>
                        </div>
                    </div>
                )}

                {/* Prochaines étapes */}
                <div className="next-steps">
                    <h3>Et maintenant ?</h3>
                    <p>Vous pouvez créer votre fiche commerce et commencer à recevoir des clients !</p>
                </div>

                {/* Boutons */}
                <div className="action-buttons">
                    <button
                        className="primary-btn"
                        onClick={() => navigate('/prestataire/mon-commerce')}
                    >
                        <IonIcon icon={storefrontOutline} />
                        Créer ma fiche commerce
                        <IonIcon icon={arrowForwardOutline} />
                    </button>

                    <button
                        className="secondary-btn"
                        onClick={() => navigate('/prestataire/abonnement')}
                    >
                        <IonIcon icon={receiptOutline} />
                        Voir mon abonnement
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AbonnementSuccess;
