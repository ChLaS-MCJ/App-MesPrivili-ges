import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IonIcon } from '@ionic/react';
import {
    arrowBack,
    heart,
    heartOutline,
    star,
    timeOutline,
    locationOutline,
    shareOutline,
    navigateOutline,
    calendarOutline,
    closeOutline,
    walkOutline,
    chevronBackOutline,
    chevronForwardOutline,
    giftOutline,
    ticketOutline,
    globeOutline,
    eyeOutline
} from 'ionicons/icons';
import PrestataireService from '../../Services/Prestataire.services';
import FavorisService from '../../Services/Favoris.services';
import PromotionService from '../../Services/Promotion.services';

const FichePrestataire = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Ref pour éviter le double appel de trackVisit (React StrictMode)
    const visitTracked = useRef(false);

    const [prestataire, setPrestataire] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);
    const [favoriteLoading, setFavoriteLoading] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [visitors, setVisitors] = useState([]);

    // État pour l'aperçu propriétaire
    const [isOwnerPreview, setIsOwnerPreview] = useState(false);
    const [needsActivation, setNeedsActivation] = useState(false);

    // Promotions
    const [promotions, setPromotions] = useState([]);
    const [showPromoModal, setShowPromoModal] = useState(false);
    const [selectedPromo, setSelectedPromo] = useState(null);

    // Géolocalisation et distance
    const [userLocation, setUserLocation] = useState(null);
    const [distance, setDistance] = useState(null);
    const [geolocEnabled, setGeolocEnabled] = useState(false);

    // Expand description et filtres
    const [descriptionExpanded, setDescriptionExpanded] = useState(false);
    const [filtresExpanded, setFiltresExpanded] = useState(false);

    // Modal horaires
    const [showHorairesModal, setShowHorairesModal] = useState(false);

    // Statut d'ouverture en temps réel
    const [openStatus, setOpenStatus] = useState({ status: null, closesIn: null });

    // ============================================
    // ENREGISTRER LA VISITE UNE SEULE FOIS
    // (seulement si ce n'est pas un aperçu propriétaire)
    // ============================================
    useEffect(() => {
        if (id && !visitTracked.current && !isOwnerPreview) {
            visitTracked.current = true;
            PrestataireService.trackVisit(id);
        }
    }, [id, isOwnerPreview]);

    // Charger les promotions
    useEffect(() => {
        const fetchPromotions = async () => {
            if (!id) return;

            const result = await PromotionService.getByPrestataireId(id);
            if (result.success) {
                setPromotions(result.data || []);
            }
        };

        fetchPromotions();
    }, [id]);

    // Récupérer la géolocalisation de l'utilisateur
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                    setGeolocEnabled(true);
                },
                (error) => {
                    setGeolocEnabled(false);
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
            );
        }
    }, []);

    // Charger les visiteurs
    useEffect(() => {
        const fetchVisitors = async () => {
            if (!id) return;

            const result = await PrestataireService.getRecentVisitors(id, 5);
            if (result.success) {
                setVisitors(result.data);
            }
        };

        fetchVisitors();
    }, [id]);

    // Calculer la distance quand on a la position de l'utilisateur et du prestataire
    useEffect(() => {
        if (userLocation && prestataire?.latitude && prestataire?.longitude) {
            const dist = calculerDistance(
                userLocation.latitude,
                userLocation.longitude,
                parseFloat(prestataire.latitude),
                parseFloat(prestataire.longitude)
            );
            setDistance(dist);
        }
    }, [userLocation, prestataire]);

    // Formule de Haversine pour calculer la distance
    const calculerDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;

        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) *
            Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;

        return Math.round(distance * 100) / 100;
    };

    // Formater la distance pour l'affichage
    const formatDistance = (dist) => {
        if (dist < 1) {
            return `${Math.round(dist * 1000)} m`;
        }
        return `${dist.toFixed(1)} km`;
    };

    // Fonction pour vérifier le statut d'ouverture
    const checkOpenStatus = () => {
        if (!prestataire?.horaires) return { status: null, closesIn: null };

        let horairesData = prestataire.horaires;
        if (typeof prestataire.horaires === 'string') {
            try {
                horairesData = JSON.parse(prestataire.horaires);
            } catch (e) {
                return { status: null, closesIn: null };
            }
        }

        const now = new Date();
        const joursSemaine = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
        const jourActuel = joursSemaine[now.getDay()];
        const heureActuelle = now.getHours() * 60 + now.getMinutes();

        const horairesJour = horairesData[jourActuel];

        if (!horairesJour || !horairesJour.ouvert) {
            return { status: 'closed', closesIn: null };
        }

        const [debutH, debutM] = horairesJour.debut.split(':').map(Number);
        const [finH, finM] = horairesJour.fin.split(':').map(Number);

        const debutMinutes = debutH * 60 + debutM;
        const finMinutes = finH * 60 + finM;

        if (heureActuelle < debutMinutes) {
            return { status: 'closed', closesIn: null, opensAt: horairesJour.debut };
        }

        if (heureActuelle > finMinutes) {
            return { status: 'closed', closesIn: null };
        }

        const minutesRestantes = finMinutes - heureActuelle;

        if (minutesRestantes <= 45) {
            return { status: 'closing-soon', closesIn: minutesRestantes };
        }

        return { status: 'open', closesIn: minutesRestantes };
    };

    // useEffect pour mettre à jour le statut en temps réel
    useEffect(() => {
        if (!prestataire) return;

        setOpenStatus(checkOpenStatus());

        const interval = setInterval(() => {
            setOpenStatus(checkOpenStatus());
        }, 60000);

        return () => clearInterval(interval);
    }, [prestataire]);

    // Fonction pour afficher le statut
    const renderOpenStatus = () => {
        if (openStatus.status === null) {
            return <span className="status-unknown">Horaires non renseignés</span>;
        }
        if (openStatus.status === 'open') {
            return <span className="status-open">Ouvert</span>;
        }
        if (openStatus.status === 'closing-soon') {
            return (
                <span className="status-closing-soon">
                    Ferme bientôt ({openStatus.closesIn} min)
                </span>
            );
        }
        return <span className="status-closed">Fermé</span>;
    };

    useEffect(() => {
        const fetchPrestataire = async () => {
            setLoading(true);
            try {
                const result = await PrestataireService.getById(id);

                if (result.success) {
                    setPrestataire(result.data);

                    // Vérifier si c'est un aperçu propriétaire
                    if (result.isOwnerPreview || result.data?.isOwnerPreview) {
                        setIsOwnerPreview(true);
                        setNeedsActivation(result.data?.needsActivation || false);
                    }

                    // Ne pas charger les favoris si c'est un aperçu
                    if (!result.isOwnerPreview && !result.data?.isOwnerPreview) {
                        const favResult = await FavorisService.checkFavori(id);
                        if (favResult.success) {
                            setIsFavorite(favResult.data.isFavori);
                        }
                    }
                }
            } catch (error) {
                console.error('Erreur lors du chargement:', error);
            }
            setLoading(false);
        };

        if (id) {
            fetchPrestataire();
        }
    }, [id]);

    const handleBack = () => {
        navigate(-1);
    };

    // Aller à la page de gestion des abonnements
    const handleGoToAbonnement = () => {
        navigate('/auth/mon-commerce');
    };

    const getDisplayAvatars = () => {
        const avatars = [];
        const maxAvatars = 3;
        const baseUrl = 'https://cacao.mesprivileges.fr';

        visitors.forEach((visitor) => {
            if (avatars.length < maxAvatars) {
                let image = visitor.profileImage;

                if (image && !image.startsWith('http')) {
                    image = `${baseUrl}${image}`;
                }

                avatars.push({
                    id: visitor.id,
                    image: image || `https://i.pravatar.cc/100?u=real-${visitor.id}`,
                    isReal: true
                });
            }
        });

        const fakeSeeds = ['alpha', 'beta', 'gamma', 'delta', 'epsilon'];
        let fakeIndex = 0;

        while (avatars.length < maxAvatars) {
            const seed = `${prestataire?.id}-fake-${fakeSeeds[fakeIndex]}`;
            avatars.push({
                id: `fake-${fakeIndex}`,
                image: `https://i.pravatar.cc/100?u=${seed}`,
                isReal: false
            });
            fakeIndex++;
        }

        return avatars;
    };

    const toggleFavorite = async () => {
        if (favoriteLoading || isOwnerPreview) return;

        setFavoriteLoading(true);
        try {
            if (isFavorite) {
                const result = await FavorisService.removeFavori(id);
                if (result.success) {
                    setIsFavorite(false);
                }
            } else {
                const result = await FavorisService.addFavori(id);
                if (result.success) {
                    setIsFavorite(true);
                }
            }
        } catch (error) {
            console.error('Erreur toggle favori:', error);
        }
        setFavoriteLoading(false);
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: prestataire?.nomCommerce,
                    text: prestataire?.descriptionCourte,
                    url: window.location.href,
                });
            } catch (error) {
                // Erreur silencieuse
            }
        }
    };

    const handleNavigate = () => {
        if (prestataire?.latitude && prestataire?.longitude) {
            const url = `https://www.google.com/maps/dir/?api=1&destination=${prestataire.latitude},${prestataire.longitude}`;
            window.open(url, '_blank');
        }
    };

    const handleOpenWebsite = () => {
        if (prestataire?.website) {
            let url = prestataire.website;
            // Ajouter https:// si pas de protocole
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                url = 'https://' + url;
            }
            window.open(url, '_blank');
        }
    };

    const shouldTruncate = (text, maxLength = 100) => {
        return text && text.length > maxLength;
    };

    const truncateText = (text, maxLength = 100) => {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    const shouldTruncateFiltres = () => {
        return prestataire?.filtres && prestataire.filtres.length > 3;
    };

    const formatHoraires = (horaires) => {
        if (!horaires) return null;

        let horairesData = horaires;
        if (typeof horaires === 'string') {
            try {
                horairesData = JSON.parse(horaires);
            } catch (e) {
                console.error('Erreur parsing horaires:', e);
                return null;
            }
        }

        const jours = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
        const joursCapitalized = {
            lundi: 'Lundi',
            mardi: 'Mardi',
            mercredi: 'Mercredi',
            jeudi: 'Jeudi',
            vendredi: 'Vendredi',
            samedi: 'Samedi',
            dimanche: 'Dimanche'
        };

        return jours.map(jour => ({
            jour: joursCapitalized[jour],
            ouvert: horairesData[jour]?.ouvert ?? false,
            debut: horairesData[jour]?.debut ?? '09:00',
            fin: horairesData[jour]?.fin ?? '19:00'
        }));
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    };

    const getImages = () => {
        const allImages = [];

        if (prestataire?.imagePrincipale) {
            allImages.push(prestataire.imagePrincipale);
        }

        let secondaryImages = prestataire?.images || [];

        if (typeof secondaryImages === 'string') {
            try {
                secondaryImages = JSON.parse(secondaryImages);
                // Si c'est encore une string après parsing (double encodage)
                if (typeof secondaryImages === 'string') {
                    secondaryImages = JSON.parse(secondaryImages);
                }
            } catch (e) {
                console.error('Erreur parsing images:', e);
                secondaryImages = [];
            }
        }

        if (Array.isArray(secondaryImages)) {
            secondaryImages.forEach(img => {
                if (img && img !== prestataire?.imagePrincipale) {
                    allImages.push(img);
                }
            });
        }

        if (allImages.length === 0) {
            allImages.push('https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80');
        }

        return allImages;
    };

    const nextImage = (e) => {
        e.stopPropagation();
        const images = getImages();
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = (e) => {
        e.stopPropagation();
        const images = getImages();
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    // Gestion du swipe tactile
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);

    const minSwipeDistance = 50;

    const onTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        const images = getImages();
        if (images.length > 1) {
            if (isLeftSwipe) {
                setCurrentImageIndex((prev) => (prev + 1) % images.length);
            }
            if (isRightSwipe) {
                setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
            }
        }
    };

    // Ouvrir le modal de détail promo
    const openPromoDetail = (promo) => {
        setSelectedPromo(promo);
        setShowPromoModal(true);
    };

    if (loading) {
        return (
            <div className="fiche-prestataire-page">
                <div className="fiche-loading">
                    <div className="loader-spinner"></div>
                    <p>Chargement...</p>
                </div>
            </div>
        );
    }

    if (!prestataire) {
        return (
            <div className="fiche-prestataire-page">
                <div className="fiche-error">
                    <p>Prestataire non trouvé</p>
                    <button onClick={handleBack} className="back-btn-error">
                        Retour
                    </button>
                </div>
            </div>
        );
    }

    const images = getImages();
    const horairesFormatted = formatHoraires(prestataire.horaires);

    return (
        <div className="fiche-prestataire-page">
            {/* Bandeau Aperçu Propriétaire */}
            {isOwnerPreview && (
                <div className="owner-preview-banner">
                    <div className="owner-preview-content">
                        <IonIcon icon={eyeOutline} className="owner-preview-icon" />
                        <div className="owner-preview-text">
                            <strong>Aperçu propriétaire</strong>
                            <span>Cette fiche n'est pas visible publiquement</span>
                        </div>
                    </div>
                    {needsActivation && (
                        <button className="owner-preview-btn" onClick={handleGoToAbonnement}>
                            Activer ma fiche
                        </button>
                    )}
                </div>
            )}

            {/* Image de fond en plein écran avec gestion du swipe */}
            <div
                className={`fiche-hero-image ${isOwnerPreview ? 'with-preview-banner' : ''}`}
                style={{ backgroundImage: `url(${images[currentImageIndex]})` }}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
                {/* Header flottant */}
                <div className="fiche-header">
                    <button className="fiche-header-btn" onClick={handleBack}>
                        <IonIcon icon={arrowBack} />
                    </button>
                    <div className="fiche-header-actions">
                        <button className="fiche-header-btn" onClick={handleShare}>
                            <IonIcon icon={shareOutline} />
                        </button>
                        {!isOwnerPreview && (
                            <button
                                className={`fiche-header-btn ${isFavorite ? 'favorite-active' : ''} ${favoriteLoading ? 'loading' : ''}`}
                                onClick={toggleFavorite}
                                disabled={favoriteLoading}
                            >
                                <IonIcon icon={isFavorite ? heart : heartOutline} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Flèches de navigation - toujours visibles si plus d'une image */}
                {images.length > 1 && (
                    <div className="fiche-nav-arrows">
                        <button className="fiche-nav-arrow fiche-nav-prev" onClick={prevImage}>
                            <IonIcon icon={chevronBackOutline} />
                        </button>
                        <button className="fiche-nav-arrow fiche-nav-next" onClick={nextImage}>
                            <IonIcon icon={chevronForwardOutline} />
                        </button>
                    </div>
                )}

                {/* Tab latéral promo discret */}
                {promotions.length > 0 && (
                    <div
                        className="fiche-promo-side-tab"
                        onClick={() => openPromoDetail(promotions[0])}
                    >
                        <span className="fiche-promo-side-dot"></span>
                        <IonIcon icon={giftOutline} className="fiche-promo-side-tab-icon" />
                        <span className="fiche-promo-side-tab-text">{promotions[0].etiquette || 'PROMO'}</span>
                    </div>
                )}

            </div>

            {/* Contenu en bas - Card glassmorphism */}
            <div className="fiche-content">
                <div className="fiche-content-inner">
                    {/* Titre et note */}
                    <div className="fiche-title-row">
                        <h1 className="fiche-title">{prestataire.nomCommerce}</h1>
                        <div className="fiche-meta-item">
                            <IonIcon icon={timeOutline} />
                            {renderOpenStatus()}
                        </div>
                        <div className="fiche-rating">
                            <IonIcon icon={star} className="star-icon" />
                            <span>{prestataire.noteGlobale}</span>
                        </div>
                    </div>

                    {/* Localisation et statut */}
                    <div className="fiche-meta-row">
                        <div className="fiche-meta-item">
                            <IonIcon icon={locationOutline} />
                            <span>{prestataire.adresse}, {prestataire.ville}{prestataire.codePostal ? ` ${prestataire.codePostal}` : ''}</span>
                        </div>

                        {/* Distance - affiché seulement si géoloc activée */}
                        {geolocEnabled && distance !== null && (
                            <div className="fiche-meta-item">
                                <IonIcon icon={walkOutline} />
                                <span>{formatDistance(distance)} (à vol d'oiseau)</span>
                            </div>
                        )}
                    </div>

                    {/* Avatars + nombre de visites */}
                    <div className="fiche-visitors">
                        <div className="visitor-avatars">
                            {getDisplayAvatars().map((avatar, index) => (
                                <div
                                    key={avatar.id}
                                    className="avatar"
                                    style={{ backgroundImage: `url(${avatar.image})` }}
                                />
                            ))}
                        </div>
                        <span className="visitor-count">
                            {prestataire.nombreVisitesFiche || 0}+ personnes ont visité
                        </span>
                    </div>

                    {/* Description avec expand */}
                    <div
                        className={`fiche-description-wrapper ${descriptionExpanded ? 'expanded' : ''}`}
                        onClick={() => shouldTruncate(prestataire.descriptionCourte) && setDescriptionExpanded(!descriptionExpanded)}
                    >
                        <p className="fiche-description">
                            {descriptionExpanded
                                ? (prestataire.descriptionCourte || 'Découvrez ce lieu unique et profitez d\'une expérience exceptionnelle.')
                                : truncateText(prestataire.descriptionCourte || 'Découvrez ce lieu unique et profitez d\'une expérience exceptionnelle.', 100)
                            }
                        </p>
                    </div>

                    {/* Filtres/Tags du prestataire avec expand */}
                    {prestataire.filtres && prestataire.filtres.length > 0 && (
                        <div
                            className={`fiche-tags-wrapper ${filtresExpanded ? 'expanded' : ''}`}
                            onClick={() => shouldTruncateFiltres() && setFiltresExpanded(!filtresExpanded)}
                        >
                            <div className="fiche-tags">
                                {(filtresExpanded ? prestataire.filtres : prestataire.filtres.slice(0, 3)).map((filtre) => (
                                    <span key={filtre.id} className="fiche-tag">
                                        {filtre.nom}
                                    </span>
                                ))}
                                {!filtresExpanded && prestataire.filtres.length > 3 && (
                                    <span className="fiche-tag fiche-tag-more">
                                        +{prestataire.filtres.length - 3}
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Boutons d'action */}
                    <div className="fiche-action-buttons">
                        <button className="fiche-action-btn" onClick={handleNavigate}>
                            <IonIcon icon={navigateOutline} />
                            <span>Itinéraire</span>
                        </button>
                        {prestataire.website && (
                            <button className="fiche-action-btn" onClick={handleOpenWebsite}>
                                <IonIcon icon={globeOutline} />
                                <span>Site web</span>
                            </button>
                        )}
                        <button className="fiche-action-btn fiche-action-btn-small" onClick={() => setShowHorairesModal(true)}>
                            <IonIcon icon={calendarOutline} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal Horaires */}
            {showHorairesModal && (
                <div className="horaires-modal-overlay" onClick={() => setShowHorairesModal(false)}>
                    <div className="horaires-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="horaires-modal-header">
                            <h2>Horaires d'ouverture</h2>
                            <button className="horaires-modal-close" onClick={() => setShowHorairesModal(false)}>
                                <IonIcon icon={closeOutline} />
                            </button>
                        </div>
                        <div className="horaires-modal-content">
                            {horairesFormatted ? (
                                horairesFormatted.map((h, index) => {
                                    const joursSemaine = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
                                    const aujourdhuiIndex = new Date().getDay();
                                    const aujourdhui = joursSemaine[aujourdhuiIndex];
                                    const isToday = h.jour === aujourdhui;

                                    return (
                                        <div
                                            key={index}
                                            className={`horaire-row ${isToday ? 'horaire-today' : ''} ${!h.ouvert ? 'horaire-closed' : ''}`}
                                        >
                                            <span className="horaire-jour">{h.jour}</span>
                                            <span className="horaire-heures">
                                                {h.ouvert ? `${h.debut} - ${h.fin}` : 'Fermé'}
                                            </span>
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="no-horaires">Horaires non renseignés</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Détail Promotion */}
            {showPromoModal && selectedPromo && (
                <div className="fiche-promo-modal-overlay" onClick={() => setShowPromoModal(false)}>
                    <div className="fiche-promo-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="fiche-promo-modal-header">
                            <div className="fiche-promo-modal-badge">
                                <IonIcon icon={ticketOutline} />
                                <span>{selectedPromo.etiquette || 'PROMO'}</span>
                            </div>
                            <button className="fiche-promo-modal-close" onClick={() => setShowPromoModal(false)}>
                                <IonIcon icon={closeOutline} />
                            </button>
                        </div>

                        <div className="fiche-promo-modal-content">
                            <h2 className="fiche-promo-modal-title">{selectedPromo.titre}</h2>

                            {selectedPromo.description && (
                                <p className="fiche-promo-modal-description">{selectedPromo.description}</p>
                            )}

                            <div className="fiche-promo-modal-details">
                                <div className="fiche-promo-detail-item">
                                    <span className="fiche-promo-detail-label">Valable jusqu'au</span>
                                    <span className="fiche-promo-detail-value">{formatDate(selectedPromo.dateFin)}</span>
                                </div>

                                {selectedPromo.limiteUtilisations && (
                                    <div className="fiche-promo-detail-item">
                                        <span className="fiche-promo-detail-label">Utilisations restantes</span>
                                        <span className="fiche-promo-detail-value">
                                            {selectedPromo.limiteUtilisations - selectedPromo.nombreUtilisations} / {selectedPromo.limiteUtilisations}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="fiche-promo-modal-footer">
                                <p className="fiche-promo-modal-info">
                                    Scannez votre QR code en caisse pour bénéficier de l'offre
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FichePrestataire;