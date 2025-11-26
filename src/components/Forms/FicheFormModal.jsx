import { useState, useEffect } from 'react';
import { IonIcon } from '@ionic/react';
import { closeOutline, imageOutline, addOutline, trashOutline } from 'ionicons/icons';
import PrestataireService from '../../Services/Prestataire.services';

const FicheFormModal = ({ isOpen, onClose, onSuccess, fiche }) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('infos');

    const [formData, setFormData] = useState({
        nomCommerce: '',
        typeCommerce: '',
        categoryId: '',
        descriptionCourte: '',
        adresse: '',
        codePostal: '',
        ville: '',
        latitude: '',
        longitude: '',
        telephone: '',
        email: '',
        siteWeb: '',
        dateDebut: new Date().toISOString().split('T')[0],
        dateFin: '',
        imagePrincipale: '',
        imagesGalerie: [],
        horaires: {
            lundi: { ouvert: false, debut: '09:00', fin: '18:00' },
            mardi: { ouvert: false, debut: '09:00', fin: '18:00' },
            mercredi: { ouvert: false, debut: '09:00', fin: '18:00' },
            jeudi: { ouvert: false, debut: '09:00', fin: '18:00' },
            vendredi: { ouvert: false, debut: '09:00', fin: '18:00' },
            samedi: { ouvert: false, debut: '09:00', fin: '18:00' },
            dimanche: { ouvert: false, debut: '09:00', fin: '18:00' }
        }
    });

    useEffect(() => {
        loadCategories();
        if (fiche) {
            setFormData({
                ...fiche,
                dateDebut: fiche.dateDebut?.split('T')[0] || '',
                dateFin: fiche.dateFin?.split('T')[0] || '',
                categoryId: fiche.categoryId?.toString() || ''
            });
        }
    }, [fiche]);

    const loadCategories = async () => {
        try {
            const result = await PrestataireService.getCategories();
            if (result.success) {
                setCategories(result.data);
            }
        } catch (error) {
            console.error('Erreur catégories:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleHoraireChange = (jour, field, value) => {
        setFormData(prev => ({
            ...prev,
            horaires: {
                ...prev.horaires,
                [jour]: {
                    ...prev.horaires[jour],
                    [field]: field === 'ouvert' ? value : value
                }
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Validation
            if (!formData.dateFin) {
                throw new Error('La date de fin est obligatoire');
            }

            const dataToSend = {
                ...formData,
                categoryId: parseInt(formData.categoryId),
                latitude: formData.latitude ? parseFloat(formData.latitude) : null,
                longitude: formData.longitude ? parseFloat(formData.longitude) : null
            };

            let result;
            if (fiche) {
                result = await PrestataireService.updateFiche(fiche.id, dataToSend);
            } else {
                result = await PrestataireService.createFiche(dataToSend);
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

    const jours = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="fiche-form-modal" onClick={e => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}>
                    <IonIcon icon={closeOutline} />
                </button>

                <h2>{fiche ? 'Modifier la fiche' : 'Nouvelle fiche commerce'}</h2>

                {/* Onglets */}
                <div className="form-tabs">
                    <button
                        className={`tab ${activeTab === 'infos' ? 'active' : ''}`}
                        onClick={() => setActiveTab('infos')}
                    >
                        Informations
                    </button>
                    <button
                        className={`tab ${activeTab === 'photos' ? 'active' : ''}`}
                        onClick={() => setActiveTab('photos')}
                    >
                        Photos
                    </button>
                    <button
                        className={`tab ${activeTab === 'horaires' ? 'active' : ''}`}
                        onClick={() => setActiveTab('horaires')}
                    >
                        Horaires
                    </button>
                </div>

                {error && (
                    <div className="error-message">{error}</div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* ONGLET INFOS */}
                    {activeTab === 'infos' && (
                        <div className="tab-content">
                            <div className="form-group">
                                <label>Nom du commerce *</label>
                                <input
                                    type="text"
                                    name="nomCommerce"
                                    value={formData.nomCommerce}
                                    onChange={handleChange}
                                    required
                                    placeholder="Ex: Boulangerie du Centre"
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Type *</label>
                                    <select
                                        name="typeCommerce"
                                        value={formData.typeCommerce}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Sélectionner...</option>
                                        <option value="restaurant">Restaurant</option>
                                        <option value="boutique">Boutique</option>
                                        <option value="salon">Salon</option>
                                        <option value="magasin">Magasin</option>
                                        <option value="service">Service</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Catégorie *</label>
                                    <select
                                        name="categoryId"
                                        value={formData.categoryId}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Sélectionner...</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.icon} {cat.nom}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Description courte</label>
                                <textarea
                                    name="descriptionCourte"
                                    value={formData.descriptionCourte}
                                    onChange={handleChange}
                                    rows={3}
                                    placeholder="Décrivez votre commerce..."
                                />
                            </div>

                            <div className="form-group">
                                <label>Adresse *</label>
                                <input
                                    type="text"
                                    name="adresse"
                                    value={formData.adresse}
                                    onChange={handleChange}
                                    required
                                    placeholder="123 Rue..."
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Code postal *</label>
                                    <input
                                        type="text"
                                        name="codePostal"
                                        value={formData.codePostal}
                                        onChange={handleChange}
                                        required
                                        pattern="[0-9]{5}"
                                        placeholder="75001"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Ville *</label>
                                    <input
                                        type="text"
                                        name="ville"
                                        value={formData.ville}
                                        onChange={handleChange}
                                        required
                                        placeholder="Paris"
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Latitude</label>
                                    <input
                                        type="number"
                                        name="latitude"
                                        value={formData.latitude}
                                        onChange={handleChange}
                                        step="any"
                                        placeholder="48.8566"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Longitude</label>
                                    <input
                                        type="number"
                                        name="longitude"
                                        value={formData.longitude}
                                        onChange={handleChange}
                                        step="any"
                                        placeholder="2.3522"
                                    />
                                </div>
                            </div>

                            <div className="form-section-title">Contact</div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Téléphone</label>
                                    <input
                                        type="tel"
                                        name="telephone"
                                        value={formData.telephone}
                                        onChange={handleChange}
                                        placeholder="01 23 45 67 89"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="contact@exemple.fr"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Site web</label>
                                <input
                                    type="url"
                                    name="siteWeb"
                                    value={formData.siteWeb}
                                    onChange={handleChange}
                                    placeholder="https://www.exemple.fr"
                                />
                            </div>

                            <div className="form-section-title">Période de validité</div>

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
                        </div>
                    )}

                    {/* ONGLET PHOTOS */}
                    {activeTab === 'photos' && (
                        <div className="tab-content">
                            <div className="form-group">
                                <label>Image principale (URL)</label>
                                <input
                                    type="url"
                                    name="imagePrincipale"
                                    value={formData.imagePrincipale}
                                    onChange={handleChange}
                                    placeholder="https://..."
                                />
                                {formData.imagePrincipale && (
                                    <div className="image-preview">
                                        <img src={formData.imagePrincipale} alt="Principale" />
                                    </div>
                                )}
                            </div>

                            <div className="form-group">
                                <label>Galerie (max 5 images)</label>
                                <p className="help-text">
                                    Les images de galerie peuvent être ajoutées après la création de la fiche
                                </p>
                            </div>
                        </div>
                    )}

                    {/* ONGLET HORAIRES */}
                    {activeTab === 'horaires' && (
                        <div className="tab-content">
                            <div className="horaires-list">
                                {jours.map(jour => (
                                    <div key={jour} className="horaire-row">
                                        <label className="jour-label">
                                            <input
                                                type="checkbox"
                                                checked={formData.horaires[jour]?.ouvert || false}
                                                onChange={(e) => handleHoraireChange(jour, 'ouvert', e.target.checked)}
                                            />
                                            <span>{jour.charAt(0).toUpperCase() + jour.slice(1)}</span>
                                        </label>

                                        {formData.horaires[jour]?.ouvert && (
                                            <div className="horaire-times">
                                                <input
                                                    type="time"
                                                    value={formData.horaires[jour]?.debut || '09:00'}
                                                    onChange={(e) => handleHoraireChange(jour, 'debut', e.target.value)}
                                                />
                                                <span>-</span>
                                                <input
                                                    type="time"
                                                    value={formData.horaires[jour]?.fin || '18:00'}
                                                    onChange={(e) => handleHoraireChange(jour, 'fin', e.target.value)}
                                                />
                                            </div>
                                        )}

                                        {!formData.horaires[jour]?.ouvert && (
                                            <span className="ferme-label">Fermé</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="form-actions">
                        <button type="button" className="btn-secondary" onClick={onClose}>
                            Annuler
                        </button>
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Enregistrement...' : (fiche ? 'Modifier' : 'Créer')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FicheFormModal;
