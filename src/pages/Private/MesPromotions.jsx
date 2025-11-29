import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { IonIcon } from '@ionic/react';
import {
    arrowBackOutline,
    addOutline,
    giftOutline,
    createOutline,
    trashOutline,
    toggleOutline,
    calendarOutline,
    peopleOutline,
    barcodeOutline,
    warningOutline,
    closeOutline,
    storefrontOutline,
    locationOutline,
    starOutline,
    chevronDownOutline,
    checkmarkCircle
} from 'ionicons/icons';
import PrestataireService from '../../Services/Prestataire.services';
import PromotionService from '../../Services/Promotion.services';
import PromotionFormModal from '../../components/Forms/PromotionFormModal';


const MesPromotions = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const previousPath = location.state?.previousPath || '/auth/maps';

    const [fiches, setFiches] = useState([]);
    const [selectedFicheId, setSelectedFicheId] = useState(null);
    const [promotionsByFiche, setPromotionsByFiche] = useState({});
    const [loadingPromos, setLoadingPromos] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPromo, setEditingPromo] = useState(null);

    // Modal suppression
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, promo: null });
    const [deleteConfirmText, setDeleteConfirmText] = useState('');
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        loadFiches();
    }, []);

    const loadFiches = async () => {
        try {
            const result = await PrestataireService.getMyFiches();
            if (result.success && result.data.fiches.length > 0) {
                setFiches(result.data.fiches);
                // Sélectionner la première fiche par défaut
                const firstFicheId = result.data.fiches[0].id;
                setSelectedFicheId(firstFicheId);
                loadPromotions(firstFicheId);
            }
        } catch (err) {
            setError('Erreur lors du chargement des fiches');
        } finally {
            setLoading(false);
        }
    };

    const loadPromotions = async (prestataireId) => {
        setLoadingPromos(prev => ({ ...prev, [prestataireId]: true }));
        try {
            const result = await PromotionService.getMyPromotions(prestataireId);
            if (result.success) {
                setPromotionsByFiche(prev => ({
                    ...prev,
                    [prestataireId]: result.data || []
                }));
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('Erreur lors du chargement des promotions');
        } finally {
            setLoadingPromos(prev => ({ ...prev, [prestataireId]: false }));
        }
    };

    const handleSelectFiche = (ficheId) => {
        if (selectedFicheId === ficheId) {
            // Désélectionner si on clique sur la même
            setSelectedFicheId(null);
        } else {
            setSelectedFicheId(ficheId);
            // Charger les promos si pas encore fait
            if (!promotionsByFiche[ficheId]) {
                loadPromotions(ficheId);
            }
        }
    };

    const handleCreate = () => {
        if (!selectedFicheId) {
            setError('Veuillez sélectionner une fiche commerce');
            return;
        }
        setEditingPromo(null);
        setIsModalOpen(true);
    };

    const handleEdit = (promo) => {
        setEditingPromo(promo);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (promo) => {
        setDeleteModal({ isOpen: true, promo });
        setDeleteConfirmText('');
    };

    const confirmDelete = async () => {
        if (deleteConfirmText.toLowerCase() !== 'supprimer') return;

        setDeleteLoading(true);
        try {
            const result = await PromotionService.delete(deleteModal.promo.id);
            if (result.success) {
                setSuccess('Promotion supprimée');
                setDeleteModal({ isOpen: false, promo: null });
                setDeleteConfirmText('');
                loadPromotions(selectedFicheId);
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('Erreur lors de la suppression');
        } finally {
            setDeleteLoading(false);
        }
    };

    const closeDeleteModal = () => {
        if (deleteLoading) return;
        setDeleteModal({ isOpen: false, promo: null });
        setDeleteConfirmText('');
    };

    const handleToggle = async (promo) => {
        try {
            const result = await PromotionService.toggleActive(promo.id, !promo.estActive);
            if (result.success) {
                setSuccess(promo.estActive ? 'Promotion désactivée' : 'Promotion activée');
                loadPromotions(selectedFicheId);
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('Erreur lors de la mise à jour');
        }
    };

    const handleModalSuccess = () => {
        setIsModalOpen(false);
        setEditingPromo(null);
        setSuccess(editingPromo ? 'Promotion modifiée' : 'Promotion créée');
        loadPromotions(selectedFicheId);
    };

    const getPromoStatus = (promo) => {
        const now = new Date();
        const dateDebut = new Date(promo.dateDebut);
        const dateFin = new Date(promo.dateFin);

        if (dateFin < now) return 'promo-expired';
        if (dateDebut > now) return 'promo-pending';
        if (!promo.estActive) return 'promo-inactive';
        return 'promo-active';
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'promo-active': return 'Active';
            case 'promo-inactive': return 'Inactive';
            case 'promo-pending': return 'À venir';
            case 'promo-expired': return 'Expirée';
            default: return '';
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('fr-FR');
    };

    // Auto-hide messages
    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => setSuccess(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [success]);

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [error]);

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
                <h1>Mes Promotions</h1>
                <div className="header-spacer"></div>
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

            {/* Liste des fiches avec leurs promos */}
            {fiches.length === 0 ? (
                <div className="no-fiches">
                    <IonIcon icon={storefrontOutline} />
                    <h3>Aucune fiche commerce</h3>
                    <p>Créez d'abord une fiche commerce pour ajouter des promotions</p>
                    <button className="btn-primary-promotion" onClick={() => navigate('/auth/mon-commerce')}>
                        <IonIcon icon={addOutline} />
                        Créer une fiche
                    </button>
                </div>
            ) : (
                <div className="fiches-promos-list">
                    {fiches.map(fiche => {
                        const isSelected = selectedFicheId === fiche.id;
                        const promos = promotionsByFiche[fiche.id] || [];
                        const isLoadingPromos = loadingPromos[fiche.id];

                        return (
                            <div key={fiche.id} className={`fiche-accordion ${isSelected ? 'expanded' : ''}`}>
                                {/* Fiche Card Header */}
                                <div
                                    className={`fiche-accordion-header ${isSelected ? 'selected' : ''}`}
                                    onClick={() => handleSelectFiche(fiche.id)}
                                >
                                    <div className="fiche-checkbox">
                                        {isSelected ? (
                                            <IonIcon icon={checkmarkCircle} className="checked" />
                                        ) : (
                                            <div className="unchecked"></div>
                                        )}
                                    </div>

                                    <div className="fiche-image-mini">
                                        {fiche.imagePrincipale ? (
                                            <img src={fiche.imagePrincipale} alt={fiche.nomCommerce} />
                                        ) : (
                                            <div className="no-image">
                                                <IonIcon icon={storefrontOutline} />
                                            </div>
                                        )}
                                    </div>

                                    <div className="fiche-info">
                                        <h3>{fiche.nomCommerce}</h3>
                                        <div className="fiche-meta">
                                            <span className="fiche-location">
                                                <IonIcon icon={locationOutline} />
                                                {fiche.ville}
                                            </span>
                                        </div>
                                        <div className="fiche-promo-count">
                                            <IonIcon icon={giftOutline} />
                                            {promos.length} promotion{promos.length !== 1 ? 's' : ''}
                                        </div>
                                    </div>

                                    <div className={`fiche-chevron ${isSelected ? 'rotated' : ''}`}>
                                        <IonIcon icon={chevronDownOutline} />
                                    </div>
                                </div>

                                {/* Promos Content (accordéon) */}
                                {isSelected && (
                                    <div className="fiche-accordion-content">
                                        {isLoadingPromos ? (
                                            <div className="promos-loading">
                                                <div className="spinner-small"></div>
                                                <span>Chargement des promotions...</span>
                                            </div>
                                        ) : promos.length === 0 ? (
                                            <div className="no-promos-fiche">
                                                <IonIcon icon={giftOutline} />
                                                <p>Aucune promotion pour cette fiche</p>
                                                <button className="btn-add-promo" onClick={handleCreate}>
                                                    <IonIcon icon={addOutline} />
                                                    Créer une promotion
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="promos-list">
                                                {promos.map(promo => {
                                                    const status = getPromoStatus(promo);
                                                    return (
                                                        <div key={promo.id} className={`promo-card ${status}`}>
                                                            <div className="promo-header">
                                                                <h3>{promo.titre}</h3>
                                                                <span className={`promo-status-badge ${status}`}>
                                                                    {getStatusLabel(status)}
                                                                </span>
                                                            </div>

                                                            {promo.description && (
                                                                <p className="promo-description">{promo.description}</p>
                                                            )}

                                                            <div className="promo-dates">
                                                                <IonIcon icon={calendarOutline} />
                                                                <span>{formatDate(promo.dateDebut)} → {formatDate(promo.dateFin)}</span>
                                                            </div>

                                                            <div className="promo-stats">
                                                                <div className="stat">
                                                                    <IonIcon icon={barcodeOutline} />
                                                                    <span>{promo.nombreUtilisations || 0} scans</span>
                                                                </div>
                                                                <div className="stat">
                                                                    <IonIcon icon={peopleOutline} />
                                                                    <span>{promo.nombreClientsUniques || 0} clients</span>
                                                                </div>
                                                            </div>

                                                            <div className="promo-actions">
                                                                <button
                                                                    className={`action-btn toggle ${promo.estActive ? '' : 'off'}`}
                                                                    onClick={() => handleToggle(promo)}
                                                                    title={promo.estActive ? 'Désactiver' : 'Activer'}
                                                                    disabled={status === 'promo-expired'}
                                                                >
                                                                    <IonIcon icon={toggleOutline} />
                                                                </button>
                                                                <button
                                                                    className="action-btn edit"
                                                                    onClick={() => handleEdit(promo)}
                                                                    title="Modifier"
                                                                >
                                                                    <IonIcon icon={createOutline} />
                                                                </button>
                                                                <button
                                                                    className="action-btn delete"
                                                                    onClick={() => handleDeleteClick(promo)}
                                                                    title="Supprimer"
                                                                >
                                                                    <IonIcon icon={trashOutline} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    );
                                                })}

                                                {/* Bouton ajouter en bas */}
                                                <button className="btn-add-promo-bottom" onClick={handleCreate}>
                                                    <IonIcon icon={addOutline} />
                                                    Ajouter une promotion
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modal création/édition */}
            <PromotionFormModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingPromo(null);
                }}
                onSuccess={handleModalSuccess}
                promotion={editingPromo}
                prestataireId={selectedFicheId}
            />

            {/* Modal confirmation suppression */}
            {deleteModal.isOpen && (
                <div className="delete-modal-overlay" onClick={closeDeleteModal}>
                    <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="delete-modal-header">
                            <div className="delete-modal-icon-wrapper">
                                <IonIcon icon={trashOutline} className="delete-modal-icon" />
                            </div>
                            <h2>Supprimer cette promotion ?</h2>
                        </div>

                        <div className="delete-modal-content">
                            <p className="delete-modal-promo-name">"{deleteModal.promo?.titre}"</p>

                            <div className="delete-modal-warning">
                                <IonIcon icon={warningOutline} />
                                <div>
                                    <strong>Attention !</strong>
                                    <span>Cette action est irréversible. Les statistiques de cette promotion seront également supprimées.</span>
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
        </div>
    );
};

export default MesPromotions;