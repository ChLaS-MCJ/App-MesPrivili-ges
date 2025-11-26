import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    closeOutline
} from 'ionicons/icons';
import PrestataireService from '../../Services/Prestataire.services';
import FicheFormModal from '../../components/Forms/FicheFormModal';

const MonCommerce = () => {
    const navigate = useNavigate();
    const [fiches, setFiches] = useState([]);
    const [maxFiches, setMaxFiches] = useState(1);
    const [peutCreer, setPeutCreer] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFiche, setEditingFiche] = useState(null);

    useEffect(() => {
        loadFiches();
    }, []);

    const loadFiches = async () => {
        setLoading(true);
        try {
            const result = await PrestataireService.getMyFiches();
            if (result.success) {
                setFiches(result.data.fiches || []);
                setMaxFiches(result.data.maxFiches || 1);
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

    const handleDelete = async (fiche) => {
        if (!window.confirm(`Supprimer la fiche "${fiche.nomCommerce}" ?`)) return;

        try {
            const result = await PrestataireService.deleteFiche(fiche.id);
            if (result.success) {
                setSuccess('Fiche supprimée avec succès');
                loadFiches();
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('Erreur lors de la suppression');
        }
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
        setSuccess(editingFiche ? 'Fiche modifiée avec succès' : 'Fiche créée avec succès');
        loadFiches();
    };

    const getStatusBadge = (fiche) => {
        if (fiche.estBlackliste) {
            return <span className="status-badge blacklisted">Bloquée</span>;
        }
        if (fiche.isExpired) {
            return <span className="status-badge expired">Expirée</span>;
        }
        if (!fiche.estActif) {
            return <span className="status-badge inactive">Inactive</span>;
        }
        if (fiche.joursRestants <= 7) {
            return <span className="status-badge warning">{fiche.joursRestants}j restants</span>;
        }
        return <span className="status-badge active">Active</span>;
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
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
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <IonIcon icon={arrowBackOutline} />
                </button>
                <h1>Mes Commerces</h1>
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
                            className={`fiche-card ${!fiche.isValid ? 'invalid' : ''}`}
                        >
                            <div className="fiche-image">
                                {fiche.imagePrincipale ? (
                                    <img src={fiche.imagePrincipale} alt={fiche.nomCommerce} />
                                ) : (
                                    <div className="no-image">
                                        <IonIcon icon={storefrontOutline} />
                                    </div>
                                )}
                                {getStatusBadge(fiche)}
                            </div>

                            <div className="fiche-infos">
                                <h3>{fiche.nomCommerce}</h3>
                                <p className="fiche-category">{fiche.typeCommerce}</p>

                                <div className="fiche-location">
                                    <IonIcon icon={locationOutline} />
                                    <span>{fiche.ville}</span>
                                </div>

                                <div className="fiche-dates">
                                    <IonIcon icon={calendarOutline} />
                                    <span>{formatDate(fiche.dateDebut)} → {formatDate(fiche.dateFin)}</span>
                                </div>

                                {fiche.noteGlobale && (
                                    <div className="fiche-stats">
                                        <span>⭐ {fiche.noteGlobale.toFixed(1)}</span>
                                        <span>{fiche.nombreAvis || 0} avis</span>
                                    </div>
                                )}
                            </div>

                            {/* Warning si proche expiration */}
                            {fiche.isValid && fiche.joursRestants <= 30 && fiche.joursRestants > 0 && (
                                <div className="expiration-warning">
                                    <IonIcon icon={warningOutline} />
                                    <span>Expire dans {fiche.joursRestants} jour(s)</span>
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
                                {!fiche.estActif && !fiche.isExpired && (
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
        </div>
    );
};

export default MonCommerce;
