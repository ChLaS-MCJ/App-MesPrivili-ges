import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Utils/AuthContext';
import UserService from '../../Services/User.service';
import {
    ArrowLeftOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
    SyncOutlined,
    DeleteOutlined,
    FilterOutlined,
} from '@ant-design/icons';

const History = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [showFilterMenu, setShowFilterMenu] = useState(false);

    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true);

            try {
                const result = await UserService.getMyScans(1, 50);

                if (result.success) {

                    const transformedScans = result.data.scans.map(scan => ({
                        id: scan.id,
                        type: 'scan',
                        title: scan.promotion?.titre || 'Scan effectué',
                        description: `${scan.prestataire?.nomCommerce || 'Commerce'} - ${scan.prestataire?.ville || ''}`,
                        date: new Date(scan.dateScan),
                        status: scan.avis ? 'completed' : 'pending',
                        promotion: scan.promotion,
                        prestataire: scan.prestataire,
                        scanId: scan.id,
                        hasReview: !!scan.avis
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

        fetchHistory();
    }, []);

    // Filtrer l'historique
    const filteredHistory = history.filter(item => {
        if (filter === 'all') return true;
        return item.status === filter;
    });

    // Obtenir l'icône selon le statut
    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed':
                return <CheckCircleOutlined className="status-icon completed" />;
            case 'pending':
                return <ClockCircleOutlined className="status-icon pending" />;
            default:
                return <ClockCircleOutlined className="status-icon" />;
        }
    };

    // Obtenir le texte du statut
    const getStatusText = (status) => {
        switch (status) {
            case 'completed':
                return 'Avis laissé';
            case 'pending':
                return 'En attente d\'avis';
            default:
                return 'Inconnu';
        }
    };

    // Formater la date
    const formatDate = (date) => {
        const now = new Date();
        const diff = now - date;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) {
            return "Aujourd'hui à " + date.toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit'
            });
        } else if (days === 1) {
            return "Hier à " + date.toLocaleTimeString('fr-FR', {
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

    // Supprimer un élément de l'historique
    const handleDelete = (id) => {
        if (window.confirm('Voulez-vous vraiment supprimer cet élément ?')) {
            setHistory(history.filter(item => item.id !== id));
        }
    };

    // Vider tout l'historique
    const handleClearAll = () => {
        if (window.confirm('Voulez-vous vraiment vider tout l\'historique ?')) {
            setHistory([]);
        }
    };

    return (
        <div className="history-page">
            {/* Header */}
            <div className="history-header">
                <button className="back-button" onClick={() => navigate(-1)}>
                    <ArrowLeftOutlined />
                </button>
                <h1>Historique</h1>
                <button
                    className="filter-button"
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
                        className={`filter-option ${filter === 'completed' ? 'active' : ''}`}
                        onClick={() => {
                            setFilter('completed');
                            setShowFilterMenu(false);
                        }}
                    >
                        Avec avis
                    </button>
                    <button
                        className={`filter-option ${filter === 'pending' ? 'active' : ''}`}
                        onClick={() => {
                            setFilter('pending');
                            setShowFilterMenu(false);
                        }}
                    >
                        Sans avis
                    </button>
                </div>
            )}

            {/* Contenu */}
            <div className="history-content">
                {loading ? (
                    <div className="loading-container">
                        <SyncOutlined spin style={{ fontSize: '48px', color: '#666' }} />
                        <p>Chargement de l'historique...</p>
                    </div>
                ) : filteredHistory.length === 0 ? (
                    <div className="empty-state">
                        <ClockCircleOutlined style={{ fontSize: '64px', color: '#ccc' }} />
                        <h3>Aucun historique</h3>
                        <p>
                            {filter === 'all'
                                ? "Vous n'avez pas encore d'activité"
                                : `Aucune activité avec le statut "${getStatusText(filter)}"`
                            }
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="history-list">
                            {filteredHistory.map((item) => (
                                <div key={item.id} className="history-item">
                                    <div className="item-icon">
                                        {getStatusIcon(item.status)}
                                    </div>
                                    <div className="item-content">
                                        <h3>{item.title}</h3>
                                        <p>{item.description}</p>
                                        <span className="item-date">
                                            {formatDate(item.date)}
                                        </span>
                                    </div>
                                    <button
                                        className="delete-button"
                                        onClick={() => handleDelete(item.id)}
                                    >
                                        <DeleteOutlined />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Bouton vider l'historique */}
                        {history.length > 0 && (
                            <button
                                className="clear-all-button"
                                onClick={handleClearAll}
                            >
                                Vider l'historique
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default History;