import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { IonIcon } from '@ionic/react';
import { SyncOutlined, ArrowLeftOutlined, SearchOutlined } from '@ant-design/icons';
import {
    heartOutline,
    heart,
    starOutline,
    star,
    locationOutline,
    trashOutline,
    storefrontOutline,
    searchOutline,
    gridOutline,
    listOutline,
    funnelOutline,
    ticketOutline,
    chevronDownOutline,
    closeOutline,
    navigateOutline
} from 'ionicons/icons';
import FavorisService from '../../Services/Favoris.services';

const Favoris = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const previousPath = location.state?.previousPath || '/auth/maps';

    const [favoris, setFavoris] = useState([]);
    const [filteredFavoris, setFilteredFavoris] = useState([]);
    const [loading, setLoading] = useState(true);
    const [removing, setRemoving] = useState(null);

    // Filtres et affichage
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('list'); // 'list' ou 'grid'
    const [sortBy, setSortBy] = useState('recent'); // 'recent', 'name', 'rating', 'promos'
    const [showSortMenu, setShowSortMenu] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('all');

    useEffect(() => {
        loadFavoris();
    }, []);

    // Filtrer et trier les favoris
    useEffect(() => {
        let result = [...favoris];

        // Filtre par recherche
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(f =>
                f.nomCommerce?.toLowerCase().includes(query) ||
                f.ville?.toLowerCase().includes(query) ||
                f.typeCommerce?.toLowerCase().includes(query) ||
                f.category?.nom?.toLowerCase().includes(query)
            );
        }

        // Filtre par catégorie
        if (selectedCategory !== 'all') {
            result = result.filter(f => f.category?.id === selectedCategory);
        }

        // Tri
        switch (sortBy) {
            case 'name':
                result.sort((a, b) => (a.nomCommerce || '').localeCompare(b.nomCommerce || ''));
                break;
            case 'rating':
                result.sort((a, b) => (b.noteGlobale || 0) - (a.noteGlobale || 0));
                break;
            case 'promos':
                result.sort((a, b) => (b.promotionsActives || 0) - (a.promotionsActives || 0));
                break;
            case 'recent':
            default:
                // Garder l'ordre d'ajout (par défaut)
                break;
        }

        setFilteredFavoris(result);
    }, [favoris, searchQuery, sortBy, selectedCategory]);

    const loadFavoris = async () => {
        setLoading(true);
        try {
            const response = await FavorisService.getAll();
            if (response.success) {
                setFavoris(response.data || []);
            }
        } catch (error) {
            console.error('Erreur chargement favoris:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFavori = async (e, prestataireId) => {
        e.stopPropagation();
        setRemoving(prestataireId);

        try {
            const response = await FavorisService.removeFavori(prestataireId);
            if (response.success) {
                setTimeout(() => {
                    setFavoris(prev => prev.filter(f => f.id !== prestataireId));
                    setRemoving(null);
                }, 300);
            } else {
                setRemoving(null);
            }
        } catch (error) {
            console.error('Erreur suppression favori:', error);
            setRemoving(null);
        }
    };

    const handleGoToFiche = (prestataireId) => {
        navigate(`/prestataire/${prestataireId}`);
    };

    const handleExplorer = () => {
        navigate('/recherche');
    };

    const handleGoBack = () => {
        navigate(previousPath, { state: { openDrawer: true } });
    };

    // Extraire les catégories uniques
    const categories = [...new Map(
        favoris
            .filter(f => f.category)
            .map(f => [f.category.id, f.category])
    ).values()];

    // Stats
    const stats = {
        total: favoris.length,
        withPromos: favoris.filter(f => f.promotionsActives > 0).length,
        avgRating: favoris.length > 0
            ? (favoris.reduce((acc, f) => acc + (f.noteGlobale || 0), 0) / favoris.length).toFixed(1)
            : 0,
        cities: [...new Set(favoris.map(f => f.ville).filter(Boolean))].length
    };

    const sortOptions = [
        { value: 'recent', label: 'Plus récents' },
        { value: 'name', label: 'Nom A-Z' },
        { value: 'rating', label: 'Mieux notés' },
        { value: 'promos', label: 'Avec promos' }
    ];

    // Render étoiles
    const renderStars = (note) => {
        const stars = [];
        const rating = Math.round(note || 0);
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <IonIcon
                    key={i}
                    icon={i <= rating ? star : starOutline}
                    className={i <= rating ? 'star-filled' : 'star-empty'}
                />
            );
        }
        return stars;
    };

    return (
        <div className="favoris-page">
            {/* Header */}
            <div className="favoris-header">
                <button className="favoris-back-btn" onClick={handleGoBack}>
                    <ArrowLeftOutlined />
                </button>
                <h1 className="favoris-title">Mes Favoris</h1>
                <button
                    className={`favoris-view-toggle ${viewMode === 'grid' ? 'active' : ''}`}
                    onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
                >
                    <IonIcon icon={viewMode === 'list' ? gridOutline : listOutline} />
                </button>
            </div>

            {/* Contenu */}
            {loading ? (
                <div className="favoris-loading">
                    <SyncOutlined spin style={{ fontSize: '40px', color: '#fe7e4f' }} />
                    <p>Chargement de vos favoris...</p>
                </div>
            ) : favoris.length === 0 ? (
                <div className="favoris-empty">
                    <div className="favoris-empty-icon">
                        <IonIcon icon={heartOutline} />
                    </div>
                    <h3>Aucun favori</h3>
                    <p>Explorez les commerces et ajoutez vos préférés ici pour les retrouver facilement.</p>
                    <button className="favoris-explore-btn" onClick={handleExplorer}>
                        <IonIcon icon={searchOutline} />
                        Explorer les commerces
                    </button>
                </div>
            ) : (
                <>
                    {/* Stats Cards */}
                    <div className="favoris-stats">
                        <div className="favoris-stat-mini">
                            <div className="favoris-stat-icon">
                                <IonIcon icon={heart} />
                            </div>
                            <div className="favoris-stat-info">
                                <span className="favoris-stat-value">{stats.total}</span>
                                <span className="favoris-stat-label">Favoris</span>
                            </div>
                        </div>
                        <div className="favoris-stat-mini">
                            <div className="favoris-stat-icon promos">
                                <IonIcon icon={ticketOutline} />
                            </div>
                            <div className="favoris-stat-info">
                                <span className="favoris-stat-value">{stats.withPromos}</span>
                                <span className="favoris-stat-label">Avec promos</span>
                            </div>
                        </div>
                        <div className="favoris-stat-mini">
                            <div className="favoris-stat-icon rating">
                                <IonIcon icon={star} />
                            </div>
                            <div className="favoris-stat-info">
                                <span className="favoris-stat-value">{stats.avgRating}</span>
                                <span className="favoris-stat-label">Note moy.</span>
                            </div>
                        </div>
                        <div className="favoris-stat-mini">
                            <div className="favoris-stat-icon cities">
                                <IonIcon icon={locationOutline} />
                            </div>
                            <div className="favoris-stat-info">
                                <span className="favoris-stat-value">{stats.cities}</span>
                                <span className="favoris-stat-label">Villes</span>
                            </div>
                        </div>
                    </div>

                    {/* Barre de recherche */}
                    <div className="favoris-search">
                        <SearchOutlined className="favoris-search-icon" />
                        <input
                            type="text"
                            placeholder="Rechercher dans mes favoris..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button className="favoris-clear-search" onClick={() => setSearchQuery('')}>
                                <IonIcon icon={closeOutline} />
                            </button>
                        )}
                    </div>

                    {/* Filtres catégories */}
                    <div className="favoris-filters">
                        <div className="favoris-categories">
                            <button
                                className={`favoris-category-chip ${selectedCategory === 'all' ? 'active' : ''}`}
                                onClick={() => setSelectedCategory('all')}
                            >
                                Tous
                            </button>
                            {categories.map(cat => (
                                <button
                                    key={cat.id}
                                    className={`favoris-category-chip ${selectedCategory === cat.id ? 'active' : ''}`}
                                    onClick={() => setSelectedCategory(cat.id)}
                                >
                                    {cat.nom}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Résultats + Tri */}
                    <div className="favoris-results-row">
                        <span className="favoris-results-count">
                            {filteredFavoris.length} résultat{filteredFavoris.length > 1 ? 's' : ''}
                            {searchQuery && ` pour "${searchQuery}"`}
                        </span>

                        {/* Tri */}
                        <div className="favoris-sort-dropdown">
                            <button
                                className="favoris-sort-trigger"
                                onClick={() => setShowSortMenu(!showSortMenu)}
                            >
                                <IonIcon icon={funnelOutline} />
                                <IonIcon icon={chevronDownOutline} className={showSortMenu ? 'rotated' : ''} />
                            </button>
                            {showSortMenu && (
                                <>
                                    <div className="favoris-sort-backdrop" onClick={() => setShowSortMenu(false)} />
                                    <div className="favoris-sort-menu">
                                        {sortOptions.map(option => (
                                            <button
                                                key={option.value}
                                                className={`favoris-sort-option ${sortBy === option.value ? 'active' : ''}`}
                                                onClick={() => {
                                                    setSortBy(option.value);
                                                    setShowSortMenu(false);
                                                }}
                                            >
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Liste des favoris */}
                    {filteredFavoris.length === 0 ? (
                        <div className="favoris-no-results">
                            <IonIcon icon={searchOutline} />
                            <p>Aucun favori ne correspond à votre recherche</p>
                            <button onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}>
                                Réinitialiser les filtres
                            </button>
                        </div>
                    ) : (
                        <div className={`favoris-list ${viewMode}`}>
                            {filteredFavoris.map(commerce => (
                                <div
                                    key={commerce.id}
                                    className={`favori-card ${viewMode} ${removing === commerce.id ? 'removing' : ''}`}
                                    onClick={() => handleGoToFiche(commerce.id)}
                                >
                                    {/* Image */}
                                    <div className="favori-image">
                                        {commerce.imagePrincipale ? (
                                            <img src={commerce.imagePrincipale} alt={commerce.nomCommerce} />
                                        ) : (
                                            <div className="image-placeholder">
                                                <IonIcon icon={storefrontOutline} />
                                            </div>
                                        )}

                                        {/* Badge promo */}
                                        {commerce.promotionsActives > 0 && (
                                            <div className="favoris-promo-badge">
                                                <IonIcon icon={ticketOutline} />
                                                <span>{commerce.promotionsActives} promo{commerce.promotionsActives > 1 ? 's' : ''}</span>
                                            </div>
                                        )}

                                        {/* Bouton favori (coeur) */}
                                        <button
                                            className="favori-heart-btn"
                                            onClick={(e) => handleRemoveFavori(e, commerce.id)}
                                        >
                                            <IonIcon icon={heart} />
                                        </button>
                                    </div>

                                    {/* Infos */}
                                    <div className="favori-content">
                                        <div className="favori-top">
                                            <h3 className="favori-name">{commerce.nomCommerce}</h3>
                                            {commerce.noteGlobale > 0 && (
                                                <div className="favori-rating-badge">
                                                    <IonIcon icon={star} />
                                                    <span>{parseFloat(commerce.noteGlobale).toFixed(1)}</span>
                                                </div>
                                            )}
                                        </div>

                                        <p className="favori-type">
                                            {commerce.category?.nom || commerce.typeCommerce}
                                        </p>

                                        <div className="favori-meta">
                                            <span className="favori-location">
                                                <IonIcon icon={locationOutline} />
                                                {commerce.ville}
                                            </span>
                                            {commerce.nombreAvis > 0 && (
                                                <span className="favori-reviews">
                                                    {commerce.nombreAvis} avis
                                                </span>
                                            )}
                                        </div>

                                        {/* Étoiles en mode grid */}
                                        {viewMode === 'grid' && commerce.noteGlobale > 0 && (
                                            <div className="favori-stars">
                                                {renderStars(commerce.noteGlobale)}
                                            </div>
                                        )}

                                        {/* Actions en mode list */}
                                        {viewMode === 'list' && (
                                            <div className="favori-actions">
                                                <button
                                                    className="action-btn navigate"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        window.open(`https://maps.google.com/?q=${commerce.adresse} ${commerce.ville}`, '_blank');
                                                    }}
                                                >
                                                    <IonIcon icon={navigateOutline} />
                                                    <span>Y aller</span>
                                                </button>

                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Bouton explorer plus */}
                    <div className="favoris-explore-more">
                        <button onClick={handleExplorer}>
                            <IonIcon icon={searchOutline} />
                            Découvrir plus de commerces
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Favoris;