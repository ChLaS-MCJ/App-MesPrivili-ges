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
    ribbonOutline,
    alertCircleOutline,
    closeOutline,
    cardOutline,
    giftOutline,
    chevronDownOutline,
    chevronUpOutline,
    addCircleOutline,
    layersOutline
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
    const [maSouscription, setMaSouscription] = useState(null);
    const [loading, setLoading] = useState(true);
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [error, setError] = useState(null);

    const [selectedDuration, setSelectedDuration] = useState(null);
    const [nombreFiches, setNombreFiches] = useState(1);
    const [showFaq, setShowFaq] = useState(false);

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

            const souscriptionResult = await AbonnementService.getMaSouscription();
            if (souscriptionResult.success) {
                setMaSouscription(souscriptionResult.data);
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
            const result = await AbonnementService.createCheckout(selectedDuration, nombreFiches);

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

    // Calculer le nombre de fiches actives de l'utilisateur
    const getFichesActives = () => {
        return user?.maxFiches || 0;
    };

    // Calculer le nombre de fiches utilisées
    const getFichesUtilisees = () => {
        return user?.fichesCount || 0;
    };

    const totals = calculateTotal();
    const selectedAbonnement = getSelectedAbonnement();
    const fichesActives = getFichesActives();
    const fichesUtilisees = getFichesUtilisees();
    const hasActiveSouscription = maSouscription?.hasSouscription;

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
                <h1 className="page-title">Abonnement</h1>
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

                {/* Résumé des fiches actives */}
                {hasActiveSouscription && (
                    <div className="active-subscription">
                        <div className="subscription-header">
                            <div className="subscription-icon">
                                <IonIcon icon={checkmarkCircle} />
                            </div>
                            <div className="subscription-info">
                                <span className="subscription-label">Mon abonnement</span>
                                <span className="subscription-name">{maSouscription.souscription.abonnement?.nom}</span>
                            </div>
                        </div>

                        <div className="subscription-stats">
                            <div className="stat-item">
                                <IonIcon icon={layersOutline} />
                                <div className="stat-content">
                                    <span className="stat-value">{fichesActives}</span>
                                    <span className="stat-label">fiche{fichesActives > 1 ? 's' : ''} disponible{fichesActives > 1 ? 's' : ''}</span>
                                </div>
                            </div>
                            <div className="stat-divider"></div>
                            <div className="stat-item">
                                <IonIcon icon={storefrontOutline} />
                                <div className="stat-content">
                                    <span className="stat-value">{fichesUtilisees}</span>
                                    <span className="stat-label">fiche{fichesUtilisees > 1 ? 's' : ''} créée{fichesUtilisees > 1 ? 's' : ''}</span>
                                </div>
                            </div>
                            <div className="stat-divider"></div>
                            <div className="stat-item">
                                <IonIcon icon={timeOutline} />
                                <div className="stat-content">
                                    <span className="stat-value">{maSouscription.souscription.joursRestants}</span>
                                    <span className="stat-label">jours restants</span>
                                </div>
                            </div>
                        </div>

                        {fichesActives > fichesUtilisees && (
                            <div className="subscription-tip">
                                <IonIcon icon={sparklesOutline} />
                                <span>Vous pouvez encore créer {fichesActives - fichesUtilisees} fiche{(fichesActives - fichesUtilisees) > 1 ? 's' : ''} commerce</span>
                            </div>
                        )}
                    </div>
                )}

                <div className="abonnement-content">
                    {/* Titre section achat */}
                    {hasActiveSouscription && (
                        <div className="section-intro">
                            <IonIcon icon={addCircleOutline} />
                            <h2>Ajouter des fiches</h2>
                            <p>Besoin de plus de fiches ? Ajoutez-en à votre abonnement</p>
                        </div>
                    )}

                    {/* Section 1: Nombre de fiches */}
                    <section className="selection-section">
                        <div className="section-header">
                            <div className="section-number">1</div>
                            <div className="section-title">
                                <h2>Nombre de fiches</h2>
                                <p>{hasActiveSouscription ? 'Combien de fiches supplémentaires ?' : 'Combien de commerces souhaitez-vous référencer ?'}</p>
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

                        {hasActiveSouscription && (
                            <div className="fiches-result">
                                <span>Après achat : <strong>{fichesActives + nombreFiches} fiches</strong> au total</span>
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

                    {/* Section 3: Ce qui est inclus */}
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
                                    <h4>Puis-je annuler mon abonnement ?</h4>
                                    <p>L'abonnement n'est pas résiliable. Une fois souscrit, il reste actif jusqu'à sa date d'expiration.</p>
                                </div>
                                <div className="faq-item">
                                    <h4>Que se passe-t-il à expiration ?</h4>
                                    <p>Vos fiches seront automatiquement désactivées le jour de l'expiration. Renouvelez votre abonnement pour les réactiver.</p>
                                </div>
                                <div className="faq-item">
                                    <h4>Puis-je ajouter des fiches plus tard ?</h4>
                                    <p>Oui, vous pouvez souscrire à des fiches supplémentaires à tout moment depuis votre espace.</p>
                                </div>
                                <div className="faq-item">
                                    <h4>Quels moyens de paiement acceptez-vous ?</h4>
                                    <p>Nous acceptons les cartes bancaires (Visa, Mastercard) via notre partenaire Stripe.</p>
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
                                <IonIcon icon={hasActiveSouscription ? addCircleOutline : cardOutline} />
                                <span>
                                    {hasActiveSouscription
                                        ? `Ajouter ${nombreFiches} fiche${nombreFiches > 1 ? 's' : ''} · ${formatPrice(totals.ttc)}`
                                        : `Payer ${formatPrice(totals.ttc)}`
                                    }
                                </span>
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