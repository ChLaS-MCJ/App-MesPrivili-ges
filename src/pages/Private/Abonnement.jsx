import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { IonIcon } from '@ionic/react';
import {
    arrowBackOutline,
    checkmarkCircle,
    removeOutline,
    addOutline,
    storefrontOutline,
    timeOutline,
    shieldCheckmarkOutline,
    sparklesOutline,
    trendingUpOutline,
    statsChartOutline,
    megaphoneOutline,
    alertCircleOutline,
    closeOutline,
    cardOutline,
    giftOutline,
    chevronDownOutline,
    chevronUpOutline,
    refreshOutline,
    informationCircleOutline
} from 'ionicons/icons';
import AbonnementService from '../../Services/Abonnement.services';
import { useAuth } from '../../Utils/AuthContext';

const Abonnement = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const { user } = useAuth();

    const previousPath = location.state?.previousPath || '/auth/maps';

    const [abonnements, setAbonnements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [error, setError] = useState(null);

    const [selectedDuration, setSelectedDuration] = useState(null);
    const [nombreFiches, setNombreFiches] = useState(1);
    const [showFaq, setShowFaq] = useState(false);

    // État pour le renouvellement automatique
    const [renouvellementAuto, setRenouvellementAuto] = useState(false);
    const [showAutoRenewInfo, setShowAutoRenewInfo] = useState(false);

    // État pour détecter le scroll
    const [isScrolled, setIsScrolled] = useState(false);

    const MAX_FICHES = 10;
    const MIN_FICHES = 1;

    // Gérer le scroll pour afficher la border du header
    const handleScroll = (e) => {
        const scrollTop = e.target.scrollTop;
        setIsScrolled(scrollTop > 10);
    };

    useEffect(() => {
        if (searchParams.get('canceled') === 'true') {
            setError('Le paiement a été annulé. Vous pouvez réessayer quand vous le souhaitez.');
        }
    }, [searchParams]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const abonnementsResult = await AbonnementService.getAbonnements();
            if (abonnementsResult.success) {
                setAbonnements(abonnementsResult.data);
                const populaire = abonnementsResult.data.find(a => a.estPopulaire);
                if (populaire) {
                    setSelectedDuration(populaire.code);
                } else if (abonnementsResult.data.length > 0) {
                    setSelectedDuration(abonnementsResult.data[0].code);
                }
            }
        } catch (err) {
            console.error('Erreur chargement:', err);
            setError('Erreur lors du chargement des offres');
        } finally {
            setLoading(false);
        }
    };

    const getSelectedAbonnement = () => {
        return abonnements.find(a => a.code === selectedDuration);
    };

    const calculateTotal = () => {
        const abonnement = getSelectedAbonnement();
        if (!abonnement) return { ht: 0, ttc: 0, mensuel: 0, duree: 0 };

        const prixUnitaireHT = parseFloat(abonnement.prixTotalHT);
        const prixUnitaireTTC = parseFloat(abonnement.prixTotalTTC);
        const prixMensuelHT = parseFloat(abonnement.prixMensuelHT);

        return {
            ht: prixUnitaireHT * nombreFiches,
            ttc: prixUnitaireTTC * nombreFiches,
            mensuel: prixMensuelHT * nombreFiches,
            duree: abonnement.dureeEnMois
        };
    };

    const handleCheckout = async () => {
        if (!selectedDuration || nombreFiches < 1) return;

        setCheckoutLoading(true);
        setError(null);

        try {
            // Passer l'option renouvellementAuto au service
            const result = await AbonnementService.createCheckout(
                selectedDuration,
                nombreFiches,
                renouvellementAuto
            );

            if (result.success && result.data.checkoutUrl) {
                window.location.href = result.data.checkoutUrl;
            } else {
                setError(result.message || 'Erreur lors de la création du paiement');
            }
        } catch (err) {
            console.error('Erreur checkout:', err);
            setError('Une erreur est survenue. Veuillez réessayer.');
        } finally {
            setCheckoutLoading(false);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR'
        }).format(price);
    };

    const incrementFiches = () => {
        if (nombreFiches < MAX_FICHES) {
            setNombreFiches(prev => prev + 1);
        }
    };

    const decrementFiches = () => {
        if (nombreFiches > MIN_FICHES) {
            setNombreFiches(prev => prev - 1);
        }
    };

    const totals = calculateTotal();
    const selectedAbonnement = getSelectedAbonnement();

    if (loading) {
        return (
            <div className="abonnement-page">
                <div className="abonnement-loading">
                    <div className="loading-spinner"></div>
                    <p>Chargement des offres...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="abonnement-page">
            {/* Header */}
            <div className={`page-header ${isScrolled ? 'scrolled' : ''}`}>
                <button
                    className="header-btn back"
                    onClick={() => navigate(previousPath, { state: { openDrawer: true } })}
                >
                    <IonIcon icon={arrowBackOutline} />
                </button>
                <h1 className="page-title">Nos offres</h1>
                <div className="header-btn placeholder"></div>
            </div>

            {/* Contenu scrollable */}
            <div className="abonnement-scroll" onScroll={handleScroll}>
                {/* Message d'erreur */}
                {error && (
                    <div className="error-banner">
                        <IonIcon icon={alertCircleOutline} />
                        <span>{error}</span>
                        <button onClick={() => setError(null)}>
                            <IonIcon icon={closeOutline} />
                        </button>
                    </div>
                )}

                <div className="abonnement-content">
                    {/* Section 1: Nombre de fiches */}
                    <section className="selection-section">
                        <div className="section-header">
                            <div className="section-number">1</div>
                            <div className="section-title">
                                <h2>Nombre de fiches</h2>
                                <p>Combien de commerces souhaitez-vous référencer ?</p>
                            </div>
                        </div>

                        <div className="fiches-selector">
                            <button
                                className="fiches-btn minus"
                                onClick={decrementFiches}
                                disabled={nombreFiches <= MIN_FICHES}
                            >
                                <IonIcon icon={removeOutline} />
                            </button>

                            <div className="fiches-display">
                                <div className="fiches-icon">
                                    <IonIcon icon={storefrontOutline} />
                                </div>
                                <span className="fiches-count">{nombreFiches}</span>
                                <span className="fiches-label">fiche{nombreFiches > 1 ? 's' : ''}</span>
                            </div>

                            <button
                                className="fiches-btn plus"
                                onClick={incrementFiches}
                                disabled={nombreFiches >= MAX_FICHES}
                            >
                                <IonIcon icon={addOutline} />
                            </button>
                        </div>

                        {nombreFiches > 1 && (
                            <div className="fiches-info">
                                <IonIcon icon={sparklesOutline} />
                                <span>Idéal pour gérer {nombreFiches} établissements depuis un seul compte</span>
                            </div>
                        )}
                    </section>

                    {/* Section 2: Durée d'engagement */}
                    <section className="selection-section">
                        <div className="section-header">
                            <div className="section-number">2</div>
                            <div className="section-title">
                                <h2>Durée d'engagement</h2>
                                <p>Choisissez la durée de votre abonnement</p>
                            </div>
                        </div>

                        <div className="duration-options">
                            {abonnements.map((abonnement) => {
                                const isSelected = selectedDuration === abonnement.code;
                                const prixMensuel = parseFloat(abonnement.prixMensuelHT);
                                const prixTotal = parseFloat(abonnement.prixTotalTTC);

                                return (
                                    <button
                                        key={abonnement.code}
                                        className={`duration-card ${isSelected ? 'selected' : ''} ${abonnement.estPopulaire ? 'popular' : ''}`}
                                        onClick={() => setSelectedDuration(abonnement.code)}
                                    >
                                        {abonnement.estPopulaire && (
                                            <div className="popular-badge">
                                                <IonIcon icon={trendingUpOutline} />
                                                <span>Économique</span>
                                            </div>
                                        )}

                                        <div className="duration-header">
                                            <div className="duration-icon">
                                                <IonIcon icon={timeOutline} />
                                            </div>
                                            <div className="duration-info">
                                                <span className="duration-name">{abonnement.nom}</span>
                                                <span className="duration-months">{abonnement.dureeEnMois} mois</span>
                                            </div>
                                        </div>

                                        <div className="duration-pricing">
                                            <div className="price-main">
                                                <span className="price-amount">{formatPrice(prixMensuel)}</span>
                                                <span className="price-period">HT / mois / fiche</span>
                                            </div>
                                            <div className="price-total">
                                                soit {formatPrice(prixTotal)} TTC / fiche
                                            </div>
                                        </div>

                                        <div className={`selection-indicator ${isSelected ? 'active' : ''}`}>
                                            {isSelected && <IonIcon icon={checkmarkCircle} />}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {selectedAbonnement?.code === 'annuel' && (
                            <div className="savings-banner">
                                <IonIcon icon={giftOutline} />
                                <span>Vous économisez <strong>{formatPrice(60 * nombreFiches)}</strong> par rapport au semestriel !</span>
                            </div>
                        )}
                    </section>

                    {/* Section 3: Renouvellement automatique */}
                    <section className="selection-section">
                        <div className="section-header">
                            <div className="section-number">3</div>
                            <div className="section-title">
                                <h2>Renouvellement automatique</h2>
                                <p>Choisissez si vous souhaitez un renouvellement automatique</p>
                            </div>
                        </div>

                        <div className="auto-renew-option">
                            <label className="auto-renew-checkbox">
                                <input
                                    type="checkbox"
                                    checked={renouvellementAuto}
                                    onChange={(e) => setRenouvellementAuto(e.target.checked)}
                                />
                                <span className="checkbox-custom">
                                    {renouvellementAuto && <IonIcon icon={checkmarkCircle} />}
                                </span>
                                <div className="checkbox-content">
                                    <span className="checkbox-label">
                                        <IonIcon icon={refreshOutline} />
                                        Activer le renouvellement automatique
                                    </span>
                                    <span className="checkbox-description">
                                        Votre abonnement sera renouvelé automatiquement à chaque échéance
                                    </span>
                                </div>
                            </label>

                            <button
                                className="info-toggle"
                                onClick={() => setShowAutoRenewInfo(!showAutoRenewInfo)}
                            >
                                <IonIcon icon={informationCircleOutline} />
                                <span>En savoir plus</span>
                                <IonIcon icon={showAutoRenewInfo ? chevronUpOutline : chevronDownOutline} />
                            </button>

                            {showAutoRenewInfo && (
                                <div className="auto-renew-info">
                                    <div className="info-item">
                                        <IonIcon icon={checkmarkCircle} />
                                        <span>Vous serez prélevé de <strong>{formatPrice(totals.ttc)}</strong> à chaque renouvellement</span>
                                    </div>
                                    <div className="info-item">
                                        <IonIcon icon={checkmarkCircle} />
                                        <span>Un email de rappel sera envoyé <strong>30 jours</strong> et <strong>7 jours</strong> avant le prélèvement</span>
                                    </div>
                                    <div className="info-item">
                                        <IonIcon icon={checkmarkCircle} />
                                        <span>Vous pouvez <strong>désactiver</strong> le renouvellement à tout moment depuis votre espace</span>
                                    </div>
                                    <div className="info-item">
                                        <IonIcon icon={checkmarkCircle} />
                                        <span>Votre carte sera <strong>sauvegardée de manière sécurisée</strong> par Stripe</span>
                                    </div>
                                </div>
                            )}

                            {renouvellementAuto && (
                                <div className="auto-renew-summary">
                                    <IonIcon icon={refreshOutline} />
                                    <span>
                                        Prochain prélèvement prévu : <strong>{formatPrice(totals.ttc)}</strong> dans <strong>{totals.duree} mois</strong>
                                    </span>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Section 4: Ce qui est inclus */}
                    <section className="features-section">
                        <h3>Ce qui est inclus</h3>
                        <div className="features-grid">
                            <div className="feature-item">
                                <div className="feature-icon">
                                    <IonIcon icon={storefrontOutline} />
                                </div>
                                <span>{nombreFiches} fiche{nombreFiches > 1 ? 's' : ''} commerce</span>
                            </div>
                            <div className="feature-item">
                                <div className="feature-icon">
                                    <IonIcon icon={megaphoneOutline} />
                                </div>
                                <span>Promotions illimitées</span>
                            </div>
                            <div className="feature-item">
                                <div className="feature-icon">
                                    <IonIcon icon={statsChartOutline} />
                                </div>
                                <span>Statistiques détaillées</span>
                            </div>
                        </div>
                    </section>

                    {/* FAQ */}
                    <section className="faq-section">
                        <button
                            className="faq-toggle"
                            onClick={() => setShowFaq(!showFaq)}
                        >
                            <span>Questions fréquentes</span>
                            <IonIcon icon={showFaq ? chevronUpOutline : chevronDownOutline} />
                        </button>

                        {showFaq && (
                            <div className="faq-content">
                                <div className="faq-item">
                                    <h4>Comment fonctionne le paiement ?</h4>
                                    <p>Le paiement est sécurisé par Stripe. Vous payez le montant total en une seule fois pour la durée choisie.</p>
                                </div>
                                <div className="faq-item">
                                    <h4>Comment fonctionne le renouvellement automatique ?</h4>
                                    <p>Si vous l'activez, votre carte sera prélevée automatiquement à l'échéance. Vous recevrez un rappel par email 30 jours et 7 jours avant. Vous pouvez désactiver cette option à tout moment.</p>
                                </div>
                                <div className="faq-item">
                                    <h4>Puis-je désactiver le renouvellement automatique ?</h4>
                                    <p>Oui, à tout moment depuis la page "Gérer mon abonnement" de votre espace.</p>
                                </div>
                                <div className="faq-item">
                                    <h4>Que se passe-t-il à expiration sans renouvellement auto ?</h4>
                                    <p>Vos fiches seront automatiquement désactivées. Vous pourrez souscrire un nouvel abonnement pour les réactiver.</p>
                                </div>
                                <div className="faq-item">
                                    <h4>Ma carte est-elle en sécurité ?</h4>
                                    <p>Oui, vos informations de paiement sont stockées de manière sécurisée par Stripe. Nous n'avons jamais accès à vos données bancaires complètes.</p>
                                </div>
                                <div className="faq-item">
                                    <h4>Vais-je recevoir une facture ?</h4>
                                    <p>Oui, une facture vous sera envoyée par email après chaque paiement.</p>
                                </div>
                            </div>
                        )}
                    </section>
                </div>
            </div>

            {/* Footer fixe */}
            <div className="checkout-footer">
                <div className="checkout-summary">
                    <div className="summary-details">
                        <div className="summary-line">
                            <span>{nombreFiches} fiche{nombreFiches > 1 ? 's' : ''} × {totals.duree} mois</span>
                            <span>{formatPrice(totals.ht)} HT</span>
                        </div>
                        {renouvellementAuto && (
                            <div className="summary-line auto-renew">
                                <IonIcon icon={refreshOutline} />
                                <span>Renouvellement auto activé</span>
                            </div>
                        )}
                        <div className="summary-total">
                            <span>Total TTC</span>
                            <span className="total-amount">{formatPrice(totals.ttc)}</span>
                        </div>
                    </div>

                    <button
                        className="checkout-button"
                        onClick={handleCheckout}
                        disabled={checkoutLoading || !selectedDuration}
                    >
                        {checkoutLoading ? (
                            <span className="loading-text">
                                <span className="loading-dots"></span>
                                Redirection...
                            </span>
                        ) : (
                            <>
                                <IonIcon icon={cardOutline} />
                                <span>Payer {formatPrice(totals.ttc)}</span>
                            </>
                        )}
                    </button>
                </div>

                <div className="secure-badge">
                    <IonIcon icon={shieldCheckmarkOutline} />
                    <span>Paiement sécurisé par Stripe</span>
                </div>
            </div>
        </div>
    );
};

export default Abonnement;