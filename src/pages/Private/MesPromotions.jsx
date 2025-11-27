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
    closeOutline
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
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPromo, setEditingPromo] = useState(null);

    useEffect(() => {
        loadFiches();
    }, []);

    useEffect(() => {
        if (selectedFicheId) {
            loadPromotions(selectedFicheId);
        }
    }, [selectedFicheId]);

    const loadFiches = async () => {
        try {
            const result = await PrestataireService.getMyFiches();
            if (result.success && result.data.fiches.length > 0) {
                setFiches(result.data.fiches);
                // Sélectionner la première fiche par défaut
                setSelectedFicheId(result.data.fiches[0].id);
            }
        } catch (err) {
            setError('Erreur lors du chargement des fiches');
        } finally {
            setLoading(false);
        }
    };

    const loadPromotions = async (prestataireId) => {
        setLoading(true);
        try {
            const result = await PromotionService.getMyPromotions(prestataireId);
            if (result.success) {
                setPromotions(result.data || []);
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('Erreur lors du chargement des promotions');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingPromo(null);
        setIsModalOpen(true);
    };

    const handleEdit = (promo) => {
        setEditingPromo(promo);
        setIsModalOpen(true);
    };

    const handleDelete = async (promo) => {
        if (!window.confirm(`Supprimer la promotion "${promo.titre}" ?`)) return;

        try {
            const result = await PromotionService.delete(promo.id);
            if (result.success) {
                setSuccess('Promotion supprimée');
                loadPromotions(selectedFicheId);
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('Erreur lors de la suppression');
        }
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

        if (dateFin < now) return 'expired';
        if (dateDebut > now) return 'pending';
        if (!promo.estActive) return 'inactive';
        return 'active';
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'active': return 'Active';
            case 'inactive': return 'Inactive';
            case 'pending': return 'À venir';
            case 'expired': return 'Expirée';
            default: return '';
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('fr-FR');
    };

    if (loading && fiches.length === 0) {
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
                <button
                    className="add-btn"
                    onClick={handleCreate}
                    disabled={!selectedFicheId}
                >
                    <IonIcon icon={addOutline} />
                </button>
            </div>

            {/* Sélecteur de fiche */}
            {fiches.length > 1 && (
                <div className="fiche-selector">
                    <label>Commerce :</label>
                    <select
                        value={selectedFicheId || ''}
                        onChange={(e) => setSelectedFicheId(Number(e.target.value))}
                    >
                        {fiches.map(fiche => (
                            <option key={fiche.id} value={fiche.id}>
                                {fiche.nomCommerce} - {fiche.ville}
                            </option>
                        ))}
                    </select>
                </div>
            )}

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

            {/* Liste des promotions */}
            {promotions.length === 0 ? (
                <div className="no-promotions">
                    <IonIcon icon={giftOutline} />
                    <h3>Aucune promotion</h3>
                    <p>Créez une promotion pour attirer des clients</p>
                    {selectedFicheId && (
                        <button className="btn-primary" onClick={handleCreate}>
                            <IonIcon icon={addOutline} />
                            Créer une promotion
                        </button>
                    )}
                </div>
            ) : (
                <div className="promotions-list">
                    {promotions.map(promo => {
                        const status = getPromoStatus(promo);
                        return (
                            <div key={promo.id} className={`promo-card ${status}`}>
                                <div className="promo-header">
                                    <h3>{promo.titre}</h3>
                                    <span className={`status-badge ${status}`}>
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
                                        disabled={status === 'expired'}
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
                                        onClick={() => handleDelete(promo)}
                                        title="Supprimer"
                                    >
                                        <IonIcon icon={trashOutline} />
                                    </button>
                                </div>
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
        </div>
    );
};

export default MesPromotions;
