import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined, ArrowRightOutlined, CloseOutlined } from '@ant-design/icons';
import { IoFilterSharp } from 'react-icons/io5';
import PrestataireService from '../../Services/Prestataire.services';
import FiltreService from '../../Services/Filtre.services';

import modeIcon from '../../Assets/Images/iconeCategories/mode.png';
import restaurantsIcon from '../../Assets/Images/iconeCategories/restaurants.png';
import hotelsIcon from '../../Assets/Images/iconeCategories/hotels.png';
import beauteSpaIcon from '../../Assets/Images/iconeCategories/beaute-spa.png';
import voyageIcon from '../../Assets/Images/iconeCategories/voyage.png';
import sportFitnessIcon from '../../Assets/Images/iconeCategories/sport-fitness.png';
import highTechIcon from '../../Assets/Images/iconeCategories/high-tech.png';
import enfantsIcon from '../../Assets/Images/iconeCategories/enfants.png';
import maisonIcon from '../../Assets/Images/iconeCategories/maison.png';
import loisirIcon from '../../Assets/Images/iconeCategories/loisir.png';

const categoryIcons = {
    'mode.png': modeIcon,
    'restaurants.png': restaurantsIcon,
    'hotels.png': hotelsIcon,
    'beaute-spa.png': beauteSpaIcon,
    'voyage.png': voyageIcon,
    'sport-fitness.png': sportFitnessIcon,
    'high-tech.png': highTechIcon,
    'enfants.png': enfantsIcon,
    'maison.png': maisonIcon,
    'loisir.png': loisirIcon,
};

const Prestataires = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const ville = searchParams.get('ville');
    const categoryId = searchParams.get('categoryId');

    const [prestataires, setPrestataires] = useState([]);
    const [filteredPrestataires, setFilteredPrestataires] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState(0);
    const [categoryName, setCategoryName] = useState('');
    const sliderRef = useRef(null);
    const lastWheelTime = useRef(0);

    // Pour différencier clic et drag
    const dragStartPos = useRef({ x: 0, y: 0 });
    const hasDragged = useRef(false);

    // États pour les filtres
    const [showFilters, setShowFilters] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState([]);
    const [availableFilters, setAvailableFilters] = useState([]);
    const [loadingFilters, setLoadingFilters] = useState(false);

    // Charger les filtres depuis le backend
    useEffect(() => {
        const fetchFilters = async () => {
            if (!categoryId) return;

            setLoadingFilters(true);
            try {
                const result = await FiltreService.getByCategory(categoryId);
                if (result.success) {
                    setAvailableFilters(result.data || []);
                }
            } catch (error) {
                console.error('Erreur chargement filtres:', error);
            } finally {
                setLoadingFilters(false);
            }
        };

        fetchFilters();
    }, [categoryId]);

    // Charger les prestataires
    const fetchPrestataires = async (filtreIds = []) => {
        setLoading(true);
        try {
            const result = await PrestataireService.getByVille(ville, categoryId, filtreIds);

            if (result.success) {
                const prests = Array.isArray(result.data) ? result.data : (result.data.prestataires || []);
                const shuffled = [...prests].sort(() => Math.random() - 0.5);
                setPrestataires(shuffled);
                setFilteredPrestataires(shuffled);

                if (shuffled.length > 0 && shuffled[0].category) {
                    setCategoryName(shuffled[0].category.nom);
                }
            }
        } catch (error) {
            console.error('Erreur chargement prestataires:', error);
        } finally {
            setLoading(false);
        }
    };

    // Charger les prestataires au montage
    useEffect(() => {
        if (ville && categoryId) {
            fetchPrestataires();
        }
    }, [ville, categoryId]);

    // Recharger quand les filtres changent (après avoir cliqué sur "Appliquer")
    const applyFilters = async () => {
        setShowFilters(false);
        setCurrentIndex(0);
        await fetchPrestataires(selectedFilters);
    };

    const handleBack = () => {
        navigate(`/auth/categories?ville=${encodeURIComponent(ville)}`);
    };

    const handleNext = () => {
        if (currentIndex < filteredPrestataires.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const handleTouchStart = (e) => {
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;

        setTouchStart(clientY);
        setIsDragging(true);
        setDragOffset(0);

        // Sauvegarder la position de départ pour détecter si c'est un clic ou un drag
        dragStartPos.current = { x: clientX, y: clientY };
        hasDragged.current = false;
    };

    const handleTouchMove = (e) => {
        if (!isDragging) return;

        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const diff = clientY - touchStart;

        // Détecter si on a bougé suffisamment pour considérer que c'est un drag
        const moveDistance = Math.sqrt(
            Math.pow(clientX - dragStartPos.current.x, 2) +
            Math.pow(clientY - dragStartPos.current.y, 2)
        );
        if (moveDistance > 10) {
            hasDragged.current = true;
        }

        const maxDrag = 300;
        let limitedDiff = Math.max(-maxDrag, Math.min(maxDrag, diff));

        if (currentIndex === 0 && limitedDiff > 0) {
            limitedDiff = limitedDiff * 0.3;
        }

        if (currentIndex === filteredPrestataires.length - 1 && limitedDiff < 0) {
            limitedDiff = limitedDiff * 0.3;
        }

        setDragOffset(limitedDiff);
        setTouchEnd(clientY);
    };

    const handleTouchEnd = () => {
        if (!isDragging) return;

        setIsDragging(false);
        const threshold = 50;

        if (Math.abs(dragOffset) > threshold) {
            if (dragOffset < 0 && currentIndex < filteredPrestataires.length - 1) {
                handleNext();
            } else if (dragOffset > 0 && currentIndex > 0) {
                handlePrevious();
            }
        }

        setDragOffset(0);
        setTouchStart(0);
        setTouchEnd(0);
    };

    const handleMouseDown = (e) => {
        handleTouchStart(e);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        handleTouchMove(e);
    };

    const handleMouseUp = () => {
        handleTouchEnd();
    };

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        } else {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, touchStart]);

    const handleWheel = (e) => {
        e.preventDefault();

        const now = Date.now();
        if (now - lastWheelTime.current < 500) return;

        lastWheelTime.current = now;

        if (e.deltaY > 0) {
            handleNext();
        } else {
            handlePrevious();
        }
    };

    // Navigation vers la fiche prestataire
    const handlePrestataireClick = (id) => {
        // Ne pas naviguer si on a fait un drag
        if (hasDragged.current) {
            return;
        }
        navigate(`/auth/prestataire/${id}`);
    };

    // Toggle un filtre
    const toggleFilter = (filterId) => {
        setSelectedFilters(prev => {
            if (prev.includes(filterId)) {
                return prev.filter(id => id !== filterId);
            } else {
                return [...prev, filterId];
            }
        });
    };

    // Réinitialiser les filtres
    const resetFilters = async () => {
        setSelectedFilters([]);
        setShowFilters(false);
        setCurrentIndex(0);
        await fetchPrestataires([]);
    };

    // Vérifier si un prestataire a des promotions actives
    const hasActivePromotion = (prestataire) => {
        if (!prestataire.promotions || prestataire.promotions.length === 0) return false;

        const now = new Date();
        return prestataire.promotions.some(promo => {
            const dateDebut = new Date(promo.dateDebut);
            const dateFin = new Date(promo.dateFin);
            const isValid = promo.estActive && dateDebut <= now && dateFin >= now;

            // Vérifier aussi la limite d'utilisations
            if (promo.limiteUtilisations !== null && promo.nombreUtilisations >= promo.limiteUtilisations) {
                return false;
            }

            return isValid;
        });
    };

    // Récupérer la première promotion active
    const getActivePromotion = (prestataire) => {
        if (!prestataire.promotions || prestataire.promotions.length === 0) return null;

        const now = new Date();
        return prestataire.promotions.find(promo => {
            const dateDebut = new Date(promo.dateDebut);
            const dateFin = new Date(promo.dateFin);
            const isValid = promo.estActive && dateDebut <= now && dateFin >= now;

            if (promo.limiteUtilisations !== null && promo.nombreUtilisations >= promo.limiteUtilisations) {
                return false;
            }

            return isValid;
        });
    };

    const getCardStyle = (index) => {
        const offset = index - currentIndex;

        if (offset < -1) return { display: 'none' };
        if (offset > 1) return { display: 'none' };

        let translateY = 0;
        let translateX = 0;
        let rotateZ = 0;
        let opacity = 1;
        let scale = 1;

        const curveIntensity = 10;

        if (offset === -1) {
            translateY = -60;
            translateX = -curveIntensity;
            rotateZ = 2;
            opacity = 1;
        } else if (offset === 0) {
            translateY = 0;
            translateX = 0;
            rotateZ = 0;
            opacity = 1;

            if (isDragging && dragOffset !== 0) {
                translateY = dragOffset;
                const normalizedY = dragOffset / 100;
                translateX = curveIntensity * Math.pow(normalizedY, 2) - curveIntensity * Math.abs(normalizedY);
                rotateZ = (dragOffset / 100) * -2;
            }
        } else if (offset === 1) {
            translateY = 60;
            translateX = -curveIntensity;
            rotateZ = -2;
            opacity = 1;
        }

        return {
            transform: `translateX(${translateX}px) translateY(${translateY}px) scale(${scale}) rotate(${rotateZ}deg)`,
            opacity: opacity,
            zIndex: offset === 0 ? 100 : (offset === -1 ? 99 : 98),
            pointerEvents: offset === 0 ? 'auto' : 'none',
            cursor: offset === 0 ? 'pointer' : 'default',
            transition: isDragging && offset === 0 ? 'none' : 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
        };
    };

    if (loading) {
        return (
            <div className="prestataires-page">
                <div className="prestataires-loading">
                    <div className="loader-spinner" />
                    <p>Chargement des prestataires...</p>
                </div>
            </div>
        );
    }

    if (filteredPrestataires.length === 0) {
        return (
            <div className="prestataires-page">
                <div className="prestataires-header">
                    <button className="header-btn back-btn" onClick={handleBack}>
                        <ArrowLeftOutlined />
                    </button>
                    <button className="header-btn filter-btn" onClick={() => setShowFilters(true)}>
                        <IoFilterSharp />
                        {selectedFilters.length > 0 && (
                            <span className="filter-badge">{selectedFilters.length}</span>
                        )}
                    </button>
                </div>
                <div className="prestataires-empty">
                    <p>Aucun prestataire disponible avec ces filtres</p>
                    {selectedFilters.length > 0 && (
                        <button className="reset-filters-btn" onClick={resetFilters}>
                            Réinitialiser les filtres
                        </button>
                    )}
                </div>

                {/* Modal des filtres */}
                {showFilters && (
                    <div className="filters-overlay" onClick={() => setShowFilters(false)}>
                        <div className="filters-modal" onClick={(e) => e.stopPropagation()}>
                            <div className="filters-modal-header">
                                <h2>Filtres</h2>
                                <button className="close-modal-btn" onClick={() => setShowFilters(false)}>
                                    <CloseOutlined />
                                </button>
                            </div>

                            <div className="filters-category-name">
                                {categoryName}
                            </div>

                            <div className="filters-list">
                                {loadingFilters ? (
                                    <p>Chargement des filtres...</p>
                                ) : availableFilters.length === 0 ? (
                                    <p>Aucun filtre disponible</p>
                                ) : (
                                    availableFilters.map((filter) => (
                                        <button
                                            key={filter.id}
                                            className={`filter-chip ${selectedFilters.includes(filter.id) ? 'active' : ''}`}
                                            onClick={() => toggleFilter(filter.id)}
                                        >
                                            {filter.icon && <span className="filter-icon">{filter.icon}</span>}
                                            {filter.nom}
                                        </button>
                                    ))
                                )}
                            </div>

                            <div className="filters-modal-footer">
                                <button className="reset-btn" onClick={resetFilters}>
                                    Réinitialiser
                                </button>
                                <button className="apply-btn" onClick={applyFilters}>
                                    Appliquer {selectedFilters.length > 0 && `(${selectedFilters.length})`}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="prestataires-page">
            {/* Header avec bouton retour et filtres */}
            <div className="prestataires-header">
                <button className="header-btn back-btn" onClick={handleBack}>
                    <ArrowLeftOutlined />
                </button>
                <button className="header-btn filter-btn" onClick={() => setShowFilters(true)}>
                    <IoFilterSharp />
                    {selectedFilters.length > 0 && (
                        <span className="filter-badge">{selectedFilters.length}</span>
                    )}
                </button>
            </div>

            {/* Conteneur des cards */}
            <div
                className="cards-stack-container"
                ref={sliderRef}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleMouseDown}
                onWheel={handleWheel}
            >
                {filteredPrestataires.map((prestataire, index) => {
                    const activePromo = getActivePromotion(prestataire);

                    return (
                        <div
                            key={prestataire.id}
                            className="prestataire-card"
                            style={getCardStyle(index)}
                            onClick={() => {
                                if (index === currentIndex && !hasDragged.current) {
                                    handlePrestataireClick(prestataire.id);
                                }
                            }}
                        >
                            {/* Badge Promotion */}


                            <div className="category-icon">
                                <img
                                    src={categoryIcons[prestataire.category?.image]}
                                    alt={prestataire.category?.nom}
                                />
                            </div>

                            <button
                                className="go-to-prestataire"
                                onMouseDown={(e) => e.stopPropagation()}
                                onTouchStart={(e) => e.stopPropagation()}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/prestataire/${prestataire.id}`);
                                }}
                            >
                                <ArrowRightOutlined />
                            </button>

                            <div className="card-name">
                                <h2>{prestataire.nomCommerce}</h2>
                            </div>

                            <div
                                className="card-image"
                                style={{
                                    backgroundImage: `url(${prestataire.imagePrincipale || '/placeholder.jpg'})`
                                }}
                            >
                                {/* Badge Promo - en bas à droite de l'image */}
                                {activePromo && (
                                    <div className="promo-card-prestataires">
                                        <span className="promo-card-prestataires-icon"></span>
                                        <span className="promo-card-prestataires-text">{activePromo.titre}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Indicateur de position */}
            <div className="slider-indicator">
                {filteredPrestataires.map((_, index) => (
                    <div
                        key={index}
                        className={`indicator-dot ${index === currentIndex ? 'active' : ''}`}
                    />
                ))}
            </div>

            {/* Modal des filtres */}
            {showFilters && (
                <div className="filters-overlay" onClick={() => setShowFilters(false)}>
                    <div className="filters-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="filters-modal-header">
                            <h2>Filtres</h2>
                            <button className="close-modal-btn" onClick={() => setShowFilters(false)}>
                                <CloseOutlined />
                            </button>
                        </div>
                        <div className="filters-category-name">
                            {categoryName}
                        </div>

                        <div className="filters-list">
                            {loadingFilters ? (
                                <p>Chargement des filtres...</p>
                            ) : availableFilters.length === 0 ? (
                                <p>Aucun filtre disponible</p>
                            ) : (
                                availableFilters.map((filter) => (
                                    <button
                                        key={filter.id}
                                        className={`filter-chip ${selectedFilters.includes(filter.id) ? 'active' : ''}`}
                                        onClick={() => toggleFilter(filter.id)}
                                    >
                                        {filter.icon && <span className="filter-icon">{filter.icon}</span>}
                                        {filter.nom}
                                    </button>
                                ))
                            )}
                        </div>

                        <div className="filters-modal-footer">
                            <button className="reset-btn" onClick={resetFilters}>
                                Réinitialiser
                            </button>
                            <button className="apply-btn" onClick={applyFilters}>
                                Appliquer {selectedFilters.length > 0 && `(${selectedFilters.length})`}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Prestataires;