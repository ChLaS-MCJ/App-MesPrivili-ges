import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { IonIcon } from '@ionic/react';
import {
    arrowBackOutline,
    starOutline,
    barcodeOutline,
    peopleOutline,
    trendingUpOutline,
    trendingDownOutline,
    chatbubbleOutline,
    timeOutline,
    giftOutline,
    ribbonOutline,
    refreshOutline,
    storefrontOutline,
    heartOutline,
    flashOutline,
    checkmarkCircle,
    locationOutline,
    chevronDownOutline,
    eyeOutline
} from 'ionicons/icons';
import PrestataireService from '../../Services/Prestataire.services';
import StatsService from '../../Services/Stats.services';

const MesStatistiques = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const previousPath = location.state?.previousPath || '/auth/maps';

    const [fiches, setFiches] = useState([]);
    const [selectedFicheId, setSelectedFicheId] = useState(null);
    const [selectedFiche, setSelectedFiche] = useState(null);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingStats, setLoadingStats] = useState(false);
    const [periode, setPeriode] = useState(30);

    useEffect(() => {
        loadFiches();
    }, []);

    useEffect(() => {
        if (selectedFicheId) {
            const fiche = fiches.find(f => f.id === selectedFicheId);
            setSelectedFiche(fiche);
            loadStats(selectedFicheId, periode);
        }
    }, [selectedFicheId, periode]);

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

    const loadStats = async (prestataireId, periodeJours) => {
        setLoadingStats(true);
        try {
            const result = await StatsService.getByPrestataire(prestataireId, periodeJours);
            if (result.success) {
                setStats(result.data);
            }
        } catch (err) {
            console.error('Erreur stats:', err);
        } finally {
            setLoadingStats(false);
        }
    };

    const handleSelectFiche = (ficheId) => {
        setSelectedFicheId(ficheId);
    };

    const renderTrend = (value, inverse = false) => {
        if (value === 0 || value === null || value === undefined) {
            return <span className="trend-badge neutral">-</span>;
        }
        const isPositive = inverse ? value < 0 : value > 0;
        return (
            <span className={`trend-badge ${isPositive ? 'up' : 'down'}`}>
                <IonIcon icon={isPositive ? trendingUpOutline : trendingDownOutline} />
                {Math.abs(value)}%
            </span>
        );
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
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatDateShort = (dateStr) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short'
        });
    };

    const getMaxHour = () => {
        if (!stats?.graphiques?.scansParHeure) return 0;
        return Math.max(...stats.graphiques.scansParHeure, 1);
    };

    if (loading) {
        return (
            <div className="prestataire-page stats-page">
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Chargement...</p>
                </div>
            </div>
        );
    }

    if (fiches.length === 0) {
        return (
            <div className="prestataire-page stats-page">
                <div className="page-header">
                    <button className="back-btn" onClick={() => navigate(previousPath, { state: { openDrawer: true } })}>
                        <IonIcon icon={arrowBackOutline} />
                    </button>
                    <h1>Statistiques</h1>
                    <div className="header-spacer"></div>
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
        <div className="prestataire-page stats-page">
            <div className="page-header">
                <button className="back-btn" onClick={() => navigate(previousPath, { state: { openDrawer: true } })}>
                    <IonIcon icon={arrowBackOutline} />
                </button>
                <h1>Statistiques</h1>
                <button className="refresh-btn" onClick={() => loadStats(selectedFicheId, periode)} disabled={loadingStats}>
                    <IonIcon icon={refreshOutline} className={loadingStats ? 'spinning' : ''} />
                </button>
            </div>

            {/* Sélecteur de fiche - Design dropdown */}
            {fiches.length > 1 && (
                <div className="fiche-dropdown-container">
                    <div className="fiche-dropdown-selected" onClick={() => document.querySelector('.fiche-dropdown-options').classList.toggle('open')}>
                        <div className="fiche-dropdown-preview">
                            {selectedFiche?.imagePrincipale ? (
                                <img src={selectedFiche.imagePrincipale} alt={selectedFiche?.nomCommerce} />
                            ) : (
                                <IonIcon icon={storefrontOutline} />
                            )}
                        </div>
                        <div className="fiche-dropdown-info">
                            <span className="fiche-dropdown-name">{selectedFiche?.nomCommerce}</span>
                            <div className="fiche-dropdown-meta">
                                <span className="fiche-dropdown-ville">
                                    <IonIcon icon={locationOutline} />
                                    {selectedFiche?.ville}
                                </span>
                                <span className="fiche-dropdown-stats">
                                    <span className="fiche-dropdown-rating">
                                        <IonIcon icon={starOutline} />
                                        {parseFloat(selectedFiche?.noteGlobale || 0).toFixed(1)}
                                    </span>
                                    <span className="fiche-dropdown-views">
                                        <IonIcon icon={eyeOutline} />
                                        {selectedFiche?.nombreVisitesFiche || 0}
                                    </span>
                                </span>
                            </div>
                        </div>
                        <div className="fiche-dropdown-arrow">
                            <IonIcon icon={chevronDownOutline} />
                        </div>
                    </div>
                    <div className="fiche-dropdown-options">
                        {fiches.filter(f => f.id !== selectedFicheId).map(fiche => (
                            <div
                                key={fiche.id}
                                className="fiche-dropdown-option"
                                onClick={() => {
                                    handleSelectFiche(fiche.id);
                                    document.querySelector('.fiche-dropdown-options').classList.remove('open');
                                }}
                            >
                                <div className="fiche-dropdown-preview">
                                    {fiche.imagePrincipale ? (
                                        <img src={fiche.imagePrincipale} alt={fiche.nomCommerce} />
                                    ) : (
                                        <IonIcon icon={storefrontOutline} />
                                    )}
                                </div>
                                <div className="fiche-dropdown-info">
                                    <span className="fiche-dropdown-name">{fiche.nomCommerce}</span>
                                    <div className="fiche-dropdown-meta">
                                        <span className="fiche-dropdown-ville">
                                            <IonIcon icon={locationOutline} />
                                            {fiche.ville}
                                        </span>
                                        <span className="fiche-dropdown-stats">
                                            <span className="fiche-dropdown-rating">
                                                <IonIcon icon={starOutline} />
                                                {parseFloat(fiche.noteGlobale || 0).toFixed(1)}
                                            </span>
                                            <span className="fiche-dropdown-views">
                                                <IonIcon icon={eyeOutline} />
                                                {fiche.nombreVisitesFiche || 0}
                                            </span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Sélecteur de période */}
            <div className="periode-selector">
                {[
                    { value: 7, label: '7 jours' },
                    { value: 30, label: '30 jours' },
                    { value: 90, label: '3 mois' },
                    { value: 365, label: '1 an' }
                ].map(p => (
                    <button
                        key={p.value}
                        className={`periode-btn ${periode === p.value ? 'active' : ''}`}
                        onClick={() => setPeriode(p.value)}
                    >
                        {p.label}
                    </button>
                ))}
            </div>

            {loadingStats ? (
                <div className="stats-loading">
                    <div className="spinner-small"></div>
                    <span>Chargement des statistiques...</span>
                </div>
            ) : stats ? (
                <>
                    {/* Cards principales */}
                    <div className="stats-main-grid">
                        <div className="stat-main-card">
                            <div className="stat-main-icon vues">
                                <IonIcon icon={eyeOutline} />
                            </div>
                            <div className="stat-main-content">
                                <div className="stat-main-value">{stats.vues?.periode || 0}</div>
                                <div className="stat-main-label">Vues</div>
                                <div className="stat-main-trend">
                                    {renderTrend(stats.vues?.croissance)}
                                    <span className="stat-main-total">Total: {stats.vues?.total || 0}</span>
                                </div>
                            </div>
                        </div>

                        <div className="stat-main-card">
                            <div className="stat-main-icon scans">
                                <IonIcon icon={barcodeOutline} />
                            </div>
                            <div className="stat-main-content">
                                <div className="stat-main-value">{stats.scans?.periode || 0}</div>
                                <div className="stat-main-label">Scans</div>
                                <div className="stat-main-trend">
                                    {renderTrend(stats.scans?.croissance)}
                                    <span className="stat-main-total">Total: {stats.scans?.total || 0}</span>
                                </div>
                            </div>
                        </div>

                        <div className="stat-main-card">
                            <div className="stat-main-icon clients">
                                <IonIcon icon={peopleOutline} />
                            </div>
                            <div className="stat-main-content">
                                <div className="stat-main-value">{stats.clients?.periode || 0}</div>
                                <div className="stat-main-label">Nouveaux clients</div>
                                <div className="stat-main-trend">
                                    {renderTrend(stats.clients?.croissance)}
                                    <span className="stat-main-total">Total: {stats.clients?.total || 0}</span>
                                </div>
                            </div>
                        </div>

                        <div className="stat-main-card">
                            <div className="stat-main-icon avis">
                                <IonIcon icon={starOutline} />
                            </div>
                            <div className="stat-main-content">
                                <div className="stat-main-value">
                                    {stats.avis?.moyenne ? stats.avis.moyenne.toFixed(1) : '-'}
                                </div>
                                <div className="stat-main-label">Note moyenne</div>
                                <div className="stat-main-trend">
                                    <span className="stat-main-total">{stats.avis?.total || 0} avis</span>
                                </div>
                            </div>
                        </div>

                        <div className="stat-main-card">
                            <div className="stat-main-icon fidelite">
                                <IonIcon icon={heartOutline} />
                            </div>
                            <div className="stat-main-content">
                                <div className="stat-main-value">{stats.clients?.tauxRetour || 0}%</div>
                                <div className="stat-main-label">Taux de retour</div>
                                <div className="stat-main-trend">
                                    <span className="stat-main-total">Moy: {stats.clients?.moyenneVisites || 0} visites/client</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Graphique 7 derniers jours */}
                    <div className="chart-card">
                        <div className="chart-header">
                            <h3>
                                <IonIcon icon={trendingUpOutline} />
                                Activité des 7 derniers jours
                            </h3>
                        </div>
                        <div className="bar-chart">
                            {stats.graphiques?.scansParJour?.map((jour, index) => {
                                const maxScans = Math.max(...stats.graphiques.scansParJour.map(j => j.scans), 1);
                                const height = (jour.scans / maxScans) * 100;
                                return (
                                    <div key={index} className="bar-item">
                                        <div className="bar-value">{jour.scans}</div>
                                        <div className="bar-container">
                                            <div
                                                className="bar-fill"
                                                style={{ height: `${Math.max(height, 5)}%` }}
                                            />
                                        </div>
                                        <div className="bar-label">{jour.jour}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Heatmap horaire */}
                    <div className="chart-card">
                        <div className="chart-header">
                            <h3>
                                <IonIcon icon={timeOutline} />
                                Affluence par heure
                            </h3>
                        </div>
                        <div className="heatmap-container">
                            <div className="heatmap-grid">
                                {stats.graphiques?.scansParHeure?.map((count, hour) => {
                                    const maxCount = getMaxHour();
                                    const intensity = maxCount > 0 ? count / maxCount : 0;
                                    return (
                                        <div
                                            key={hour}
                                            className="heatmap-cell"
                                            style={{
                                                backgroundColor: `rgba(254, 126, 79, ${intensity * 0.8 + 0.1})`
                                            }}
                                            title={`${hour}h: ${count} scans`}
                                        >
                                            {count > 0 && <span className="heatmap-value">{count}</span>}
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="heatmap-hours">
                                <span>0h</span>
                                <span>6h</span>
                                <span>12h</span>
                                <span>18h</span>
                                <span>23h</span>
                            </div>
                            <div className="heatmap-legend">
                                <span>Faible</span>
                                <div className="heatmap-legend-gradient"></div>
                                <span>Fort</span>
                            </div>
                        </div>
                    </div>

                    {/* Distribution des notes */}
                    <div className="chart-card">
                        <div className="chart-header">
                            <h3>
                                <IonIcon icon={starOutline} />
                                Distribution des avis
                            </h3>
                        </div>
                        <div className="rating-distribution">
                            {[5, 4, 3, 2, 1].map(note => {
                                const count = stats.avis?.distribution?.[note] || 0;
                                const total = stats.avis?.total || 1;
                                const percentage = (count / total) * 100;
                                return (
                                    <div key={note} className="rating-row">
                                        <div className="rating-stars">
                                            {note} <span className="star filled">★</span>
                                        </div>
                                        <div className="rating-bar-container">
                                            <div
                                                className="rating-bar-fill"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                        <div className="rating-count">{count}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Promotions */}
                    {stats.promotions && (
                        <div className="info-card">
                            <div className="info-card-header">
                                <h3>
                                    <IonIcon icon={giftOutline} />
                                    Promotions
                                </h3>
                            </div>
                            <div className="promo-stats-grid">
                                <div className="promo-stat">
                                    <div className="promo-stat-value">{stats.promotions.total}</div>
                                    <div className="promo-stat-label">Total</div>
                                </div>
                                <div className="promo-stat">
                                    <div className="promo-stat-value highlight">{stats.promotions.actives}</div>
                                    <div className="promo-stat-label">Actives</div>
                                </div>
                                <div className="promo-stat">
                                    <div className="promo-stat-value">{stats.promotions.totalUtilisations}</div>
                                    <div className="promo-stat-label">Utilisations</div>
                                </div>
                            </div>
                            {stats.promotions.meilleurePromo && (
                                <div className="best-promo">
                                    <IonIcon icon={ribbonOutline} />
                                    <div className="best-promo-info">
                                        <span className="best-promo-label">Meilleure promo</span>
                                        <span className="best-promo-title">{stats.promotions.meilleurePromo.titre}</span>
                                        <span className="best-promo-stats">
                                            {stats.promotions.meilleurePromo.nombreUtilisations} utilisations
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Top Clients */}
                    <div className="info-card">
                        <div className="info-card-header">
                            <h3>
                                <IonIcon icon={ribbonOutline} />
                                Clients fidèles
                            </h3>
                        </div>
                        {stats.topClients && stats.topClients.length > 0 ? (
                            <div className="top-clients-list">
                                {stats.topClients.map((client, index) => {
                                    const fullName = [client.prenom, client.nom].filter(Boolean).join(' ') || 'Client';
                                    return (
                                        <div key={index} className="top-client-item">
                                            <div className="top-client-rank">#{index + 1}</div>
                                            <div className="top-client-avatar">
                                                {(client.prenom?.charAt(0) || client.nom?.charAt(0) || '?').toUpperCase()}
                                            </div>
                                            <div className="top-client-info">
                                                <span className="top-client-name">{fullName}</span>
                                                <span className="top-client-visits">{client.visites} visite{client.visites > 1 ? 's' : ''}</span>
                                            </div>
                                            <div className="top-client-date">
                                                {formatDateShort(client.derniereVisite)}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="empty-state-small">
                                <IonIcon icon={peopleOutline} />
                                <span>Aucun client pour le moment</span>
                            </div>
                        )}
                    </div>

                    {/* Activité récente */}
                    <div className="info-card">
                        <div className="info-card-header">
                            <h3>
                                <IonIcon icon={flashOutline} />
                                Activité récente
                            </h3>
                        </div>
                        {stats.derniersScans && stats.derniersScans.length > 0 ? (
                            <div className="activity-list">
                                {stats.derniersScans.map((scan, index) => (
                                    <div key={index} className="activity-item">
                                        <div className="activity-icon">
                                            <IonIcon icon={barcodeOutline} />
                                        </div>
                                        <div className="activity-info">
                                            <span className="activity-client">{scan.client}</span>
                                            <span className="activity-promo">{scan.promotion}</span>
                                        </div>
                                        <span className="activity-date">{formatDate(scan.date)}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="empty-state-small">
                                <IonIcon icon={barcodeOutline} />
                                <span>Aucune activité récente</span>
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <div className="no-stats">
                    <IonIcon icon={trendingUpOutline} />
                    <p>Aucune donnée disponible</p>
                </div>
            )}
        </div>
    );
};

export default MesStatistiques;