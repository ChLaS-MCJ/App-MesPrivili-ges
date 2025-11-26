import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IonIcon } from '@ionic/react';
import {
    arrowBackOutline,
    starOutline,
    barcodeOutline,
    peopleOutline,
    trendingUpOutline,
    chatbubbleOutline,
    calendarOutline,
    warningOutline
} from 'ionicons/icons';
import PrestataireService from '../../Services/Prestataire.services';

const MesStatistiques = () => {
    const navigate = useNavigate();
    const [fiches, setFiches] = useState([]);
    const [selectedFicheId, setSelectedFicheId] = useState(null);
    const [selectedFiche, setSelectedFiche] = useState(null);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadFiches();
    }, []);

    useEffect(() => {
        if (selectedFicheId) {
            const fiche = fiches.find(f => f.id === selectedFicheId);
            setSelectedFiche(fiche);
            loadStats(selectedFicheId);
        }
    }, [selectedFicheId, fiches]);

    const loadFiches = async () => {
        try {
            const result = await PrestataireService.getMyFiches();
            if (result.success && result.data.fiches.length > 0) {
                setFiches(result.data.fiches);
                setSelectedFicheId(result.data.fiches[0].id);
            }
        } catch (err) {
            console.error('Erreur:', err);
        } finally {
            setLoading(false);
        }
    };

    const loadStats = async (prestataireId) => {
        try {
            const result = await PrestataireService.getStats(prestataireId);
            if (result.success) {
                setStats(result.data);
            }
        } catch (err) {
            console.error('Erreur stats:', err);
        }
    };

    const renderStars = (note) => {
        const stars = [];
        const fullStars = Math.floor(note);
        const hasHalfStar = note % 1 >= 0.5;

        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push(<span key={i} className="star filled">★</span>);
            } else if (i === fullStars && hasHalfStar) {
                stars.push(<span key={i} className="star half">★</span>);
            } else {
                stars.push(<span key={i} className="star empty">☆</span>);
            }
        }
        return stars;
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short'
        });
    };

    const getJourLabel = (index) => {
        const jours = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
        const date = new Date();
        date.setDate(date.getDate() - (6 - index));
        return jours[date.getDay()];
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

    if (fiches.length === 0) {
        return (
            <div className="prestataire-page">
                <div className="page-header">
                    <button className="back-btn" onClick={() => navigate(-1)}>
                        <IonIcon icon={arrowBackOutline} />
                    </button>
                    <h1>Mes Statistiques</h1>
                    <div style={{ width: 40 }}></div>
                </div>
                <div className="no-fiches">
                    <IonIcon icon={trendingUpOutline} />
                    <h3>Aucune fiche commerce</h3>
                    <p>Créez une fiche pour voir vos statistiques</p>
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
                <h1>Mes Statistiques</h1>
                <div style={{ width: 40 }}></div>
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

            {/* Statut de la fiche */}
            {selectedFiche && (
                <div className="fiche-status-card">
                    <h3>{selectedFiche.nomCommerce}</h3>
                    <div className="status-info">
                        {selectedFiche.isValid ? (
                            <span className="status active">
                                Active • {selectedFiche.joursRestants} jours restants
                            </span>
                        ) : selectedFiche.isExpired ? (
                            <span className="status expired">Expirée</span>
                        ) : (
                            <span className="status inactive">Inactive</span>
                        )}
                    </div>
                </div>
            )}

            {/* Grille de stats */}
            {stats && (
                <>
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon">
                                <IonIcon icon={starOutline} />
                            </div>
                            <div className="stat-value">
                                {stats.noteGlobale ? stats.noteGlobale.toFixed(1) : '-'}
                            </div>
                            <div className="stat-label">Note moyenne</div>
                            <div className="stat-detail">{stats.nombreAvis || 0} avis</div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon">
                                <IonIcon icon={barcodeOutline} />
                            </div>
                            <div className="stat-value">{stats.nombreScansTotal || 0}</div>
                            <div className="stat-label">Scans total</div>
                            <div className="stat-detail">
                                +{stats.scansRecents || 0} ce mois
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon">
                                <IonIcon icon={peopleOutline} />
                            </div>
                            <div className="stat-value">{stats.nombreClientsUniques || 0}</div>
                            <div className="stat-label">Clients uniques</div>
                        </div>
                    </div>

                    {/* Graphique des 7 derniers jours */}
                    {stats.statsParJour && stats.statsParJour.length > 0 && (
                        <div className="chart-section">
                            <h3>
                                <IonIcon icon={trendingUpOutline} />
                                Scans - 7 derniers jours
                            </h3>
                            <div className="simple-chart">
                                {stats.statsParJour.map((jour, index) => {
                                    const maxScans = Math.max(...stats.statsParJour.map(j => j.scans || 0), 1);
                                    const height = ((jour.scans || 0) / maxScans) * 100;
                                    return (
                                        <div key={index} className="chart-bar-container">
                                            <div
                                                className="chart-bar"
                                                style={{ height: `${Math.max(height, 5)}%` }}
                                            >
                                                <span className="bar-value">{jour.scans || 0}</span>
                                            </div>
                                            <span className="bar-label">{getJourLabel(index)}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Derniers avis */}
                    <div className="recent-reviews-section">
                        <h3>
                            <IonIcon icon={chatbubbleOutline} />
                            Derniers avis
                        </h3>
                        {stats.derniersAvis && stats.derniersAvis.length > 0 ? (
                            <div className="reviews-list">
                                {stats.derniersAvis.slice(0, 5).map((avis, index) => (
                                    <div key={index} className="review-item">
                                        <div className="review-stars">
                                            {renderStars(avis.note)}
                                        </div>
                                        {avis.commentaire && (
                                            <p className="review-comment">{avis.commentaire}</p>
                                        )}
                                        <span className="review-date">
                                            {formatDate(avis.createdAt)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="no-reviews">Aucun avis pour le moment</p>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default MesStatistiques;
