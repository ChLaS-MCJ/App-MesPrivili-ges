import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { IonIcon } from '@ionic/react';
import {
    arrowBackOutline,
    checkmarkCircle,
    starOutline,
    shieldCheckmarkOutline,
    statsChartOutline,
    qrCodeOutline,
    megaphoneOutline,
    ribbonOutline,
    alertCircleOutline,
    closeCircleOutline
} from 'ionicons/icons';
import AbonnementService from '../../Services/Abonnement.services';
import { useAuth } from '../../Utils/AuthContext';


const Abonnement = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { user, refreshUser } = useAuth();

    const [abonnements, setAbonnements] = useState([]);
    const [maSouscription, setMaSouscription] = useState(null);
    const [loading, setLoading] = useState(true);
    const [checkoutLoading, setCheckoutLoading] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Vérifier si retour annulé
    useEffect(() => {
        if (searchParams.get('canceled') === 'true') {
            setError('Le paiement a été annulé');
        }
    }, [searchParams]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            // Charger les abonnements disponibles
            const abonnementsResult = await AbonnementService.getAbonnements();
            if (abonnementsResult.success) {
                setAbonnements(abonnementsResult.data);
            }

            // Charger ma souscription actuelle
            const souscriptionResult = await AbonnementService.getMaSouscription();
            if (souscriptionResult.success) {
                setMaSouscription(souscriptionResult.data);
            }
        } catch (err) {
            console.error('Erreur chargement:', err);
            setError('Erreur lors du chargement des données');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectAbonnement = async (abonnementCode) => {
        setCheckoutLoading(abonnementCode);
        setError(null);

        try {
            const result = await AbonnementService.createCheckout(abonnementCode);

            if (result.success && result.data.checkoutUrl) {
                // Rediriger vers Stripe Checkout
                window.location.href = result.data.checkoutUrl;
            } else {
                setError(result.message || 'Erreur lors de la création du paiement');
            }
        } catch (err) {
            console.error('Erreur checkout:', err);
            setError('Une erreur est survenue');
        } finally {
            setCheckoutLoading(null);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR'
        }).format(price);
    };

    const getFeatureIcon = (feature) => {
        const lowerFeature = feature.toLowerCase();
        if (lowerFeature.includes('fiche')) return checkmarkCircle;
        if (lowerFeature.includes('carte') || lowerFeature.includes('visible')) return starOutline;
        if (lowerFeature.includes('qr')) return qrCodeOutline;
        if (lowerFeature.includes('promotion')) return megaphoneOutline;
        if (lowerFeature.includes('statistique')) return statsChartOutline;
        if (lowerFeature.includes('support')) return shieldCheckmarkOutline;
        if (lowerFeature.includes('badge') || lowerFeature.includes('partenaire')) return ribbonOutline;
        return checkmarkCircle;
    };

    if (loading) {
        return (
            <div className="abonnement-page">
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Chargement des offres...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="abonnement-page">
            {/* Header */}
            <div className="page-header">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <IonIcon icon={arrowBackOutline} />
                </button>
                <h1>Abonnements</h1>
                <div className="header-spacer"></div>
            </div>

            {/* Messages */}
            {error && (
                <div className="message-banner error">
                    <IonIcon icon={alertCircleOutline} />
                    <span>{error}</span>
                    <button onClick={() => setError(null)}>
                        <IonIcon icon={closeCircleOutline} />
                    </button>
                </div>
            )}

            {success && (
                <div className="message-banner success">
                    <IonIcon icon={checkmarkCircle} />
                    <span>{success}</span>
                    <button onClick={() => setSuccess(null)}>
                        <IonIcon icon={closeCircleOutline} />
                    </button>
                </div>
            )}

            {/* Souscription actuelle */}
            {maSouscription?.hasSouscription && (
                <div className="current-subscription">
                    <div className="subscription-badge">
                        <IonIcon icon={checkmarkCircle} />
                        <span>Abonnement actif</span>
                    </div>
                    <div className="subscription-details">
                        <h3>{maSouscription.souscription.abonnement?.nom}</h3>
                        <p>Expire le {new Date(maSouscription.souscription.dateFin).toLocaleDateString('fr-FR')}</p>
                        <p className="days-left">
                            {maSouscription.souscription.joursRestants} jours restants
                        </p>
                    </div>
                </div>
            )}

            {/* Titre section */}
            <div className="section-intro">
                <h2>Choisissez votre formule</h2>
                <p>Sélectionnez l'abonnement qui correspond à vos besoins et commencez à promouvoir votre commerce</p>
            </div>

            {/* Cartes d'abonnement */}
            <div className="abonnements-grid">
                {abonnements.map((abonnement) => (
                    <div
                        key={abonnement.code}
                        className={`abonnement-card ${abonnement.estPopulaire ? 'popular' : ''}`}
                    >
                        {abonnement.estPopulaire && (
                            <div className="popular-badge">
                                <IonIcon icon={starOutline} />
                                Meilleure offre
                            </div>
                        )}

                        <div className="card-header">
                            <h3>{abonnement.nom}</h3>
                            <p className="duration">{abonnement.dureeEnMois} mois</p>
                        </div>

                        <div className="card-pricing">
                            <div className="price-monthly">
                                <span className="amount">{formatPrice(abonnement.prixMensuelHT)}</span>
                                <span className="period">HT / mois</span>
                            </div>
                            <div className="price-total">
                                Soit {formatPrice(abonnement.prixTotalTTC)} TTC au total
                            </div>
                            {abonnement.code === 'annuel' && (
                                <div className="savings">
                                    Économisez 60€ par rapport au semestriel !
                                </div>
                            )}
                        </div>

                        <ul className="features-list">
                            {abonnement.features?.map((feature, index) => (
                                <li key={index}>
                                    <IonIcon icon={getFeatureIcon(feature)} />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <button
                            className={`select-btn ${abonnement.estPopulaire ? 'primary' : 'secondary'}`}
                            onClick={() => handleSelectAbonnement(abonnement.code)}
                            disabled={checkoutLoading !== null || maSouscription?.hasSouscription}
                        >
                            {checkoutLoading === abonnement.code ? (
                                <>
                                    <div className="btn-spinner"></div>
                                    Redirection...
                                </>
                            ) : maSouscription?.hasSouscription ? (
                                'Abonnement actif'
                            ) : (
                                'Choisir cette offre'
                            )}
                        </button>
                    </div>
                ))}
            </div>

            {/* Infos supplémentaires */}
            <div className="abonnement-info">
                <h3>Questions fréquentes</h3>

                <div className="faq-item">
                    <h4>Comment fonctionne le paiement ?</h4>
                    <p>Le paiement est sécurisé par Stripe. Vous payez le montant total de votre abonnement en une seule fois.</p>
                </div>

                <div className="faq-item">
                    <h4>Puis-je annuler mon abonnement ?</h4>
                    <p>Votre abonnement est valable pour la durée choisie. Vous pouvez demander une annulation mais aucun remboursement ne sera effectué.</p>
                </div>

                <div className="faq-item">
                    <h4>Que se passe-t-il à la fin de mon abonnement ?</h4>
                    <p>Votre fiche reste visible pendant 30 jours après expiration, puis sera désactivée. Vous pourrez renouveler à tout moment.</p>
                </div>
            </div>

            {/* Paiement sécurisé */}
            <div className="secure-payment">
                <IonIcon icon={shieldCheckmarkOutline} />
                <span>Paiement 100% sécurisé par Stripe</span>
            </div>
        </div>
    );
};

export default Abonnement;
