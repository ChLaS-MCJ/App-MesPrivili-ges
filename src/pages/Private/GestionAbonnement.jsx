import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { IonIcon } from '@ionic/react';
import {
    arrowBackOutline,
    checkmarkCircle,
    storefrontOutline,
    timeOutline,
    cardOutline,
    refreshOutline,
    alertCircleOutline,
    closeOutline,
    calendarOutline,
    walletOutline,
    shieldCheckmarkOutline,
    chevronForwardOutline,
    addCircleOutline,
    warningOutline,
    informationCircleOutline,
    createOutline,
    layersOutline,
    sparklesOutline,
    documentTextOutline,
    chevronDownOutline,
    chevronUpOutline,
    pricetagOutline,
    lockClosedOutline
} from 'ionicons/icons';
import AbonnementService from '../../Services/Abonnement.services';
import { useAuth } from '../../Utils/AuthContext';


const GestionAbonnement = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();

    const previousPath = location.state?.previousPath || '/auth/maps';

    // État principal : liste de souscriptions
    const [souscriptions, setSouscriptions] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // États pour les actions (par souscription ID)
    const [toggleLoadingMap, setToggleLoadingMap] = useState({});
    const [updateCardLoading, setUpdateCardLoading] = useState(false);

    // État pour les cartes dépliées
    const [expandedCards, setExpandedCards] = useState({});

    // État pour détecter le scroll
    const [isScrolled, setIsScrolled] = useState(false);

    const handleScroll = (e) => {
        const scrollTop = e.target.scrollTop;
        setIsScrolled(scrollTop > 10);
    };

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            // D'ABORD : Vérifier s'il y a des souscriptions pending à activer
            // (en cas d'échec de redirection Stripe sur mobile)
            try {
                const pendingResult = await AbonnementService.checkPendingSubscriptions();
                if (pendingResult.success && pendingResult.data?.activated?.length > 0) {
                    setSuccess(`${pendingResult.data.activated.length} abonnement(s) activé(s) !`);
                }
            } catch (e) {
                console.log('Check pending subscriptions error (non-bloquant):', e);
            }

            // Charger TOUTES les souscriptions
            const souscriptionsResult = await AbonnementService.getMesSouscriptions();

            if (souscriptionsResult.success && Array.isArray(souscriptionsResult.data)) {
                // Filtrer pour garder seulement les actives
                const actives = souscriptionsResult.data.filter(s => s.statut === 'active');
                setSouscriptions(actives);

                // Déplier la première carte par défaut
                if (actives.length > 0) {
                    setExpandedCards({ [actives[0].id]: true });
                }
            }

            // Charger la méthode de paiement
            const pmResult = await AbonnementService.getPaymentMethod();
            if (pmResult.success && pmResult.data?.hasPaymentMethod) {
                setPaymentMethod(pmResult.data);
            }
        } catch (err) {
            console.error('Erreur chargement:', err);
            setError('Erreur lors du chargement des données');
        } finally {
            setLoading(false);
        }
    };

    // Toggle le renouvellement automatique pour une souscription spécifique
    const handleToggleAutoRenew = async (souscriptionId) => {
        setToggleLoadingMap(prev => ({ ...prev, [souscriptionId]: true }));
        setError(null);
        setSuccess(null);

        try {
            const result = await AbonnementService.toggleAutoRenew(souscriptionId);

            if (result.success) {
                const newValue = result.data.renouvellementAuto ?? result.data.autoRenew;

                // Mettre à jour la souscription dans la liste
                setSouscriptions(prev => prev.map(s =>
                    s.id === souscriptionId
                        ? { ...s, renouvellementAuto: newValue }
                        : s
                ));

                setSuccess(
                    newValue
                        ? 'Renouvellement automatique activé'
                        : 'Renouvellement automatique désactivé'
                );
            } else {
                setError(result.message || 'Erreur lors de la modification');
            }
        } catch (err) {
            console.error('Erreur toggle:', err);
            setError('Une erreur est survenue');
        } finally {
            setToggleLoadingMap(prev => ({ ...prev, [souscriptionId]: false }));
        }
    };

    // Mettre à jour la carte bancaire
    const handleUpdateCard = async () => {
        setUpdateCardLoading(true);
        setError(null);

        try {
            const result = await AbonnementService.createUpdatePaymentSession();

            if (result.success && result.data?.url) {
                window.location.href = result.data.url;
            } else {
                setError(result.message || 'Erreur lors de la création de la session');
            }
        } catch (err) {
            console.error('Erreur update card:', err);
            setError('Une erreur est survenue');
        } finally {
            setUpdateCardLoading(false);
        }
    };

    // Toggle l'expansion d'une carte
    const toggleCardExpansion = (souscriptionId) => {
        setExpandedCards(prev => ({
            ...prev,
            [souscriptionId]: !prev[souscriptionId]
        }));
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const formatDateShort = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR'
        }).format(price);
    };

    const getCardBrandIcon = (brand) => {
        switch (brand?.toLowerCase()) {
            case 'visa':
                return '💳 Visa';
            case 'mastercard':
                return '💳 Mastercard';
            case 'amex':
                return '💳 Amex';
            default:
                return '💳 Carte';
        }
    };

    // Calculer les jours restants pour une souscription
    const getJoursRestants = (souscription) => {
        if (!souscription?.dateFin) return 0;
        const now = new Date();
        const fin = new Date(souscription.dateFin);
        const diff = Math.ceil((fin - now) / (1000 * 60 * 60 * 24));
        return Math.max(0, diff);
    };

    // Vérifier si une souscription expire bientôt (< 30 jours)
    const isExpiringSoon = (souscription) => {
        return getJoursRestants(souscription) <= 30;
    };

    // Obtenir le statut badge d'une souscription
    const getStatusBadge = (souscription) => {
        const jours = getJoursRestants(souscription);
        if (jours === 0) return { class: 'expired', text: 'Expirée' };
        if (jours <= 7) return { class: 'warning', text: `${jours}j restants` };
        if (jours <= 30) return { class: 'warning', text: 'Expire bientôt' };
        return { class: 'active', text: 'Actif' };
    };

    // Nom de l'abonnement
    const getAbonnementName = (souscription) => {
        if (souscription.abonnement?.nom) return souscription.abonnement.nom;
        const duree = souscription.abonnement?.dureeEnMois || 12;
        return `Abonnement ${duree} mois`;
    };

    // Total des fiches de toutes les souscriptions actives
    const getTotalFiches = () => {
        return souscriptions.reduce((acc, s) => acc + (s.nombreFiches || 0), 0);
    };

    // Vérifier si une souscription a utilisé un code promo (mois gratuits ou réduction)
    const hasUsedCodePromo = (souscription) => {
        return !!souscription.codePromoId || souscription.aUtiliseCodePromo;
    };

    // Vérifier si c'est un code promo mois gratuits (pas de paiement)
    const isFreeMonthsPromo = (souscription) => {
        return souscription.methodePaiement === 'code_promo';
    };

    // Vérifier si c'est un code promo réduction (paiement réduit)
    const isReductionPromo = (souscription) => {
        return hasUsedCodePromo(souscription) && souscription.methodePaiement === 'card';
    };

    return (
        <div className="gestion-abonnement-page">
            {/* Header */}
            <header className={`page-header ${isScrolled ? 'scrolled' : ''}`}>
                <button className="header-btn" onClick={() => navigate(previousPath)}>
                    <IonIcon icon={arrowBackOutline} />
                </button>
                <h1 className="page-title">Mes abonnements</h1>
            </header>

            <div className="gestion-scroll" onScroll={handleScroll}>
                <div className="gestion-content">
                    {/* Messages */}
                    {error && (
                        <div className="message-banner error">
                            <IonIcon icon={alertCircleOutline} />
                            <span>{error}</span>
                            <button onClick={() => setError(null)}>
                                <IonIcon icon={closeOutline} />
                            </button>
                        </div>
                    )}

                    {success && (
                        <div className="message-banner success">
                            <IonIcon icon={checkmarkCircle} />
                            <span>{success}</span>
                            <button onClick={() => setSuccess(null)}>
                                <IonIcon icon={closeOutline} />
                            </button>
                        </div>
                    )}

                    {/* Loading */}
                    {loading ? (
                        <div className="gestion-loading">
                            <div className="loading-spinner"></div>
                            <span>Chargement...</span>
                        </div>
                    ) : souscriptions.length === 0 ? (
                        /* Pas d'abonnement */
                        <div className="no-subscription">
                            <div className="no-sub-icon">
                                <IonIcon icon={storefrontOutline} />
                            </div>
                            <h2>Aucun abonnement actif</h2>
                            <p>
                                Souscrivez à un abonnement pour créer vos fiches commerce
                                et profiter de tous les avantages.
                            </p>
                            <button
                                className="subscribe-btn"
                                onClick={() => navigate('/auth/abonnement')}
                            >
                                <IonIcon icon={sparklesOutline} />
                                <span>Voir les offres</span>
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* Résumé global */}
                            <section className="summary-section">
                                <div className="summary-card">
                                    <div className="summary-item">
                                        <IonIcon icon={layersOutline} />
                                        <div className="summary-info">
                                            <span className="summary-value">{souscriptions.length}</span>
                                            <span className="summary-label">
                                                Abonnement{souscriptions.length > 1 ? 's' : ''} actif{souscriptions.length > 1 ? 's' : ''}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="summary-divider"></div>
                                    <div className="summary-item">
                                        <IonIcon icon={storefrontOutline} />
                                        <div className="summary-info">
                                            <span className="summary-value">{getTotalFiches()}</span>
                                            <span className="summary-label">
                                                Fiche{getTotalFiches() > 1 ? 's' : ''} disponible{getTotalFiches() > 1 ? 's' : ''}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Liste des souscriptions */}
                            {souscriptions.map((souscription) => {
                                const status = getStatusBadge(souscription);
                                const joursRestants = getJoursRestants(souscription);
                                const isExpiring = isExpiringSoon(souscription);
                                const isExpanded = expandedCards[souscription.id];
                                const isToggleLoading = toggleLoadingMap[souscription.id];
                                const usedPromo = hasUsedCodePromo(souscription);
                                const isFreePromo = isFreeMonthsPromo(souscription);
                                const isReduction = isReductionPromo(souscription);

                                return (
                                    <section key={souscription.id} className="subscription-card">
                                        {/* Header de la carte */}
                                        <div
                                            className="card-header clickable"
                                            onClick={() => toggleCardExpansion(souscription.id)}
                                        >
                                            <div className="card-icon">
                                                <IonIcon icon={documentTextOutline} />
                                            </div>
                                            <div className="card-title">
                                                <span className="label">Abonnement</span>
                                                <span className="name">{getAbonnementName(souscription)}</span>
                                            </div>
                                            <span className={`status-badge ${status.class}`}>
                                                {status.text}
                                            </span>
                                            <IonIcon
                                                icon={isExpanded ? chevronUpOutline : chevronDownOutline}
                                                className="expand-icon"
                                            />
                                        </div>

                                        {/* Stats rapides (toujours visibles) */}
                                        <div className="card-stats">
                                            <div className="stat">
                                                <IonIcon icon={storefrontOutline} />
                                                <div className="stat-info">
                                                    <span className="stat-value">{souscription.nombreFiches || 1}</span>
                                                    <span className="stat-label">Fiche{(souscription.nombreFiches || 1) > 1 ? 's' : ''}</span>
                                                </div>
                                            </div>
                                            <div className="stat-divider"></div>
                                            <div className="stat">
                                                <IonIcon icon={timeOutline} />
                                                <div className="stat-info">
                                                    <span className={`stat-value ${isExpiring ? 'warning' : ''}`}>
                                                        {joursRestants}
                                                    </span>
                                                    <span className="stat-label">Jours restants</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Badge code promo si utilisé */}
                                        {usedPromo && (
                                            <div className={`promo-badge ${isFreePromo ? 'free' : 'reduction'}`}>
                                                <IonIcon icon={isFreePromo ? sparklesOutline : pricetagOutline} />
                                                <span>{isFreePromo ? 'Offert par code promo' : 'Réduction appliquée'}</span>
                                            </div>
                                        )}

                                        {/* Contenu déplié */}
                                        {isExpanded && (
                                            <div className="card-expanded">
                                                {/* Infos détaillées */}
                                                <div className="info-list">
                                                    <div className="info-item">
                                                        <div className="info-icon">
                                                            <IonIcon icon={calendarOutline} />
                                                        </div>
                                                        <div className="info-content">
                                                            <span className="info-label">Période</span>
                                                            <span className="info-value">
                                                                {formatDateShort(souscription.dateDebut)} → {formatDateShort(souscription.dateFin)}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="info-item">
                                                        <div className="info-icon">
                                                            <IonIcon icon={walletOutline} />
                                                        </div>
                                                        <div className="info-content">
                                                            <span className="info-label">Montant payé</span>
                                                            <span className="info-value">
                                                                {isFreePromo
                                                                    ? 'Gratuit (code promo)'
                                                                    : `${formatPrice(souscription.montantPayeTTC || 0)} TTC`
                                                                }
                                                                {isReduction && (
                                                                    <span className="reduction-badge">Réduit</span>
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Renouvellement automatique - SEULEMENT si pas de code promo */}
                                                {!usedPromo ? (
                                                    <div className="renew-card">
                                                        <div className="renew-status">
                                                            <div className={`renew-icon ${souscription.renouvellementAuto ? 'active' : ''}`}>
                                                                <IonIcon icon={refreshOutline} />
                                                            </div>
                                                            <div className="renew-info">
                                                                <span className="renew-title">
                                                                    Renouvellement {souscription.renouvellementAuto ? 'activé' : 'désactivé'}
                                                                </span>
                                                                <span className="renew-description">
                                                                    {souscription.renouvellementAuto
                                                                        ? `Prochain prélèvement le ${formatDateShort(souscription.dateFin)}`
                                                                        : 'Ne sera pas renouvelé automatiquement'
                                                                    }
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <button
                                                            className={`renew-toggle ${souscription.renouvellementAuto ? 'active' : ''}`}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleToggleAutoRenew(souscription.id);
                                                            }}
                                                            disabled={isToggleLoading}
                                                        >
                                                            {isToggleLoading ? (
                                                                <span className="loading-spinner small"></span>
                                                            ) : (
                                                                <span className="toggle-switch">
                                                                    <span className="toggle-knob"></span>
                                                                </span>
                                                            )}
                                                        </button>
                                                    </div>
                                                ) : (
                                                    /* Abonnement avec code promo - pas de renouvellement */
                                                    <div className={`promo-info-card ${isReduction ? 'reduction' : 'free'}`}>
                                                        <div className="promo-icon">
                                                            <IonIcon icon={isReduction ? lockClosedOutline : sparklesOutline} />
                                                        </div>
                                                        <div className="promo-info">
                                                            <span className="promo-title">
                                                                {isFreePromo ? 'Abonnement offert' : 'Offre promotionnelle'}
                                                            </span>
                                                            <span className="promo-description">
                                                                {isFreePromo
                                                                    ? 'Cet abonnement a été activé via un code promo et ne sera pas renouvelé automatiquement.'
                                                                    : 'Cet abonnement a bénéficié d\'une réduction promotionnelle. Le renouvellement automatique n\'est pas disponible. À l\'expiration, vous pourrez souscrire un nouvel abonnement au tarif normal.'
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Avertissements - SEULEMENT si pas de code promo */}
                                                {!usedPromo && !souscription.renouvellementAuto && isExpiring && (
                                                    <div className="renew-warning">
                                                        <IonIcon icon={warningOutline} />
                                                        <span>
                                                            Expire dans {joursRestants} jours.
                                                            Activez le renouvellement pour ne pas perdre vos fiches.
                                                        </span>
                                                    </div>
                                                )}

                                                {!usedPromo && souscription.renouvellementAuto && (
                                                    <div className="renew-notice">
                                                        <IonIcon icon={informationCircleOutline} />
                                                        <span>
                                                            Rappel envoyé 30 jours et 7 jours avant le prélèvement.
                                                        </span>
                                                    </div>
                                                )}

                                                {/* Avertissement expiration code promo */}
                                                {usedPromo && isExpiring && (
                                                    <div className="renew-warning">
                                                        <IonIcon icon={warningOutline} />
                                                        <span>
                                                            Expire dans {joursRestants} jours.
                                                            {isFreePromo
                                                                ? ' Souscrivez à un abonnement payant pour continuer.'
                                                                : ' Souscrivez un nouvel abonnement au tarif normal pour continuer.'
                                                            }
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </section>
                                );
                            })}

                            {/* Méthode de paiement */}
                            <section className="payment-section">
                                <h3>Méthode de paiement</h3>

                                {paymentMethod?.hasPaymentMethod ? (
                                    <div className="payment-card">
                                        <div className="payment-info">
                                            <div className="card-visual">
                                                <span className="card-brand">
                                                    {getCardBrandIcon(paymentMethod.card?.brand)}
                                                </span>
                                                <span className="card-number">
                                                    •••• •••• •••• {paymentMethod.card?.last4}
                                                </span>
                                            </div>
                                            <span className="card-expiry">
                                                Expire {paymentMethod.card?.expMonth}/{paymentMethod.card?.expYear}
                                            </span>
                                        </div>
                                        <button
                                            className="update-card-btn"
                                            onClick={handleUpdateCard}
                                            disabled={updateCardLoading}
                                        >
                                            {updateCardLoading ? (
                                                <span className="loading-spinner small"></span>
                                            ) : (
                                                <>
                                                    <IonIcon icon={createOutline} />
                                                    <span>Modifier</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="no-payment">
                                        <div className="no-payment-icon">
                                            <IonIcon icon={cardOutline} />
                                        </div>
                                        <p>Aucune carte enregistrée</p>
                                        <button
                                            className="add-card-btn"
                                            onClick={handleUpdateCard}
                                            disabled={updateCardLoading}
                                        >
                                            {updateCardLoading ? (
                                                <span className="loading-spinner small"></span>
                                            ) : (
                                                <>
                                                    <IonIcon icon={addCircleOutline} />
                                                    <span>Ajouter une carte</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                )}

                                <div className="payment-secure">
                                    <IonIcon icon={shieldCheckmarkOutline} />
                                    <span>Paiements sécurisés par Stripe</span>
                                </div>
                            </section>

                            {/* Actions */}
                            <section className="actions-section">
                                <button
                                    className="action-btn primary"
                                    onClick={() => navigate('/auth/abonnement')}
                                >
                                    <IonIcon icon={addCircleOutline} />
                                    <span>Ajouter des fiches</span>
                                    <IonIcon icon={chevronForwardOutline} className="chevron" />
                                </button>
                            </section>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GestionAbonnement;