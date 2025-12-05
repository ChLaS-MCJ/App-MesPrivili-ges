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
    informationCircleOutline,
    ticketOutline,
    checkmarkOutline,
    closeCircleOutline
} from 'ionicons/icons';
import AbonnementService from '../../Services/Abonnement.services';
import CodePromoService from '../../Services/CodePromo.services';
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
    const [successMessage, setSuccessMessage] = useState(null);

    const [selectedDuration, setSelectedDuration] = useState(null);
    const [nombreFiches, setNombreFiches] = useState(1);
    const [showFaq, setShowFaq] = useState(false);

    // État pour le renouvellement automatique
    const [renouvellementAuto, setRenouvellementAuto] = useState(false);
    const [showAutoRenewInfo, setShowAutoRenewInfo] = useState(false);

    // État pour détecter le scroll
    const [isScrolled, setIsScrolled] = useState(false);

    // ========== ÉTATS CODE PROMO ==========
    const [showCodePromo, setShowCodePromo] = useState(false);
    const [codePromo, setCodePromo] = useState('');
    const [codePromoLoading, setCodePromoLoading] = useState(false);
    const [codePromoValid, setCodePromoValid] = useState(null); // null, true, false
    const [codePromoInfo, setCodePromoInfo] = useState(null);
    const [codePromoError, setCodePromoError] = useState(null);

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

    // ========== FONCTIONS CODE PROMO ==========

    /**
     * Valider le code promo entré
     */
    const handleValidateCodePromo = async () => {
        if (!codePromo.trim()) {
            setCodePromoError('Veuillez entrer un code promo');
            return;
        }

        setCodePromoLoading(true);
        setCodePromoError(null);
        setCodePromoValid(null);
        setCodePromoInfo(null);

        try {
            const result = await CodePromoService.validateCode(codePromo);

            if (result.success) {
                setCodePromoValid(true);
                setCodePromoInfo(result.data);
            } else {
                setCodePromoValid(false);
                setCodePromoError(result.message);
            }
        } catch (err) {
            console.error('Erreur validation code promo:', err);
            setCodePromoValid(false);
            setCodePromoError('Erreur lors de la validation du code');
        } finally {
            setCodePromoLoading(false);
        }
    };

    /**
     * Appliquer le code promo et créer la souscription gratuite
     */
    const handleApplyCodePromo = async () => {
        if (!codePromoValid || !codePromoInfo) return;

        setCodePromoLoading(true);
        setCodePromoError(null);

        try {
            const result = await CodePromoService.applyCode(codePromo);

            if (result.success) {
                setSuccessMessage(result.message);
                // Rediriger vers la page de gestion ou mon commerce après 2s
                setTimeout(() => {
                    navigate('/auth/mon-commerce', {
                        state: {
                            codePromoApplied: true,
                            message: result.message
                        }
                    });
                }, 2000);
            } else {
                setCodePromoError(result.message);
            }
        } catch (err) {
            console.error('Erreur application code promo:', err);
            setCodePromoError('Erreur lors de l\'application du code promo');
        } finally {
            setCodePromoLoading(false);
        }
    };

    /**
     * Reset le formulaire code promo
     */
    const resetCodePromo = () => {
        setCodePromo('');
        setCodePromoValid(null);
        setCodePromoInfo(null);
        setCodePromoError(null);
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
                {/* Message de succès */}
                {successMessage && (
                    <div className="success-banner">
                        <IonIcon icon={checkmarkCircle} />
                        <span>{successMessage}</span>
                    </div>
                )}

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
                    {/* Hero Section */}
                    <section className="hero-section">
                        <div className="hero-icon">
                            <IonIcon icon={sparklesOutline} />
                        </div>
                        <h2 className="hero-title">Boostez votre visibilité</h2>
                        <p className="hero-subtitle">Rejoignez les commerces qui attirent plus de clients grâce à leurs promotions</p>
                    </section>

                    {/* Section 1: Nombre de fiches */}
                    <section className="selection-section">
                        <div className="section-header">
                            <div className="section-icon">
                                <IonIcon icon={storefrontOutline} />
                            </div>
                            <div className="section-title">
                                <h2>Vos établissements</h2>
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
                            <div className="section-icon">
                                <IonIcon icon={timeOutline} />
                            </div>
                            <div className="section-title">
                                <h2>Durée d'engagement</h2>
                                <p>Plus c'est long, plus c'est avantageux !</p>
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

                    {/* ========== SECTION CODE PROMO ========== */}
                    <section className="selection-section code-promo-section">
                        <button
                            className="code-promo-toggle"
                            onClick={() => {
                                setShowCodePromo(!showCodePromo);
                                if (!showCodePromo) resetCodePromo();
                            }}
                        >
                            <div className="toggle-content">
                                <IonIcon icon={ticketOutline} />
                                <span>J'ai un code promo</span>
                            </div>
                            <IonIcon icon={showCodePromo ? chevronUpOutline : chevronDownOutline} />
                        </button>

                        {showCodePromo && (
                            <div className="code-promo-content">
                                <div className="code-promo-input-group">
                                    <div className={`code-promo-input-wrapper ${codePromoValid === true ? 'valid' : ''} ${codePromoValid === false ? 'invalid' : ''}`}>
                                        <input
                                            type="text"
                                            placeholder="Entrez votre code"
                                            value={codePromo}
                                            onChange={(e) => {
                                                setCodePromo(e.target.value.toUpperCase());
                                                setCodePromoValid(null);
                                                setCodePromoError(null);
                                                setCodePromoInfo(null);
                                            }}
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') handleValidateCodePromo();
                                            }}
                                            disabled={codePromoLoading || codePromoValid === true}
                                        />
                                        {codePromoValid === true && (
                                            <IonIcon icon={checkmarkCircle} className="input-status valid" />
                                        )}
                                        {codePromoValid === false && (
                                            <IonIcon icon={closeCircleOutline} className="input-status invalid" />
                                        )}
                                    </div>

                                    {codePromoValid !== true ? (
                                        <button
                                            className="code-promo-validate-btn"
                                            onClick={handleValidateCodePromo}
                                            disabled={codePromoLoading || !codePromo.trim()}
                                        >
                                            {codePromoLoading ? (
                                                <span className="loading-dots"></span>
                                            ) : (
                                                'Vérifier'
                                            )}
                                        </button>
                                    ) : (
                                        <button
                                            className="code-promo-reset-btn"
                                            onClick={resetCodePromo}
                                        >
                                            <IonIcon icon={closeOutline} />
                                        </button>
                                    )}
                                </div>

                                {/* Erreur code promo */}
                                {codePromoError && (
                                    <div className="code-promo-error">
                                        <IonIcon icon={alertCircleOutline} />
                                        <span>{codePromoError}</span>
                                    </div>
                                )}

                                {/* Code promo valide - Afficher les infos */}
                                {codePromoValid && codePromoInfo && (
                                    <div className="code-promo-success">
                                        <div className="code-promo-info">
                                            <div className="code-promo-badge">
                                                <IonIcon icon={giftOutline} />
                                                <span>{codePromoInfo.nom}</span>
                                            </div>
                                            <div className="code-promo-details">
                                                <div className="detail-item">
                                                    <IonIcon icon={checkmarkOutline} />
                                                    <span><strong>{codePromoInfo.dureeEnMois} mois</strong> d'abonnement gratuit</span>
                                                </div>
                                                <div className="detail-item">
                                                    <IonIcon icon={checkmarkOutline} />
                                                    <span>Aucun paiement requis</span>
                                                </div>
                                                {codePromoInfo.hasRestriction && codePromoInfo.restrictedCategory && (
                                                    <div className="detail-item restriction">
                                                        <IonIcon icon={informationCircleOutline} />
                                                        <span>Réservé à la catégorie <strong>{codePromoInfo.restrictedCategory.nom}</strong></span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <button
                                            className="code-promo-apply-btn"
                                            onClick={handleApplyCodePromo}
                                            disabled={codePromoLoading}
                                        >
                                            {codePromoLoading ? (
                                                <span className="loading-text">
                                                    <span className="loading-dots"></span>
                                                    Application...
                                                </span>
                                            ) : (
                                                <>
                                                    <IonIcon icon={giftOutline} />
                                                    <span>Utiliser ce code</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </section>

                    {/* Séparateur "ou" si code promo n'est pas appliqué */}
                    {!codePromoValid && (
                        <div className="section-separator">
                            <span>ou payer par carte</span>
                        </div>
                    )}

                    {/* Section 3: Renouvellement automatique - Masquer si code promo validé */}
                    {!codePromoValid && (
                        <section className="selection-section">
                            <div className="section-header">
                                <div className="section-icon">
                                    <IonIcon icon={refreshOutline} />
                                </div>
                                <div className="section-title">
                                    <h2>Tranquillité assurée</h2>
                                    <p>Ne vous souciez plus des dates d'expiration</p>
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
                    )}

                    {/* Section 4: Ce qui est inclus */}
                    <section className="features-section">
                        <div className="features-header">
                            <IonIcon icon={giftOutline} />
                            <h3>Tout est inclus</h3>
                        </div>
                        <div className="features-grid">
                            <div className="feature-item">
                                <div className="feature-icon">
                                    <IonIcon icon={storefrontOutline} />
                                </div>
                                <span>{codePromoValid ? '1' : nombreFiches} fiche{(!codePromoValid && nombreFiches > 1) ? 's' : ''} commerce</span>
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
                                    <h4>J'ai un code promo, comment l'utiliser ?</h4>
                                    <p>Cliquez sur "J'ai un code promo" et entrez votre code. Si le code est valide, vous pourrez bénéficier d'un abonnement gratuit sans paiement.</p>
                                </div>
                                <div className="faq-item">
                                    <h4>Que se passe-t-il après un abonnement offert par code promo ?</h4>
                                    <p>À la fin de la période offerte, votre fiche sera désactivée. Vous pourrez alors souscrire un abonnement payant pour continuer.</p>
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

            {/* Footer fixe - Masquer si code promo appliqué */}
            {!codePromoValid && (
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
            )}
        </div>
    );
};

export default Abonnement;