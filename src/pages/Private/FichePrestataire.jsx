import React, { useState, useEffect } from 'react';
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
    callOutline,
    navigateOutline
} from 'ionicons/icons';
import PrestataireService from '../../Services/Prestataire.services';

const FichePrestataire = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [prestataire, setPrestataire] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const fetchPrestataire = async () => {
            setLoading(true);
            try {
                const result = await PrestataireService.getById(id);
                if (result.success) {
                    setPrestataire(result.data);
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

    const toggleFavorite = () => {
        setIsFavorite(!isFavorite);
        // TODO: Sauvegarder en BDD
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
                console.log('Erreur partage:', error);
            }
        }
    };

    const handleCall = () => {
        if (prestataire?.telephone) {
            window.location.href = `tel:${prestataire.telephone}`;
        }
    };

    const handleNavigate = () => {
        if (prestataire?.latitude && prestataire?.longitude) {
            const url = `https://www.google.com/maps/dir/?api=1&destination=${prestataire.latitude},${prestataire.longitude}`;
            window.open(url, '_blank');
        }
    };

    const handleSeeOnMap = () => {
        if (prestataire?.latitude && prestataire?.longitude) {
            navigate(`/auth/maps?lat=${prestataire.latitude}&lng=${prestataire.longitude}&prestataire=${prestataire.id}`);
        }
    };

    // Formater la note (gérer string ou number)
    const formatNote = (note) => {
        if (note === null || note === undefined) return '4.5';
        const numNote = typeof note === 'string' ? parseFloat(note) : note;
        return isNaN(numNote) ? '4.5' : numNote.toFixed(1);
    };

    // Images du prestataire (ou image par défaut)
    const getImages = () => {
        if (prestataire?.images && Array.isArray(prestataire.images) && prestataire.images.length > 0) {
            return prestataire.images;
        }
        if (prestataire?.imagePrincipale) {
            return [prestataire.imagePrincipale];
        }
        return ['https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80'];
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

    return (
        <div className="fiche-prestataire-page">
            {/* Image de fond en plein écran */}
            <div
                className="fiche-hero-image"
                style={{ backgroundImage: `url(${images[currentImageIndex]})` }}
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
                        <button
                            className={`fiche-header-btn ${isFavorite ? 'favorite-active' : ''}`}
                            onClick={toggleFavorite}
                        >
                            <IonIcon icon={isFavorite ? heart : heartOutline} />
                        </button>
                    </div>
                </div>

                {/* Indicateurs d'images (si plusieurs images) */}
                {images.length > 1 && (
                    <div className="fiche-image-indicators">
                        {images.map((_, index) => (
                            <button
                                key={index}
                                className={`indicator-dot ${index === currentImageIndex ? 'active' : ''}`}
                                onClick={() => setCurrentImageIndex(index)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Contenu en bas - Card glassmorphism */}
            <div className="fiche-content">
                <div className="fiche-content-inner">
                    {/* Titre et note */}
                    <div className="fiche-title-row">
                        <h1 className="fiche-title">{prestataire.nomCommerce}</h1>
                        <div className="fiche-rating">
                            <IonIcon icon={star} className="star-icon" />
                            <span>{formatNote(prestataire.noteGlobale)}</span>
                        </div>
                    </div>

                    {/* Localisation et durée */}
                    <div className="fiche-meta-row">
                        <div className="fiche-meta-item">
                            <IonIcon icon={locationOutline} />
                            <span>{prestataire.ville}{prestataire.codePostal ? `, ${prestataire.codePostal}` : ''}</span>
                        </div>
                        <div className="fiche-meta-item">
                            <IonIcon icon={timeOutline} />
                            <span>Ouvert</span>
                        </div>
                    </div>

                    {/* Avatars + nombre de visites */}
                    <div className="fiche-visitors">
                        <div className="visitor-avatars">
                            <div className="avatar" style={{ backgroundImage: 'url(https://i.pravatar.cc/100?img=1)' }}></div>
                            <div className="avatar" style={{ backgroundImage: 'url(https://i.pravatar.cc/100?img=2)' }}></div>
                            <div className="avatar" style={{ backgroundImage: 'url(https://i.pravatar.cc/100?img=3)' }}></div>
                        </div>
                        <span className="visitor-count">
                            {prestataire.nombreAvis || 0}+ personnes ont visité
                        </span>
                    </div>

                    {/* Description */}
                    <p className="fiche-description">
                        {prestataire.descriptionCourte || 'Découvrez ce lieu unique et profitez d\'une expérience exceptionnelle.'}
                    </p>

                    {/* Filtres/Tags du prestataire */}
                    {prestataire.filtres && prestataire.filtres.length > 0 && (
                        <div className="fiche-tags">
                            {prestataire.filtres.slice(0, 5).map((filtre) => (
                                <span key={filtre.id} className="fiche-tag">
                                    {filtre.nom}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Bouton principal */}
                    <button className="fiche-main-btn" onClick={handleSeeOnMap}>
                        <IonIcon icon={navigateOutline} />
                        <span>Voir sur la carte</span>
                    </button>

                    {/* Boutons d'action secondaires */}
                    <div className="fiche-action-buttons">
                        <button className="fiche-action-btn" onClick={handleCall}>
                            <IonIcon icon={callOutline} />
                            <span>Appeler</span>
                        </button>
                        <button className="fiche-action-btn" onClick={handleNavigate}>
                            <IonIcon icon={navigateOutline} />
                            <span>Itinéraire</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FichePrestataire;