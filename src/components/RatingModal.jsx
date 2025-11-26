import { useState } from 'react';
import { IonIcon } from '@ionic/react';
import { closeOutline, star, starOutline, logoGoogle } from 'ionicons/icons';

const RatingModal = ({ isOpen, onClose, prestataire, onSubmitRating }) => {
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmitRating = async () => {
        if (rating === 0 || isSubmitting) return;

        setIsSubmitting(true);
        try {
            await onSubmitRating(rating);
            setSubmitted(true);
        } catch (error) {
            console.error('Erreur lors de la soumission:', error);
        }
        setIsSubmitting(false);
    };

    const openGoogleReview = () => {
        if (prestataire?.googlePlaceId) {
            const url = `https://search.google.com/local/writereview?placeid=${prestataire.googlePlaceId}`;
            window.open(url, '_blank');
        }
    };

    const handleClose = () => {
        // Reset state when closing
        setRating(0);
        setHoveredRating(0);
        setSubmitted(false);
        onClose();
    };

    // Écran après avoir noté
    if (submitted) {
        return (
            <div className="rating-modal-overlay" onClick={handleClose}>
                <div className="rating-modal" onClick={(e) => e.stopPropagation()}>
                    <button className="modal-close-btn" onClick={handleClose}>
                        <IonIcon icon={closeOutline} />
                    </button>

                    <div className="rating-modal-content">

                        <h2>Merci pour votre avis !</h2>

                        <div className="rating-stars-display">
                            {[1, 2, 3, 4, 5].map((value) => (
                                <IonIcon
                                    key={value}
                                    icon={rating >= value ? star : starOutline}
                                    className={`rating-star-small ${rating >= value ? 'active' : ''}`}
                                />
                            ))}
                        </div>

                        {rating >= 4 && prestataire?.googlePlaceId && (
                            <>
                                <p className="rating-google-text">
                                    Votre avis compte ! Aidez {prestataire.nomCommerce} en partageant aussi votre expérience sur Google 🙏
                                </p>
                                <button className="rating-google-btn" onClick={openGoogleReview}>
                                    <IonIcon icon={logoGoogle} />
                                    <span>Laisser un avis Google</span>
                                </button>
                            </>
                        )}

                        <button className="rating-close-btn" onClick={handleClose}>
                            {rating >= 4 && prestataire?.googlePlaceId ? 'Peut-être plus tard' : 'Fermer'}
                        </button>

                    </div>
                </div>
            </div>
        );
    }

    // Écran de notation
    return (
        <div className="rating-modal-overlay" onClick={handleClose}>
            <div className="rating-modal" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={handleClose}>
                    <IonIcon icon={closeOutline} />
                </button>

                <div className="rating-modal-content">

                    <h2>Comment était votre expérience ?</h2>
                    <p className="rating-subtitle">{prestataire?.nomCommerce}</p>

                    <div className="rating-stars">
                        {[1, 2, 3, 4, 5].map((value) => (
                            <button
                                key={value}
                                className="rating-star-btn"
                                onMouseEnter={() => setHoveredRating(value)}
                                onMouseLeave={() => setHoveredRating(0)}
                                onClick={() => setRating(value)}
                            >
                                <IonIcon
                                    icon={(hoveredRating || rating) >= value ? star : starOutline}
                                    className={`rating-star ${(hoveredRating || rating) >= value ? 'active' : ''}`}
                                />
                            </button>
                        ))}
                    </div>

                    <div className="rating-labels">
                        <span>Décevant</span>
                        <span>Excellent</span>
                    </div>

                    <button
                        className={`rating-submit-btn ${rating === 0 ? 'disabled' : ''}`}
                        onClick={handleSubmitRating}
                        disabled={rating === 0 || isSubmitting}
                    >
                        {isSubmitting ? 'Envoi...' : 'Valider ma note'}
                    </button>

                    <button className="rating-skip-btn" onClick={handleClose}>
                        Passer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RatingModal;