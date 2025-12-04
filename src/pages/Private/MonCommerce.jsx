import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { IonIcon } from '@ionic/react';
import {
    arrowBackOutline,
    addOutline,
    storefrontOutline,
    eyeOutline,
    createOutline,
    trashOutline,
    refreshOutline,
    warningOutline,
    locationOutline,
    calendarOutline,
    closeOutline,
    timeOutline,
    flashOutline,
    checkmarkCircleOutline,
    lockClosedOutline
} from 'ionicons/icons';
import PrestataireService from '../../Services/Prestataire.services';
import FicheFormModal from '../../components/Forms/FicheFormModal';

const MonCommerce = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const previousPath = location.state?.previousPath || '/auth/maps';

    const [fiches, setFiches] = useState([]);
    const [maxFiches, setMaxFiches] = useState(1);
    const [peutCreer, setPeutCreer] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Modal création/édition
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFiche, setEditingFiche] = useState(null);

    // Modal suppression
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, fiche: null });
    const [deleteConfirmText, setDeleteConfirmText] = useState('');
    const [deleteLoading, setDeleteLoading] = useState(false);

    // Modal activation (NOUVEAU)
    const [activationModal, setActivationModal] = useState({ isOpen: false, fiche: null });
    const [souscriptionsDisponibles, setSouscriptionsDisponibles] = useState([]);
    const [activationLoading, setActivationLoading] = useState(false);
    const [loadingSouscriptions, setLoadingSouscriptions] = useState(false);

    useEffect(() => {
        loadFiches();
    }, []);

    const loadFiches = async () => {
        setLoading(true);
        try {
            const result = await PrestataireService.getMyFiches();
            if (result.success) {
                setFiches(result.data.fiches || []);
                setMaxFiches(result.data.maxFiches ?? 1);
                setPeutCreer(result.data.peutCreer || false);
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('Erreur lors du chargement');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingFiche(null);
        setIsModalOpen(true);
    };

    const handleEdit = (fiche) => {
        setEditingFiche(fiche);
        setIsModalOpen(true);
    };

    const handleView = (fiche) => {
        navigate(`/auth/prestataire/${fiche.id}`);
    };

    // Ouvrir la modal de suppression
    const handleDelete = (fiche) => {
        setDeleteModal({ isOpen: true, fiche });
        setDeleteConfirmText('');
    };

    // Confirmer la suppression
    const confirmDelete = async () => {
        if (deleteConfirmText.toLowerCase() !== 'supprimer') return;

        setDeleteLoading(true);
        try {
            const result = await PrestataireService.deleteFiche(deleteModal.fiche.id);
            if (result.success) {
                setSuccess('Fiche supprimée avec succès');
                setDeleteModal({ isOpen: false, fiche: null });
                setDeleteConfirmText('');
                loadFiches();
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('Erreur lors de la suppression');
        } finally {
            setDeleteLoading(false);
        }
    };

    // Fermer la modal de suppression
    const closeDeleteModal = () => {
        if (deleteLoading) return;
        setDeleteModal({ isOpen: false, fiche: null });
        setDeleteConfirmText('');
    };

    // ==========================================
    // GESTION ACTIVATION FICHE (NOUVEAU)
    // ==========================================

    // Ouvrir la modal d'activation
    const handleActivate = async (fiche) => {
        setActivationModal({ isOpen: true, fiche });
        setLoadingSouscriptions(true);

        try {
            const result = await PrestataireService.getSouscriptionsDisponibles();
            if (result.success) {
                setSouscriptionsDisponibles(result.data || []);
            } else {
                setError(result.message || 'Erreur lors du chargement des abonnements');
                setActivationModal({ isOpen: false, fiche: null });
            }
        } catch (err) {
            setError('Erreur lors du chargement des abonnements disponibles');
            setActivationModal({ isOpen: false, fiche: null });
        } finally {
            setLoadingSouscriptions(false);
        }
    };

    // Confirmer l'activation avec une souscription
    const confirmActivation = async (souscriptionId) => {
        setActivationLoading(true);

        try {
            const result = await PrestataireService.activerFicheAvecSouscription(
                activationModal.fiche.id,
                souscriptionId
            );

            if (result.success) {
                setSuccess(result.message || 'Fiche activée avec succès !');
                setActivationModal({ isOpen: false, fiche: null });
                setSouscriptionsDisponibles([]);
                loadFiches();
            } else {
                setError(result.message || 'Erreur lors de l\'activation');
            }
        } catch (err) {
            setError('Erreur lors de l\'activation de la fiche');
        } finally {
            setActivationLoading(false);
        }
    };

    // Fermer la modal d'activation
    const closeActivationModal = () => {
        if (activationLoading) return;
        setActivationModal({ isOpen: false, fiche: null });
        setSouscriptionsDisponibles([]);
    };

    const handleReactivate = async (fiche) => {
        try {
            const result = await PrestataireService.reactivateFiche(fiche.id);
            if (result.success) {
                setSuccess('Fiche réactivée avec succès');
                loadFiches();
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('Erreur lors de la réactivation');
        }
    };

    const handleModalSuccess = () => {
        setIsModalOpen(false);
        setEditingFiche(null);
        setSuccess(editingFiche ? 'Fiche modifiée avec succès' : 'Fiche créée avec succès. Pensez à l\'activer !');
        loadFiches();
    };

    // Badge de statut (Active/Inactive/Expirée/Bloquée/En attente)
    const getStatusBadge = (fiche) => {
        if (fiche.estBlackliste) {
            return <span className="status-badge blacklisted">Bloquée</span>;
        }
        if (fiche.needsActivation) {
            return <span className="status-badge pending">En attente</span>;
        }
        if (fiche.isExpired) {
            return <span className="status-badge expired">Expirée</span>;
        }
        if (!fiche.estActif) {
            return <span className="status-badge inactive">Inactive</span>;
        }
        return <span className="status-badge active">Active</span>;
    };

    // Badge des jours restants (séparé du statut)
    const getDaysRemainingBadge = (fiche) => {
        // Ne pas afficher si en attente d'activation, expirée, inactive ou blacklistée
        if (fiche.needsActivation || fiche.isExpired || !fiche.estActif || fiche.estBlackliste) {
            return null;
        }

        const jours = fiche.joursRestants;

        if (jours === null || jours === undefined) {
            return null;
        }

        // Déterminer la classe CSS selon le nombre de jours
        let className = 'days-badge';
        if (jours <= 7) {
            className += ' critical'; // Rouge - urgent
        } else if (jours <= 30) {
            className += ' warning'; // Orange - attention
        } else if (jours <= 90) {
            className += ' info'; // Bleu - info
        } else {
            className += ' normal'; // Vert - ok
        }

        return (
            <span className={className}>
                <IonIcon icon={timeOutline} />
                {jours}j restants
            </span>
        );
    };

    // Badge durée abonnement (6 ou 12 mois)
    const getAbonnementBadge = (fiche) => {
        if (fiche.needsActivation || !fiche.abonnementInfo) {
            return null;
        }

        const duree = fiche.abonnementInfo.dureeEnMois;
        return (
            <span className="abonnement-badge">
                <IonIcon icon={lockClosedOutline} />
                {duree} mois
            </span>
        );
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '—';
        return new Date(dateStr).toLocaleDateString('fr-FR');
    };

    if (loading) {
        return (
            <div className="prestataire-page">
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Chargement...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="prestataire-page">
            <div className="page-header">
                <button className="back-btn" onClick={() => navigate(previousPath, { state: { openDrawer: true } })}>
                    <IonIcon icon={arrowBackOutline} />
                </button>
                <h1>Mes Fiches</h1>
                <button
                    className="add-btn"
                    onClick={handleCreate}
                    disabled={!peutCreer}
                    title={!peutCreer ? 'Limite atteinte' : 'Ajouter une fiche'}
                >
                    <IonIcon icon={addOutline} />
                </button>
            </div>

            {/* Indicateur de limite */}
            <div className="fiches-limit-info">
                <span>{fiches.length} / {maxFiches} fiche(s)</span>
                {!peutCreer && (
                    <span className="limit-reached">Limite atteinte</span>
                )}
            </div>

            {/* Messages */}
            {error && (
                <div className="message-banner error">
                    <IonIcon icon={warningOutline} />
                    <span>{error}</span>
                    <button onClick={() => setError(null)}>
                        <IonIcon icon={closeOutline} />
                    </button>
                </div>
            )}

            {success && (
                <div className="message-banner success">
                    <span>{success}</span>
                    <button onClick={() => setSuccess(null)}>
                        <IonIcon icon={closeOutline} />
                    </button>
                </div>
            )}

            {/* Liste des fiches */}
            {fiches.length === 0 ? (
                <div className="no-fiches">
                    <IonIcon icon={storefrontOutline} />
                    <h3>Aucune fiche commerce</h3>
                    <p>Créez votre première fiche pour commencer</p>
                    {peutCreer && (
                        <button className="btn-primary" onClick={handleCreate}>
                            <IonIcon icon={addOutline} />
                            Créer une fiche
                        </button>
                    )}
                </div>
            ) : (
                <div className="fiches-list">
                    {fiches.map(fiche => (
                        <div
                            key={fiche.id}
                            className={`fiche-card ${!fiche.isValid ? 'invalid' : ''} ${fiche.needsActivation ? 'needs-activation' : ''}`}
                        >
                            <div className="fiche-image">
                                {fiche.imagePrincipale ? (
                                    <img src={fiche.imagePrincipale} alt={fiche.nomCommerce} />
                                ) : (
                                    <div className="no-image">
                                        <IonIcon icon={storefrontOutline} />
                                    </div>
                                )}
                                {/* Conteneur pour les badges */}
                                <div className="fiche-badges">
                                    {getStatusBadge(fiche)}
                                    {getDaysRemainingBadge(fiche)}
                                    {getAbonnementBadge(fiche)}
                                </div>
                            </div>

                            <div className="fiche-infos">
                                <h3>{fiche.nomCommerce}</h3>
                                <p className="fiche-category">{fiche.typeCommerce}</p>

                                <div className="fiche-location">
                                    <IonIcon icon={locationOutline} />
                                    <span>{fiche.ville}</span>
                                </div>

                                {/* Afficher les dates seulement si activée */}
                                {!fiche.needsActivation && (
                                    <div className="fiche-dates">
                                        <IonIcon icon={calendarOutline} />
                                        <span>{formatDate(fiche.dateDebut)} → {formatDate(fiche.dateFin)}</span>
                                    </div>
                                )}

                                {fiche.noteGlobale > 0 && (
                                    <div className="fiche-stats">
                                        <span>⭐ {parseFloat(fiche.noteGlobale).toFixed(1)}</span>
                                        <span>{fiche.nombreAvis || 0} avis</span>
                                    </div>
                                )}
                            </div>

                            {/* Banner d'activation pour les fiches en attente */}
                            {fiche.needsActivation && (
                                <div className="activation-banner">
                                    <div className="activation-banner-content">
                                        <IonIcon icon={flashOutline} />
                                        <div>
                                            <strong>Activation requise</strong>
                                            <span>Choisissez votre formule 6 ou 12 mois</span>
                                        </div>
                                    </div>
                                    <button
                                        className="btn-activate"
                                        onClick={() => handleActivate(fiche)}
                                    >
                                        Activer
                                    </button>
                                </div>
                            )}

                            {/* Warning si proche expiration */}
                            {!fiche.needsActivation && fiche.isValid && fiche.joursRestants <= 30 && fiche.joursRestants > 0 && (
                                <div className={`expiration-warning ${fiche.joursRestants <= 7 ? 'critical' : ''}`}>
                                    <IonIcon icon={warningOutline} />
                                    <span>
                                        {fiche.joursRestants <= 7
                                            ? `⚠️ Expire dans ${fiche.joursRestants} jour(s) !`
                                            : `Expire dans ${fiche.joursRestants} jour(s)`
                                        }
                                    </span>
                                </div>
                            )}

                            <div className="fiche-actions">
                                <button
                                    className="action-btn view"
                                    onClick={() => handleView(fiche)}
                                    title="Voir"
                                >
                                    <IonIcon icon={eyeOutline} />
                                </button>
                                <button
                                    className="action-btn edit"
                                    onClick={() => handleEdit(fiche)}
                                    title="Modifier"
                                >
                                    <IonIcon icon={createOutline} />
                                </button>
                                {/* Bouton Activer pour les fiches en attente */}
                                {fiche.needsActivation && (
                                    <button
                                        className="action-btn activate"
                                        onClick={() => handleActivate(fiche)}
                                        title="Activer"
                                    >
                                        <IonIcon icon={flashOutline} />
                                    </button>
                                )}
                                {!fiche.estActif && !fiche.isExpired && !fiche.needsActivation && (
                                    <button
                                        className="action-btn reactivate"
                                        onClick={() => handleReactivate(fiche)}
                                        title="Réactiver"
                                    >
                                        <IonIcon icon={refreshOutline} />
                                    </button>
                                )}
                                <button
                                    className="action-btn delete"
                                    onClick={() => handleDelete(fiche)}
                                    title="Supprimer"
                                >
                                    <IonIcon icon={trashOutline} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal création/édition */}
            <FicheFormModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingFiche(null);
                }}
                onSuccess={handleModalSuccess}
                fiche={editingFiche}
            />

            {/* Modal confirmation suppression */}
            {deleteModal.isOpen && (
                <div className="delete-modal-overlay" onClick={closeDeleteModal}>
                    <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="delete-modal-header">
                            <div className="delete-modal-icon-wrapper">
                                <IonIcon icon={trashOutline} className="delete-modal-icon" />
                            </div>
                            <h2>Supprimer cette fiche ?</h2>
                        </div>

                        <div className="delete-modal-content">
                            <p className="delete-modal-fiche-name">"{deleteModal.fiche?.nomCommerce}"</p>

                            <div className="delete-modal-warning">
                                <IonIcon icon={warningOutline} />
                                <div>
                                    <strong>Attention !</strong>
                                    <span>Cette action est irréversible. Toutes les données associées à cette fiche seront définitivement supprimées (images, avis, statistiques...).</span>
                                </div>
                            </div>

                            <div className="delete-modal-confirm">
                                <label>Pour confirmer, tapez <strong>supprimer</strong> ci-dessous :</label>
                                <input
                                    type="text"
                                    value={deleteConfirmText}
                                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                                    placeholder="supprimer"
                                    autoComplete="off"
                                    disabled={deleteLoading}
                                />
                            </div>
                        </div>

                        <div className="delete-modal-actions">
                            <button
                                className="delete-modal-btn cancel"
                                onClick={closeDeleteModal}
                                disabled={deleteLoading}
                            >
                                Annuler
                            </button>
                            <button
                                className="delete-modal-btn confirm"
                                onClick={confirmDelete}
                                disabled={deleteConfirmText.toLowerCase() !== 'supprimer' || deleteLoading}
                            >
                                {deleteLoading ? (
                                    <>
                                        <div className="btn-spinner"></div>
                                        Suppression...
                                    </>
                                ) : (
                                    <>
                                        <IonIcon icon={trashOutline} />
                                        Supprimer définitivement
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal activation (NOUVEAU) */}
            {activationModal.isOpen && (
                <div className="activation-modal-overlay" onClick={closeActivationModal}>
                    <div className="activation-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="activation-modal-header">
                            <div className="activation-modal-icon-wrapper">
                                <IonIcon icon={flashOutline} className="activation-modal-icon" />
                            </div>
                            <h2>Activer votre fiche</h2>
                            <p className="activation-modal-fiche-name">"{activationModal.fiche?.nomCommerce}"</p>
                        </div>

                        <div className="activation-modal-content">
                            <div className="activation-modal-warning">
                                <IonIcon icon={lockClosedOutline} />
                                <span>Ce choix est <strong>définitif</strong> et ne pourra pas être modifié.</span>
                            </div>

                            {loadingSouscriptions ? (
                                <div className="activation-loading">
                                    <div className="spinner"></div>
                                    <p>Chargement des abonnements...</p>
                                </div>
                            ) : souscriptionsDisponibles.length === 0 ? (
                                <div className="activation-no-souscription">
                                    <IonIcon icon={warningOutline} />
                                    <h3>Aucun abonnement disponible</h3>
                                    <p>Vous devez d'abord acheter un abonnement pour activer cette fiche.</p>
                                    <button
                                        className="btn-primary"
                                        onClick={() => {
                                            closeActivationModal();
                                            navigate('/auth/abonnements');
                                        }}
                                    >
                                        Voir les abonnements
                                    </button>
                                </div>
                            ) : (
                                <div className="souscriptions-list">
                                    <p className="souscriptions-list-title">Choisissez l'abonnement à utiliser :</p>

                                    {souscriptionsDisponibles.map(souscription => (
                                        <div
                                            key={souscription.id}
                                            className={`souscription-card ${souscription.dureeEnMois === 12 ? 'popular' : ''}`}
                                        >
                                            <div className="souscription-card-header">
                                                <span className="souscription-duree">
                                                    {souscription.dureeEnMois} mois
                                                </span>
                                            </div>

                                            <div className="souscription-card-body">
                                                <div className="souscription-info">
                                                    <div className="souscription-slots">
                                                        <span className="slots-available">{souscription.slotsDisponibles}</span>
                                                        <span className="slots-label">slot{souscription.slotsDisponibles > 1 ? 's' : ''} disponible{souscription.slotsDisponibles > 1 ? 's' : ''}</span>
                                                    </div>
                                                    <div className="souscription-dates">
                                                        <IonIcon icon={calendarOutline} />
                                                        <span>Expire le {formatDate(souscription.dateFin)}</span>
                                                    </div>
                                                    <div className="souscription-remaining">
                                                        <IonIcon icon={timeOutline} />
                                                        <span>{souscription.joursRestants} jours restants</span>
                                                    </div>
                                                </div>

                                                <button
                                                    className="btn-select-souscription"
                                                    onClick={() => confirmActivation(souscription.id)}
                                                    disabled={activationLoading}
                                                >
                                                    {activationLoading ? (
                                                        <div className="btn-spinner"></div>
                                                    ) : (
                                                        <>
                                                            <IonIcon icon={checkmarkCircleOutline} />
                                                            Utiliser
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="activation-modal-actions">
                            <button
                                className="activation-modal-btn cancel"
                                onClick={closeActivationModal}
                                disabled={activationLoading}
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MonCommerce;