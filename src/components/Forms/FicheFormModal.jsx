import { useState, useEffect, useRef } from 'react';
import { IonIcon } from '@ionic/react';
import {
    closeOutline,
    imageOutline,
    addOutline,
    trashOutline,
    cloudUploadOutline,
    checkmarkCircleOutline,
    alertCircleOutline,
    locationOutline,
    reorderThreeOutline
} from 'ionicons/icons';
import PrestataireService from '../../Services/Prestataire.services';

// Import des images de catégories (comme dans Categories.jsx)
import modeImg from '../../Assets/Images/Categories/mode.jpeg';
import restaurantsImg from '../../Assets/Images/Categories/restaurants.jpeg';
import hotelsImg from '../../Assets/Images/Categories/hotels.png';
import beauteImg from '../../Assets/Images/Categories/beaute.png';
import voyageImg from '../../Assets/Images/Categories/voyage.jpg';
import sportImg from '../../Assets/Images/Categories/sport.jpeg';
import techImg from '../../Assets/Images/Categories/tech.jpg';
import enfantsImg from '../../Assets/Images/Categories/enfants.png';
import maisonImg from '../../Assets/Images/Categories/maison.png';
import loisirImg from '../../Assets/Images/Categories/loisir.png';

// Mapping des images de catégories
const categoryImages = {
    'Mode': modeImg,
    'Restaurants': restaurantsImg,
    'Hôtels': hotelsImg,
    'Beauté & Spa': beauteImg,
    'Voyage': voyageImg,
    'Sport & Fitness': sportImg,
    'High-Tech': techImg,
    'Enfants': enfantsImg,
    'Maison': maisonImg,
    'Loisir': loisirImg,
};

// Types de commerce disponibles
const typesCommerce = [
    { value: 'restaurant', label: 'Restaurant' },
    { value: 'brasserie', label: 'Brasserie' },
    { value: 'cafe', label: 'Café' },
    { value: 'bar', label: 'Bar' },
    { value: 'fast-food', label: 'Fast-food' },
    { value: 'traiteur', label: 'Traiteur' },
    { value: 'boulangerie', label: 'Boulangerie' },
    { value: 'patisserie', label: 'Pâtisserie' },
    { value: 'boutique', label: 'Boutique' },
    { value: 'boutique-vetements', label: 'Boutique de vêtements' },
    { value: 'boutique-chaussures', label: 'Boutique de chaussures' },
    { value: 'boutique-accessoires', label: 'Boutique d\'accessoires' },
    { value: 'boutique-bijoux', label: 'Bijouterie' },
    { value: 'boutique-cadeaux', label: 'Boutique de cadeaux' },
    { value: 'magasin', label: 'Magasin' },
    { value: 'supermarche', label: 'Supermarché' },
    { value: 'epicerie', label: 'Épicerie' },
    { value: 'primeur', label: 'Primeur' },
    { value: 'fromagerie', label: 'Fromagerie' },
    { value: 'caviste', label: 'Caviste' },
    { value: 'salon-coiffure', label: 'Salon de coiffure' },
    { value: 'salon-beaute', label: 'Salon de beauté' },
    { value: 'salon-esthetique', label: 'Institut esthétique' },
    { value: 'spa', label: 'Spa' },
    { value: 'barbier', label: 'Barbier' },
    { value: 'onglerie', label: 'Onglerie' },
    { value: 'hotel', label: 'Hôtel' },
    { value: 'chambre-hotes', label: 'Chambre d\'hôtes' },
    { value: 'gite', label: 'Gîte' },
    { value: 'agence-voyage', label: 'Agence de voyage' },
    { value: 'salle-sport', label: 'Salle de sport' },
    { value: 'club-fitness', label: 'Club de fitness' },
    { value: 'yoga-studio', label: 'Studio de yoga' },
    { value: 'piscine', label: 'Piscine' },
    { value: 'magasin-sport', label: 'Magasin de sport' },
    { value: 'boutique-high-tech', label: 'Boutique high-tech' },
    { value: 'reparation-telephone', label: 'Réparation téléphone' },
    { value: 'informatique', label: 'Informatique' },
    { value: 'electromenager', label: 'Électroménager' },
    { value: 'boutique-enfants', label: 'Boutique enfants' },
    { value: 'jouets', label: 'Magasin de jouets' },
    { value: 'creche', label: 'Crèche' },
    { value: 'decoration', label: 'Décoration' },
    { value: 'meubles', label: 'Meubles' },
    { value: 'bricolage', label: 'Bricolage' },
    { value: 'jardinerie', label: 'Jardinerie' },
    { value: 'cinema', label: 'Cinéma' },
    { value: 'bowling', label: 'Bowling' },
    { value: 'escape-game', label: 'Escape Game' },
    { value: 'karting', label: 'Karting' },
    { value: 'parc-attractions', label: 'Parc d\'attractions' },
    { value: 'musee', label: 'Musée' },
    { value: 'theatre', label: 'Théâtre' },
    { value: 'librairie', label: 'Librairie' },
    { value: 'fleuriste', label: 'Fleuriste' },
    { value: 'pharmacie', label: 'Pharmacie' },
    { value: 'opticien', label: 'Opticien' },
    { value: 'veterinaire', label: 'Vétérinaire' },
    { value: 'garage', label: 'Garage automobile' },
    { value: 'auto-ecole', label: 'Auto-école' },
    { value: 'pressing', label: 'Pressing' },
    { value: 'cordonnerie', label: 'Cordonnerie' },
    { value: 'autre', label: 'Autre' }
];

const FicheFormModal = ({ isOpen, onClose, onSuccess, fiche }) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('infos');

    // Pour la géolocalisation automatique
    const [geoLoading, setGeoLoading] = useState(false);
    const [geoStatus, setGeoStatus] = useState(null); // 'success', 'error', null

    // Pour l'upload d'images
    const [uploadingMain, setUploadingMain] = useState(false);
    const [uploadingGallery, setUploadingGallery] = useState(false);
    const mainImageInputRef = useRef(null);
    const galleryInputRef = useRef(null);

    // Pour le drag and drop
    const [draggedIndex, setDraggedIndex] = useState(null);
    const [dragOverIndex, setDragOverIndex] = useState(null);

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
        googlePlaceId: '',
        imagePrincipale: '',
        images: [],
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

    // Reset form when modal opens/closes or fiche changes
    useEffect(() => {
        if (isOpen) {
            loadCategories();
            if (fiche) {
                // Parse images si c'est une string JSON
                let parsedImages = [];
                if (fiche.images) {
                    if (typeof fiche.images === 'string') {
                        try {
                            // Nettoyer la chaîne avant de parser
                            let cleanedImages = fiche.images.trim();

                            if (cleanedImages && cleanedImages !== '[]' && cleanedImages !== 'null') {
                                let parsed = JSON.parse(cleanedImages);

                                // Si le résultat est encore une string (double encodage), parser à nouveau
                                if (typeof parsed === 'string') {
                                    parsed = JSON.parse(parsed);
                                }

                                // S'assurer que c'est un tableau et filtrer les valeurs vides
                                if (Array.isArray(parsed)) {
                                    parsedImages = parsed.filter(img => img && typeof img === 'string' && img.trim() !== '');
                                }
                            }
                        } catch (e) {
                            console.error('Erreur parsing images:', e, fiche.images);
                            parsedImages = [];
                        }
                    } else if (Array.isArray(fiche.images)) {
                        // Filtrer les valeurs vides
                        parsedImages = fiche.images.filter(img => img && typeof img === 'string' && img.trim() !== '');
                    }
                }
                console.log('Images parsées:', parsedImages, 'Original:', fiche.images);

                // Parse horaires si c'est une string JSON
                const defaultHoraires = {
                    lundi: { ouvert: false, debut: '09:00', fin: '18:00' },
                    mardi: { ouvert: false, debut: '09:00', fin: '18:00' },
                    mercredi: { ouvert: false, debut: '09:00', fin: '18:00' },
                    jeudi: { ouvert: false, debut: '09:00', fin: '18:00' },
                    vendredi: { ouvert: false, debut: '09:00', fin: '18:00' },
                    samedi: { ouvert: false, debut: '09:00', fin: '18:00' },
                    dimanche: { ouvert: false, debut: '09:00', fin: '18:00' }
                };
                let parsedHoraires = defaultHoraires;
                if (fiche.horaires) {
                    if (typeof fiche.horaires === 'string') {
                        try {
                            parsedHoraires = JSON.parse(fiche.horaires);
                        } catch (e) {
                            parsedHoraires = defaultHoraires;
                        }
                    } else if (typeof fiche.horaires === 'object') {
                        parsedHoraires = fiche.horaires;
                    }
                }

                setFormData({
                    nomCommerce: fiche.nomCommerce || '',
                    typeCommerce: fiche.typeCommerce || '',
                    categoryId: fiche.categoryId?.toString() || '',
                    descriptionCourte: fiche.descriptionCourte || '',
                    adresse: fiche.adresse || '',
                    codePostal: fiche.codePostal || '',
                    ville: fiche.ville || '',
                    latitude: fiche.latitude || '',
                    longitude: fiche.longitude || '',
                    googlePlaceId: fiche.googlePlaceId || '',
                    imagePrincipale: fiche.imagePrincipale || '',
                    images: parsedImages,
                    horaires: parsedHoraires
                });
            } else {
                // Reset pour nouvelle fiche
                setFormData({
                    nomCommerce: '',
                    typeCommerce: '',
                    categoryId: '',
                    descriptionCourte: '',
                    adresse: '',
                    codePostal: '',
                    ville: '',
                    latitude: '',
                    longitude: '',
                    googlePlaceId: '',
                    imagePrincipale: '',
                    images: [],
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
            }
            setActiveTab('infos');
            setError(null);
            setGeoStatus(null);
        }
    }, [isOpen, fiche]);

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

    // Géolocalisation automatique via API adresse.data.gouv.fr
    const geocodeAddress = async () => {
        const { adresse, codePostal, ville } = formData;

        if (!adresse || !ville) {
            setError('Veuillez renseigner l\'adresse et la ville');
            return;
        }

        setGeoLoading(true);
        setGeoStatus(null);
        setError(null);

        try {
            const query = `${adresse} ${codePostal} ${ville}`;
            const response = await fetch(
                `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&limit=1`
            );

            const data = await response.json();

            if (data.features && data.features.length > 0) {
                const [lng, lat] = data.features[0].geometry.coordinates;
                setFormData(prev => ({
                    ...prev,
                    latitude: lat.toFixed(6),
                    longitude: lng.toFixed(6)
                }));
                setGeoStatus('success');
            } else {
                setGeoStatus('error');
                setError('Adresse non trouvée. Vérifiez les informations.');
            }
        } catch (error) {
            console.error('Erreur géocodage:', error);
            setGeoStatus('error');
            setError('Erreur lors de la géolocalisation');
        } finally {
            setGeoLoading(false);
        }
    };

    // Déclencher la géolocalisation quand adresse + code postal + ville sont remplis
    useEffect(() => {
        const { adresse, codePostal, ville } = formData;
        if (adresse && codePostal && codePostal.length === 5 && ville && !formData.latitude) {
            const timer = setTimeout(() => {
                geocodeAddress();
            }, 1000); // Debounce de 1 seconde
            return () => clearTimeout(timer);
        }
    }, [formData.adresse, formData.codePostal, formData.ville]);

    const handleHoraireChange = (jour, field, value) => {
        setFormData(prev => ({
            ...prev,
            horaires: {
                ...prev.horaires,
                [jour]: {
                    ...prev.horaires[jour],
                    [field]: value
                }
            }
        }));
    };

    // Upload d'image principale
    const handleMainImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validation du fichier
        if (!file.type.startsWith('image/')) {
            setError('Le fichier doit être une image');
            return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB max
            setError('L\'image ne doit pas dépasser 5 Mo');
            return;
        }

        setUploadingMain(true);
        setError(null);

        try {
            const formDataUpload = new FormData();
            formDataUpload.append('image', file);
            formDataUpload.append('type', 'principale');
            if (fiche?.id) {
                formDataUpload.append('prestataireId', fiche.id);
            }

            const response = await fetch(`${import.meta.env.VITE_API_URL}/prestataires/me/upload-image`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formDataUpload
            });

            const result = await response.json();

            if (result.success) {
                setFormData(prev => ({
                    ...prev,
                    imagePrincipale: result.data.url
                }));
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            console.error('Erreur upload:', error);
            setError(error.message || 'Erreur lors de l\'upload');
        } finally {
            setUploadingMain(false);
        }
    };

    // Upload d'image galerie
    const handleGalleryImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validation
        if (!file.type.startsWith('image/')) {
            setError('Le fichier doit être une image');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError('L\'image ne doit pas dépasser 5 Mo');
            return;
        }

        if (formData.images.length >= 5) {
            setError('Maximum 5 images dans la galerie');
            return;
        }

        setUploadingGallery(true);
        setError(null);

        try {
            const formDataUpload = new FormData();
            formDataUpload.append('image', file);
            formDataUpload.append('type', 'galerie');
            if (fiche?.id) {
                formDataUpload.append('prestataireId', fiche.id);
            }

            const response = await fetch(`${import.meta.env.VITE_API_URL}/prestataires/me/upload-image`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formDataUpload
            });

            const result = await response.json();

            if (result.success) {
                setFormData(prev => ({
                    ...prev,
                    images: [...prev.images, result.data.url]
                }));
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            console.error('Erreur upload:', error);
            setError(error.message || 'Erreur lors de l\'upload');
        } finally {
            setUploadingGallery(false);
        }
    };

    // Supprimer image principale (avec suppression backend)
    const removeMainImage = async () => {
        const imageUrl = formData.imagePrincipale;

        // Mettre à jour le state immédiatement
        setFormData(prev => ({
            ...prev,
            imagePrincipale: ''
        }));

        // Supprimer le fichier côté backend si on a un prestataireId
        if (fiche?.id && imageUrl) {
            try {
                await fetch(`${import.meta.env.VITE_API_URL}/prestataires/me/delete-image`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        prestataireId: fiche.id,
                        imageUrl: imageUrl,
                        type: 'principale'
                    })
                });
            } catch (error) {
                console.error('Erreur suppression image backend:', error);
            }
        }
    };

    // Supprimer image galerie (avec suppression backend)
    const removeGalleryImage = async (index) => {
        const imageUrl = formData.images[index];

        // Mettre à jour le state immédiatement
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));

        // Supprimer le fichier côté backend si on a un prestataireId
        if (fiche?.id && imageUrl) {
            try {
                await fetch(`${import.meta.env.VITE_API_URL}/prestataires/me/delete-image`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        prestataireId: fiche.id,
                        imageUrl: imageUrl,
                        type: 'galerie',
                        index: index
                    })
                });
            } catch (error) {
                console.error('Erreur suppression image backend:', error);
            }
        }
    };

    // Drag and Drop handlers
    const handleDragStart = (e, index) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e, index) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;
        setDragOverIndex(index);
    };

    const handleDragLeave = () => {
        setDragOverIndex(null);
    };

    const handleDrop = (e, dropIndex) => {
        e.preventDefault();

        if (draggedIndex === null || draggedIndex === dropIndex) {
            setDraggedIndex(null);
            setDragOverIndex(null);
            return;
        }

        // Réorganiser les images
        setFormData(prev => {
            const newImages = [...prev.images];
            const [draggedImage] = newImages.splice(draggedIndex, 1);
            newImages.splice(dropIndex, 0, draggedImage);
            return {
                ...prev,
                images: newImages
            };
        });

        setDraggedIndex(null);
        setDragOverIndex(null);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
        setDragOverIndex(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const dataToSend = {
                ...formData,
                categoryId: parseInt(formData.categoryId),
                latitude: formData.latitude ? parseFloat(formData.latitude) : null,
                longitude: formData.longitude ? parseFloat(formData.longitude) : null,
                images: JSON.stringify(formData.images),
                horaires: formData.horaires
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

    // Obtenir l'image de la catégorie
    const getCategoryImage = (categoryName) => {
        return categoryImages[categoryName] || modeImg;
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
                    <div className="error-message">
                        <IonIcon icon={alertCircleOutline} />
                        {error}
                    </div>
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
                                        {typesCommerce.map(type => (
                                            <option key={type.value} value={type.value}>
                                                {type.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Sélection de catégorie avec images */}
                            <div className="form-group">
                                <label>Catégorie *</label>
                                <div className="category-cards">
                                    {categories.map(cat => (
                                        <div
                                            key={cat.id}
                                            className={`category-card-mini ${formData.categoryId === cat.id.toString() ? 'selected' : ''}`}
                                            onClick={() => setFormData(prev => ({ ...prev, categoryId: cat.id.toString() }))}
                                        >
                                            <div
                                                className="category-card-image"
                                                style={{ backgroundImage: `url(${getCategoryImage(cat.nom)})` }}
                                            />
                                            <span className="category-card-name">{cat.nom}</span>
                                            {formData.categoryId === cat.id.toString() && (
                                                <div className="category-check">
                                                    <IonIcon icon={checkmarkCircleOutline} />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                {/* Select caché pour la validation */}
                                <select
                                    name="categoryId"
                                    value={formData.categoryId}
                                    onChange={handleChange}
                                    required
                                    style={{ display: 'none' }}
                                >
                                    <option value="">Sélectionner...</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.nom}
                                        </option>
                                    ))}
                                </select>
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

                            <div className="form-section-title">Adresse</div>

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

                            {/* Indicateur de géolocalisation */}
                            <div className="geo-status">
                                {geoLoading && (
                                    <div className="geo-loading">
                                        <div className="spinner-small"></div>
                                        <span>Géolocalisation en cours...</span>
                                    </div>
                                )}
                                {geoStatus === 'success' && formData.latitude && (
                                    <div className="geo-success">
                                        <IonIcon icon={checkmarkCircleOutline} />
                                        <span>Coordonnées trouvées : {formData.latitude}, {formData.longitude}</span>
                                    </div>
                                )}
                                {geoStatus === 'error' && (
                                    <div className="geo-error">
                                        <IonIcon icon={alertCircleOutline} />
                                        <span>Géolocalisation échouée</span>
                                        <button type="button" className="btn-retry" onClick={geocodeAddress}>
                                            Réessayer
                                        </button>
                                    </div>
                                )}
                                {!geoLoading && !geoStatus && formData.latitude && formData.longitude && (
                                    <div className="geo-success">
                                        <IonIcon icon={locationOutline} />
                                        <span>Position : {formData.latitude}, {formData.longitude}</span>
                                    </div>
                                )}
                            </div>

                            <div className="form-group">
                                <label>Google Place ID</label>
                                <input
                                    type="text"
                                    name="googlePlaceId"
                                    value={formData.googlePlaceId || ''}
                                    onChange={handleChange}
                                    placeholder="ChIJ..."
                                />
                                <small className="help-text">Optionnel - ID Google Maps pour les avis</small>
                            </div>
                        </div>
                    )}

                    {/* ONGLET PHOTOS */}
                    {activeTab === 'photos' && (
                        <div className="tab-content">
                            {/* Image principale */}
                            <div className="form-group">
                                <label>Image principale</label>
                                <div className="image-upload-zone">
                                    {formData.imagePrincipale ? (
                                        <div className="image-preview-container">
                                            <img
                                                src={formData.imagePrincipale}
                                                alt="Principale"
                                                className="image-preview-main"
                                            />
                                            <button
                                                type="button"
                                                className="image-remove-btn"
                                                onClick={removeMainImage}
                                            >
                                                <IonIcon icon={trashOutline} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div
                                            className="image-upload-placeholder"
                                            onClick={() => mainImageInputRef.current?.click()}
                                        >
                                            {uploadingMain ? (
                                                <div className="upload-loading">
                                                    <div className="spinner-small"></div>
                                                    <span>Upload en cours...</span>
                                                </div>
                                            ) : (
                                                <>
                                                    <IonIcon icon={cloudUploadOutline} />
                                                    <span>Cliquez pour ajouter une image</span>
                                                    <small>JPG, PNG - Max 5 Mo</small>
                                                </>
                                            )}
                                        </div>
                                    )}
                                    <input
                                        ref={mainImageInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleMainImageUpload}
                                        style={{ display: 'none' }}
                                    />
                                </div>
                            </div>

                            {/* Galerie */}
                            <div className="form-group">
                                <label>Galerie ({formData.images.length}/5 images) <small style={{ fontWeight: 'normal', opacity: 0.6 }}>- Glissez pour réorganiser</small></label>
                                <div className="gallery-grid">
                                    {formData.images.map((img, index) => (
                                        <div
                                            key={`${img}-${index}`}
                                            className={`gallery-item ${draggedIndex === index ? 'dragging' : ''} ${dragOverIndex === index ? 'drag-over' : ''}`}
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, index)}
                                            onDragOver={(e) => handleDragOver(e, index)}
                                            onDragLeave={handleDragLeave}
                                            onDrop={(e) => handleDrop(e, index)}
                                            onDragEnd={handleDragEnd}
                                        >
                                            <div className="gallery-item-drag-handle">
                                                <IonIcon icon={reorderThreeOutline} />
                                            </div>
                                            <img src={img} alt={`Galerie ${index + 1}`} />
                                            <div className="gallery-item-number">{index + 1}</div>
                                            <button
                                                type="button"
                                                className="gallery-remove-btn"
                                                onClick={() => removeGalleryImage(index)}
                                            >
                                                <IonIcon icon={trashOutline} />
                                            </button>
                                        </div>
                                    ))}

                                    {formData.images.length < 5 && (
                                        <div
                                            className="gallery-add-item"
                                            onClick={() => galleryInputRef.current?.click()}
                                        >
                                            {uploadingGallery ? (
                                                <div className="spinner-small"></div>
                                            ) : (
                                                <>
                                                    <IonIcon icon={addOutline} />
                                                    <span>Ajouter</span>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <input
                                    ref={galleryInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleGalleryImageUpload}
                                    style={{ display: 'none' }}
                                />
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