import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Utils/AuthContext';
import {
    ArrowLeftOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    SyncOutlined,
    DeleteOutlined,
    FilterOutlined,
} from '@ant-design/icons';


const History = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, completed, cancelled, pending
    const [showFilterMenu, setShowFilterMenu] = useState(false);

    // Simuler le chargement de l'historique
    // TODO: Remplacer par un vrai appel API
    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true);

            // Données de test - À remplacer par un appel API
            const mockHistory = [
                {
                    id: 1,
                    type: 'reservation',
                    title: 'Réservation acceptée',
                    description: 'Coiffeur - Salon de beauté Paris',
                    date: new Date('2024-11-20T14:30:00'),
                    status: 'completed',
                },
                {
                    id: 2,
                    type: 'reservation',
                    title: 'Réservation en attente',
                    description: 'Restaurant - Le Petit Bistro',
                    date: new Date('2024-11-21T19:00:00'),
                    status: 'pending',
                },
                {
                    id: 3,
                    type: 'reservation',
                    title: 'Réservation annulée',
                    description: 'Spa - Détente & Bien-être',
                    date: new Date('2024-11-18T16:00:00'),
                    status: 'cancelled',
                },
                {
                    id: 4,
                    type: 'scan',
                    title: 'QR Code scanné',
                    description: 'Boulangerie Artisanale',
                    date: new Date('2024-11-15T09:00:00'),
                    status: 'completed',
                },
                {
                    id: 5,
                    type: 'reservation',
                    title: 'Réservation terminée',
                    description: 'Garage Auto - Révision complète',
                    date: new Date('2024-11-10T11:00:00'),
                    status: 'completed',
                },
            ];

            // Simuler un délai de chargement
            setTimeout(() => {
                setHistory(mockHistory);
                setLoading(false);
            }, 800);
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
            case 'cancelled':
                return <CloseCircleOutlined className="status-icon cancelled" />;
            case 'pending':
                return <SyncOutlined className="status-icon pending" spin />;
            default:
                return <ClockCircleOutlined className="status-icon" />;
        }
    };

    // Obtenir le texte du statut
    const getStatusText = (status) => {
        switch (status) {
            case 'completed':
                return 'Terminé';
            case 'cancelled':
                return 'Annulé';
            case 'pending':
                return 'En attente';
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
                        Terminé
                    </button>
                    <button
                        className={`filter-option ${filter === 'pending' ? 'active' : ''}`}
                        onClick={() => {
                            setFilter('pending');
                            setShowFilterMenu(false);
                        }}
                    >
                        En attente
                    </button>
                    <button
                        className={`filter-option ${filter === 'cancelled' ? 'active' : ''}`}
                        onClick={() => {
                            setFilter('cancelled');
                            setShowFilterMenu(false);
                        }}
                    >
                        Annulé
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