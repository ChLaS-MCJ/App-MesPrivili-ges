import { useState, useEffect } from 'react';
import { IonIcon } from '@ionic/react';
import { closeOutline } from 'ionicons/icons';
import PromotionService from '../../Services/Promotion.services';

const PromotionFormModal = ({ isOpen, onClose, onSuccess, promotion, prestataireId }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        titre: '',
        description: '',
        dateDebut: new Date().toISOString().split('T')[0],
        dateFin: '',
        estActive: true
    });

    useEffect(() => {
        if (promotion) {
            setFormData({
                titre: promotion.titre || '',
                description: promotion.description || '',
                dateDebut: promotion.dateDebut?.split('T')[0] || '',
                dateFin: promotion.dateFin?.split('T')[0] || '',
                estActive: promotion.estActive !== false
            });
        } else {
            // Réinitialiser le formulaire
            setFormData({
                titre: '',
                description: '',
                dateDebut: new Date().toISOString().split('T')[0],
                dateFin: '',
                estActive: true
            });
        }
    }, [promotion]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Validation
            if (!formData.titre.trim()) {
                throw new Error('Le titre est obligatoire');
            }
            if (!formData.dateFin) {
                throw new Error('La date de fin est obligatoire');
            }
            if (new Date(formData.dateFin) <= new Date(formData.dateDebut)) {
                throw new Error('La date de fin doit être après la date de début');
            }

            const dataToSend = {
                ...formData,
                prestataireId: prestataireId
            };

            let result;
            if (promotion) {
                result = await PromotionService.update(promotion.id, dataToSend);
            } else {
                result = await PromotionService.create(dataToSend);
            }

            if (result.success) {
                onSuccess();
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="promo-form-modal" onClick={e => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}>
                    <IonIcon icon={closeOutline} />
                </button>

                <h2>{promotion ? 'Modifier la promotion' : 'Nouvelle promotion'}</h2>

                {error && (
                    <div className="error-message">{error}</div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Titre de la promotion *</label>
                        <input
                            type="text"
                            name="titre"
                            value={formData.titre}
                            onChange={handleChange}
                            required
                            placeholder="Ex: -20% sur tout le magasin"
                            maxLength={100}
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            placeholder="Détails de la promotion..."
                            maxLength={500}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Date de début *</label>
                            <input
                                type="date"
                                name="dateDebut"
                                value={formData.dateDebut}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Date de fin *</label>
                            <input
                                type="date"
                                name="dateFin"
                                value={formData.dateFin}
                                onChange={handleChange}
                                required
                                min={formData.dateDebut}
                            />
                        </div>
                    </div>

                    <div className="form-group checkbox-group">
                        <label>
                            <input
                                type="checkbox"
                                name="estActive"
                                checked={formData.estActive}
                                onChange={handleChange}
                            />
                            <span>Promotion active</span>
                        </label>
                        <p className="help-text">
                            Désactivez pour mettre en pause temporairement la promotion
                        </p>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn-secondary" onClick={onClose}>
                            Annuler
                        </button>
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Enregistrement...' : (promotion ? 'Modifier' : 'Créer')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PromotionFormModal;
