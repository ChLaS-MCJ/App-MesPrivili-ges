import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { IonIcon } from '@ionic/react';
import { star, starOutline, locationOutline, timeOutline, storefrontOutline } from 'ionicons/icons';
import UserService from '../../Services/User.service';
import AvisService from '../../Services/Avis.services';
import RatingModal from '../../components/RatingModal';
import {
    ArrowLeftOutlined,
    SyncOutlined,
    FilterOutlined,
} from '@ant-design/icons';

const History = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const previousPath = location.state?.previousPath || '/auth/maps';

    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [showFilterMenu, setShowFilterMenu] = useState(false);

    // État pour le modal de notation
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [selectedScan, setSelectedScan] = useState(null);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        setLoading(true);

        try {
            const result = await UserService.getMyScans(1, 50);

            if (result.success) {
                const transformedScans = result.data.scans.map(scan => ({
                    id: scan.id,
                    title: scan.promotion?.titre || 'Visite',
                    commerce: scan.prestataire?.nomCommerce || 'Commerce',
                    ville: scan.prestataire?.ville || '',
                    image: scan.prestataire?.imagePrincipale,
                    date: new Date(scan.dateScan),
                    hasReview: !!scan.avis,
                    note: scan.avis?.note || null,
                    prestataire: scan.prestataire,
                    scanId: scan.id
                }));

                setHistory(transformedScans);
            } else {
                console.error('Erreur:', result.message);
                setHistory([]);
            }
        } catch (error) {
            console.error('Erreur lors du chargement:', error);
            setHistory([]);
        } finally {
            setLoading(false);
        }
    };

    // Filtrer l'historique
    const filteredHistory = history.filter(item => {
        if (filter === 'all') return true;
        if (filter === 'rated') return item.hasReview;
        if (filter === 'unrated') return !item.hasReview;
        return true;
    });

    // Formater la date
    const formatDate = (date) => {
        const now = new Date();
        const diff = now - date;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) {
            return "Aujourd'hui, " + date.toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit'
            });
        } else if (days === 1) {
            return "Hier, " + date.toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit'
            });
        } else if (days < 7) {
            return `Il y a ${days} jours`;
        } else {
            return date.toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            });
        }
    };

    // Ouvrir le modal de notation
    const handleRate = (item) => {
        setSelectedScan(item);
        setShowRatingModal(true);
    };

    // Soumettre la note
    const handleSubmitRating = async (note) => {
        if (!selectedScan?.scanId) return { success: false };

        const result = await AvisService.create(selectedScan.scanId, note);

        if (result.success) {
            // Mettre à jour l'historique local
            setHistory(prev => prev.map(item =>
                item.id === selectedScan.id
                    ? { ...item, hasReview: true, note: note }
                    : item
            ));
        }

        return result;
    };

    // Fermer le modal
    const handleCloseRating = () => {
        setShowRatingModal(false);
        setSelectedScan(null);
    };

    // Aller vers la fiche du commerce
    const handleGoToCommerce = (prestataireId) => {
        navigate(`/prestataire/${prestataireId}`);
    };

    // Rendu des étoiles
    const renderStars = (item) => {
        if (item.hasReview && item.note) {
            // Étoiles pleines selon la note
            return (
                <div className="stars-display rated">
                    {[1, 2, 3, 4, 5].map(i => (
                        <IonIcon
                            key={i}
                            icon={i <= item.note ? star : starOutline}
                            className={i <= item.note ? 'star-filled' : 'star-empty'}
                        />
                    ))}
                </div>
            );
        } else {
            // Étoiles vides cliquables
            return (
                <button className="rate-button" onClick={(e) => {
                    e.stopPropagation();
                    handleRate(item);
                }}>
                    <div className="stars-display unrated">
                        {[1, 2, 3, 4, 5].map(i => (
                            <IonIcon key={i} icon={starOutline} className="star-empty" />
                        ))}
                    </div>
                    <span className="rate-text">Noter</span>
                </button>
            );
        }
    };

    return (
        <div className="history-page">
            {/* Header */}
            <div className="history-header">
                <button className="back-button-history" onClick={() => navigate(previousPath, { state: { openDrawer: true } })}>
                    <ArrowLeftOutlined />
                </button>
                <h1>Historique</h1>
                <button
                    className={`filter-button ${showFilterMenu ? 'active' : ''}`}
                    onClick={() => setShowFilterMenu(!showFilterMenu)}
                >
                    <FilterOutlined />
                </button>
            </div>

            {/* Menu de filtres */}
            {showFilterMenu && (
                <div className="filter-menu">
                    <button
                        className={`filter-option ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => {
                            setFilter('all');
                            setShowFilterMenu(false);
                        }}
                    >
                        Tout
                    </button>
                    <button
                        className={`filter-option ${filter === 'rated' ? 'active' : ''}`}
                        onClick={() => {
                            setFilter('rated');
                            setShowFilterMenu(false);
                        }}
                    >
                        Notés
                    </button>
                    <button
                        className={`filter-option ${filter === 'unrated' ? 'active' : ''}`}
                        onClick={() => {
                            setFilter('unrated');
                            setShowFilterMenu(false);
                        }}
                    >
                        À noter
                    </button>
                </div>
            )}

            {/* Contenu */}
            {loading ? (
                <div className="loading-container">
                    <SyncOutlined spin style={{ fontSize: '48px', color: '#fe7e4f' }} />
                    <p>Chargement de l'historique...</p>
                </div>
            ) : filteredHistory.length === 0 ? (
                <div className="empty-state">
                    <IonIcon icon={timeOutline} />
                    <h3>Aucun historique</h3>
                    <p>
                        {filter === 'all'
                            ? "Vous n'avez pas encore scanné de QR code"
                            : filter === 'rated'
                                ? "Aucune visite notée"
                                : "Aucune visite à noter"
                        }
                    </p>
                </div>
            ) : (
                <div className="history-list">
                    {filteredHistory.map((item) => (
                        <div
                            key={item.id}
                            className="history-item"
                            onClick={() => handleGoToCommerce(item.prestataire?.id)}
                        >
                            {/* Image du commerce */}
                            <div className="item-image">
                                {item.image ? (
                                    <img src={item.image} alt={item.commerce} />
                                ) : (
                                    <div className="image-placeholder">
                                        <IonIcon icon={storefrontOutline} />
                                    </div>
                                )}
                            </div>

                            {/* Infos */}
                            <div className="item-content">
                                <h3 className="item-commerce">{item.commerce}</h3>
                                <p className="item-promo">{item.title}</p>

                                <div className="item-meta">
                                    <span className="item-location">
                                        <IonIcon icon={locationOutline} />
                                        {item.ville}
                                    </span>
                                    <span className="item-date">
                                        <IonIcon icon={timeOutline} />
                                        {formatDate(item.date)}
                                    </span>
                                </div>
                            </div>

                            {/* Étoiles */}
                            <div className="item-rating">
                                {renderStars(item)}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal de notation */}
            {showRatingModal && selectedScan && (
                <RatingModal
                    isOpen={showRatingModal}
                    onClose={handleCloseRating}
                    prestataire={selectedScan.prestataire}
                    onSubmitRating={handleSubmitRating}
                />
            )}
        </div>
    );
};

export default History;