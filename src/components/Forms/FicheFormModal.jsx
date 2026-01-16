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
    reorderThreeOutline,
    refreshOutline,
    businessOutline,
    searchOutline,
    lockClosedOutline,
    globeOutline,
    arrowForwardOutline,
    arrowBackOutline,
    mailOutline,
    warningOutline,
    storefrontOutline,
    optionsOutline,
    timeOutline,
    checkmarkOutline
} from 'ionicons/icons';
import PrestataireService from '../../Services/Prestataire.services';

// Import des images de catégories
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

const categoryImages = {
    'Mode': modeImg,
    'Restaurants': restaurantsImg,
    'Restaurants & Salons de thé': restaurantsImg,
    'Hôtels': hotelsImg,
    'Beauté & Spa': beauteImg,
    'Voyage': voyageImg,
    'Sport & Fitness': sportImg,
    'High-Tech': techImg,
    'Enfants': enfantsImg,
    'Maison': maisonImg,
    'Loisir': loisirImg,
    'Loisirs': loisirImg,
};

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

// Configuration des étapes du stepper
const STEPS_CREATE = [
    { id: 'siret', title: 'Entreprise', icon: businessOutline },
    { id: 'infos', title: 'Informations', icon: storefrontOutline },
    { id: 'filtres', title: 'Services', icon: optionsOutline },
    { id: 'adresse', title: 'Adresse', icon: locationOutline },
    { id: 'photos', title: 'Photos', icon: imageOutline },
    { id: 'horaires', title: 'Horaires', icon: timeOutline }
];

const STEPS_EDIT = [
    { id: 'infos', title: 'Informations', icon: storefrontOutline },
    { id: 'filtres', title: 'Services', icon: optionsOutline },
    { id: 'adresse', title: 'Adresse', icon: locationOutline },
    { id: 'photos', title: 'Photos', icon: imageOutline },
    { id: 'horaires', title: 'Horaires', icon: timeOutline }
];

const FicheFormModal = ({ isOpen, onClose, onSuccess, fiche }) => {
    const isEditMode = !!fiche;
    const steps = isEditMode ? STEPS_EDIT : STEPS_CREATE;

    // DEBUG - à retirer après résolution
    console.log('🔧 FicheFormModal rendu:', { isOpen, isEditMode, ficheId: fiche?.id, stepsCount: steps.length });

    const modalContentRef = useRef(null);
    const [currentStep, setCurrentStep] = useState(0);

    const [categories, setCategories] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // État pour les filtres
    const [availableFilters, setAvailableFilters] = useState([]);
    const [selectedFilters, setSelectedFilters] = useState([]);
    const [loadingFilters, setLoadingFilters] = useState(false);

    // État pour la validation SIRET
    const [siretInput, setSiretInput] = useState('');
    const [siretLoading, setSiretLoading] = useState(false);
    const [siretValidated, setSiretValidated] = useState(false);
    const [entrepriseData, setEntrepriseData] = useState(null);
    const [apeNotSupported, setApeNotSupported] = useState(false);

    // Pour la géolocalisation automatique
    const [geoLoading, setGeoLoading] = useState(false);
    const [geoStatus, setGeoStatus] = useState(null);
    const [manualGeoEdit, setManualGeoEdit] = useState(false);

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
        website: '',
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
        },
        siret: '',
        siren: '',
        codeApe: '',
        raisonSociale: '',
        formeJuridique: ''
    });

    // Scroll en haut à chaque changement d'étape
    useEffect(() => {
        if (modalContentRef.current) {
            modalContentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [currentStep]);

    // Reset form when modal opens/closes or fiche changes
    useEffect(() => {
        if (isOpen) {
            loadCategories();
            if (fiche) {
                // MODE ÉDITION
                let parsedImages = [];
                if (fiche.images) {
                    if (typeof fiche.images === 'string') {
                        try {
                            let cleanedImages = fiche.images.trim();
                            if (cleanedImages && cleanedImages !== '[]' && cleanedImages !== 'null') {
                                let parsed = JSON.parse(cleanedImages);
                                if (typeof parsed === 'string') {
                                    parsed = JSON.parse(parsed);
                                }
                                if (Array.isArray(parsed)) {
                                    parsedImages = parsed.filter(img => img && typeof img === 'string' && img.trim() !== '');
                                }
                            }
                        } catch (e) {
                            console.error('Erreur parsing images:', e, fiche.images);
                            parsedImages = [];
                        }
                    } else if (Array.isArray(fiche.images)) {
                        parsedImages = fiche.images.filter(img => img && typeof img === 'string' && img.trim() !== '');
                    }
                }

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
                    website: fiche.website || '',
                    adresse: fiche.adresse || '',
                    codePostal: fiche.codePostal || '',
                    ville: fiche.ville || '',
                    latitude: fiche.latitude || '',
                    longitude: fiche.longitude || '',
                    googlePlaceId: fiche.googlePlaceId || '',
                    imagePrincipale: fiche.imagePrincipale || '',
                    images: parsedImages,
                    horaires: parsedHoraires,
                    siret: fiche.siret || '',
                    siren: fiche.siren || '',
                    codeApe: fiche.codeApe || '',
                    raisonSociale: fiche.raisonSociale || '',
                    formeJuridique: fiche.formeJuridique || ''
                });

                setSiretValidated(true);
                setSiretInput(fiche.siret || '');
                setEntrepriseData({
                    siret: fiche.siret,
                    siren: fiche.siren,
                    codeApe: fiche.codeApe,
                    raisonSociale: fiche.raisonSociale,
                    formeJuridique: fiche.formeJuridique
                });

                if (fiche.codeApe) {
                    loadCategoriesByApe(fiche.codeApe);
                }

                // Charger les filtres existants de la fiche
                if (fiche.filtres && Array.isArray(fiche.filtres)) {
                    setSelectedFilters(fiche.filtres.map(f => f.id));
                }

                if (fiche.latitude && fiche.longitude) {
                    setManualGeoEdit(true);
                }

                setCurrentStep(0);
                setApeNotSupported(false);
            } else {
                // MODE CRÉATION - Reset complet
                setFormData({
                    nomCommerce: '',
                    typeCommerce: '',
                    categoryId: '',
                    descriptionCourte: '',
                    website: '',
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
                    },
                    siret: '',
                    siren: '',
                    codeApe: '',
                    raisonSociale: '',
                    formeJuridique: ''
                });
                setSiretValidated(false);
                setSiretInput('');
                setEntrepriseData(null);
                setFilteredCategories([]);
                setSelectedFilters([]);
                setAvailableFilters([]);
                setManualGeoEdit(false);
                setApeNotSupported(false);
                setCurrentStep(0);
            }
            setError(null);
            setGeoStatus(null);
        }
    }, [isOpen, fiche]);

    // Charger les filtres quand la catégorie change
    useEffect(() => {
        if (formData.categoryId) {
            loadFiltersByCategory(formData.categoryId);
        } else {
            setAvailableFilters([]);
        }
    }, [formData.categoryId]);

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

    const loadCategoriesByApe = async (codeApe) => {
        try {
            console.log(`🔍 Chargement catégories pour APE: ${codeApe}`);

            const response = await fetch(`${import.meta.env.VITE_API_URL}/categories/for-ape/${encodeURIComponent(codeApe)}`);
            const result = await response.json();

            console.log('📦 Réponse API:', result);

            if (result.success && result.data) {
                const { categories: cats, aucuneCategorie } = result.data;

                if (aucuneCategorie || !cats || cats.length === 0) {
                    console.log('❌ Aucune catégorie pour ce code APE');
                    setFilteredCategories([]);
                    setApeNotSupported(true);
                } else {
                    console.log(`✅ ${cats.length} catégorie(s) disponible(s)`);
                    setFilteredCategories(cats);
                    setApeNotSupported(false);
                }
            } else {
                console.error('Erreur réponse API:', result);
                setFilteredCategories([]);
                setApeNotSupported(true);
            }
        } catch (error) {
            console.error('Erreur chargement catégories par APE:', error);
            setFilteredCategories([]);
            setApeNotSupported(true);
        }
    };

    const loadFiltersByCategory = async (categoryId) => {
        setLoadingFilters(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/filtres/category/${categoryId}`);
            const result = await response.json();
            if (result.success) {
                setAvailableFilters(result.data);
            } else {
                setAvailableFilters([]);
            }
        } catch (error) {
            console.error('Erreur chargement filtres:', error);
            setAvailableFilters([]);
        } finally {
            setLoadingFilters(false);
        }
    };

    const toggleFilter = (filterId) => {
        setSelectedFilters(prev =>
            prev.includes(filterId)
                ? prev.filter(id => id !== filterId)
                : [...prev, filterId]
        );
    };

    // Validation du SIRET
    const validateSiret = async () => {
        const siret = siretInput.replace(/\s/g, '');

        if (!siret || siret.length !== 14) {
            setError('Le SIRET doit contenir 14 chiffres');
            return;
        }

        if (!/^\d{14}$/.test(siret)) {
            setError('Le SIRET ne doit contenir que des chiffres');
            return;
        }

        setSiretLoading(true);
        setError(null);
        setApeNotSupported(false);

        try {
            const response = await fetch(`https://recherche-entreprises.api.gouv.fr/search?q=${siret}&page=1&per_page=1`);

            if (!response.ok) {
                throw new Error('Erreur lors de la recherche');
            }

            const data = await response.json();

            if (!data.results || data.results.length === 0) {
                throw new Error('SIRET non trouvé. Vérifiez le numéro et réessayez.');
            }

            const result = data.results[0];
            const etablissement = result.matching_etablissements?.find(e => e.siret === siret)
                || result.siege;

            if (!etablissement) {
                throw new Error('Établissement non trouvé pour ce SIRET');
            }

            const entreprise = {
                siret: siret,
                siren: result.siren || siret.substring(0, 9),
                codeApe: result.activite_principale || '',
                raisonSociale: result.nom_complet || result.nom_raison_sociale || 'Non renseigné',
                formeJuridique: result.nature_juridique || '',
                adresse: etablissement.adresse || '',
                codePostal: etablissement.code_postal || '',
                ville: etablissement.libelle_commune || ''
            };

            console.log('✅ Entreprise trouvée:', entreprise);

            setEntrepriseData(entreprise);
            setSiretValidated(true);

            setFormData(prev => ({
                ...prev,
                siret: entreprise.siret,
                siren: entreprise.siren,
                codeApe: entreprise.codeApe,
                raisonSociale: entreprise.raisonSociale,
                formeJuridique: entreprise.formeJuridique,
                adresse: prev.adresse || entreprise.adresse || '',
                codePostal: prev.codePostal || entreprise.codePostal || '',
                ville: prev.ville || entreprise.ville || ''
            }));

            if (entreprise.codeApe) {
                await loadCategoriesByApe(entreprise.codeApe);
            }

        } catch (error) {
            console.error('Erreur validation SIRET:', error);
            setError(error.message || 'Erreur lors de la validation du SIRET');
        } finally {
            setSiretLoading(false);
        }
    };

    const handleSiretChange = (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 14) value = value.slice(0, 14);

        let formatted = '';
        for (let i = 0; i < value.length; i++) {
            if (i === 3 || i === 6 || i === 9) formatted += ' ';
            formatted += value[i];
        }

        setSiretInput(formatted);
    };

    const resetSiret = () => {
        setSiretValidated(false);
        setSiretInput('');
        setEntrepriseData(null);
        setFilteredCategories([]);
        setApeNotSupported(false);
        setSelectedFilters([]);
        setAvailableFilters([]);
        setFormData(prev => ({
            ...prev,
            siret: '',
            siren: '',
            codeApe: '',
            raisonSociale: '',
            formeJuridique: '',
            categoryId: ''
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === 'latitude' || name === 'longitude') {
            setManualGeoEdit(true);
        }
    };

    // Géolocalisation automatique
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
                setManualGeoEdit(false);
            } else {
                setGeoStatus('error');
                setError('Adresse non trouvée. Vérifiez les informations ou saisissez les coordonnées manuellement.');
            }
        } catch (error) {
            console.error('Erreur géocodage:', error);
            setGeoStatus('error');
            setError('Erreur lors de la géolocalisation. Vous pouvez saisir les coordonnées manuellement.');
        } finally {
            setGeoLoading(false);
        }
    };

    // Déclencher la géolocalisation automatique
    useEffect(() => {
        const { adresse, codePostal, ville, latitude } = formData;
        if (adresse && codePostal && codePostal.length === 5 && ville && !latitude && !manualGeoEdit) {
            const timer = setTimeout(() => {
                geocodeAddress();
            }, 1000);
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

        if (!file.type.startsWith('image/')) {
            setError('Le fichier doit être une image');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
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

    const removeMainImage = async () => {
        const imageUrl = formData.imagePrincipale;
        setFormData(prev => ({ ...prev, imagePrincipale: '' }));

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

    const removeGalleryImage = async (index) => {
        const imageUrl = formData.images[index];
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));

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

    // ==================== NAVIGATION STEPPER ====================
    const validateCurrentStep = () => {
        const step = steps[currentStep];
        setError(null);

        switch (step.id) {
            case 'siret':
                if (!siretValidated) {
                    setError('Veuillez valider votre SIRET');
                    return false;
                }
                if (apeNotSupported) {
                    setError('Votre code APE n\'est pas encore supporté');
                    return false;
                }
                return true;

            case 'infos':
                if (!formData.nomCommerce.trim()) {
                    setError('Le nom du commerce est requis');
                    return false;
                }
                if (!formData.typeCommerce) {
                    setError('Le type de commerce est requis');
                    return false;
                }
                if (!formData.categoryId) {
                    setError('Veuillez sélectionner une catégorie');
                    return false;
                }
                return true;

            case 'filtres':
                return true; // Optionnel

            case 'adresse':
                if (!formData.adresse.trim()) {
                    setError('L\'adresse est requise');
                    return false;
                }
                if (!formData.codePostal || !/^\d{5}$/.test(formData.codePostal)) {
                    setError('Code postal invalide (5 chiffres)');
                    return false;
                }
                if (!formData.ville.trim()) {
                    setError('La ville est requise');
                    return false;
                }
                return true;

            case 'photos':
                return true; // Optionnel

            case 'horaires':
                return true; // Optionnel

            default:
                return true;
        }
    };

    const goToStep = (index) => {
        // On ne peut revenir en arrière que sur les étapes déjà complétées
        if (index < currentStep) {
            setCurrentStep(index);
            setError(null);
        }
    };

    const nextStep = () => {
        if (validateCurrentStep()) {
            if (currentStep < steps.length - 1) {
                setCurrentStep(prev => prev + 1);
            }
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
            setError(null);
        }
    };

    // ==================== SOUMISSION ====================
    const handleSubmit = async (e) => {
        e.preventDefault();

        const currentStepId = steps[currentStep]?.id;
        console.log('📋 handleSubmit appelé:', {
            currentStep,
            stepsLength: steps.length,
            currentStepId,
            isEditMode,
            fiche: fiche ? fiche.id : null
        });

        // Vérifier qu'on est bien à l'étape HORAIRES (dernière étape)
        if (currentStepId !== 'horaires') {
            console.log('⚠️ Pas à l\'étape horaires, navigation vers étape suivante');
            nextStep();
            return;
        }

        console.log('✅ Étape horaires, soumission du formulaire');

        if (!validateCurrentStep()) return;

        if (!siretValidated && !isEditMode) {
            setError('Veuillez d\'abord valider votre SIRET');
            return;
        }

        if (apeNotSupported) {
            setError('Votre code APE n\'est pas supporté. Veuillez nous contacter.');
            return;
        }

        if (!formData.categoryId) {
            setError('Veuillez sélectionner une catégorie');
            return;
        }

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
                const prestataireId = fiche ? fiche.id : result.data.id;

                // Sauvegarder les filtres (même si vide, pour supprimer les anciens)
                try {
                    await fetch(`${import.meta.env.VITE_API_URL}/filtres/prestataire/${prestataireId}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        },
                        body: JSON.stringify({ filtreIds: selectedFilters })
                    });
                    console.log('✅ Filtres sauvegardés:', selectedFilters);
                } catch (filterError) {
                    console.error('Erreur sauvegarde filtres:', filterError);
                }

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

    const getCategoryImage = (categoryName) => {
        return categoryImages[categoryName] || modeImg;
    };

    const openGoogleMapsForCoords = () => {
        const { adresse, codePostal, ville } = formData;
        const query = encodeURIComponent(`${adresse} ${codePostal} ${ville}`);
        window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
    };

    const getApeLabel = (code) => {
        const apeLabels = {
            '56.10A': 'Restauration traditionnelle',
            '56.10B': 'Cafétérias et autres libres-services',
            '56.10C': 'Restauration de type rapide',
            '56.30Z': 'Débits de boissons',
            '47.71Z': 'Commerce de détail d\'habillement',
            '47.72A': 'Commerce de détail de la chaussure',
            '96.02A': 'Coiffure',
            '96.02B': 'Soins de beauté',
            '55.10Z': 'Hôtels et hébergement similaire',
            '93.13Z': 'Activités des centres de culture physique',
            '47.41Z': 'Commerce de détail d\'ordinateurs',
        };
        return apeLabels[code] || code;
    };

    if (!isOpen) return null;

    const jours = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
    const categoriesToShow = filteredCategories.length > 0 ? filteredCategories : categories;
    const currentStepData = steps[currentStep];

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="fiche-form-modal" onClick={e => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}>
                    <IonIcon icon={closeOutline} />
                </button>

                <h2>{fiche ? 'Modifier la fiche' : 'Nouvelle fiche commerce'}</h2>

                {/* ==================== STEPPER ==================== */}
                <div className="stepper-container">
                    <div className="stepper-progress">
                        <div
                            className="stepper-progress-bar"
                            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                        />
                    </div>

                    <div className="stepper-info">
                        <span className="stepper-count">Étape {currentStep + 1}/{steps.length}</span>
                        <span className="stepper-title">{currentStepData.title}</span>
                    </div>

                    <div className="stepper-dots">
                        {steps.map((step, index) => (
                            <div
                                key={step.id}
                                className={`stepper-dot ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
                                onClick={() => goToStep(index)}
                                title={step.title}
                            >
                                {index < currentStep ? (
                                    <IonIcon icon={checkmarkOutline} />
                                ) : (
                                    <span>{index + 1}</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {error && (
                    <div className="error-message">
                        <IonIcon icon={alertCircleOutline} />
                        {error}
                    </div>
                )}

                <div className="modal-content-scroll" ref={modalContentRef}>
                    <form
                        onSubmit={(e) => e.preventDefault()}
                        onKeyDown={(e) => {
                            // Intercepter la touche Entrée
                            if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
                                e.preventDefault();
                                if (currentStepData.id === 'horaires') {
                                    handleSubmit({ preventDefault: () => { } });
                                } else if (validateCurrentStep()) {
                                    nextStep();
                                }
                            }
                        }}
                    >

                        {/* ==================== ÉTAPE SIRET ==================== */}
                        {currentStepData.id === 'siret' && (
                            <div className="tab-content">
                                <div className="siret-intro">
                                    <div className="siret-iconfiche">
                                        <IonIcon icon={businessOutline} />
                                    </div>
                                    <h3>Identifiez votre établissement</h3>
                                    <p>Entrez votre numéro SIRET pour récupérer automatiquement les informations de votre entreprise.</p>
                                </div>

                                <div className="form-group siret-input-group">
                                    <label>Numéro SIRET *</label>
                                    <div className="siret-input-wrapper">
                                        <input
                                            type="text"
                                            value={siretInput}
                                            onChange={handleSiretChange}
                                            placeholder="XXX XXX XXX XXXXX"
                                            maxLength={17}
                                            disabled={siretValidated}
                                        />
                                        {siretValidated && (
                                            <div className="siret-validated-icon">
                                                <IonIcon icon={checkmarkCircleOutline} />
                                            </div>
                                        )}
                                    </div>
                                    <small className="help-text">14 chiffres - Trouvez-le sur vos documents officiels ou sur societe.com</small>
                                </div>

                                {!siretValidated ? (
                                    <button
                                        type="button"
                                        className="btn-validate-siret"
                                        onClick={validateSiret}
                                        disabled={siretLoading || siretInput.replace(/\s/g, '').length !== 14}
                                    >
                                        {siretLoading ? (
                                            <>
                                                <div className="spinner-small"></div>
                                                Vérification en cours...
                                            </>
                                        ) : (
                                            <>
                                                <IonIcon icon={searchOutline} />
                                                Valider le SIRET
                                            </>
                                        )}
                                    </button>
                                ) : (
                                    <>
                                        <div className="entreprise-data">
                                            <div className="entreprise-header">
                                                <IonIcon icon={checkmarkCircleOutline} />
                                                <span>Établissement identifié</span>
                                            </div>

                                            <div className="entreprise-info-grid">
                                                <div className="entreprise-info-item">
                                                    <span className="label">Raison sociale</span>
                                                    <span className="value">{entrepriseData?.raisonSociale || '-'}</span>
                                                </div>
                                                <div className="entreprise-info-item">
                                                    <span className="label">SIREN</span>
                                                    <span className="value">{entrepriseData?.siren || '-'}</span>
                                                </div>
                                                <div className="entreprise-info-item">
                                                    <span className="label">Code APE</span>
                                                    <span className="value">
                                                        {entrepriseData?.codeApe || '-'}
                                                        {entrepriseData?.codeApe && (
                                                            <small className="ape-label">{getApeLabel(entrepriseData.codeApe)}</small>
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="entreprise-info-item">
                                                    <span className="label">Forme juridique</span>
                                                    <span className="value">{entrepriseData?.formeJuridique || '-'}</span>
                                                </div>
                                            </div>

                                            <div className="entreprise-lock-notice">
                                                <IonIcon icon={lockClosedOutline} />
                                                <span>Ces informations ne sont pas modifiables</span>
                                            </div>
                                        </div>

                                        {apeNotSupported && (
                                            <div className="ape-not-supported">
                                                <div className="ape-not-supported-icon">
                                                    <IonIcon icon={warningOutline} />
                                                </div>
                                                <h4>Code APE non pris en charge</h4>
                                                <p>
                                                    Votre code APE <strong>{entrepriseData?.codeApe}</strong> ne correspond à aucune
                                                    de nos catégories actuelles.
                                                </p>
                                                <p>
                                                    Si vous pensez que votre activité devrait être acceptée,
                                                    n'hésitez pas à nous contacter :
                                                </p>
                                                <a
                                                    href={`mailto:contact@applitwo.com?subject=Demande d'ajout code APE&body=Bonjour,%0A%0AJe souhaite créer une fiche commerce mais mon code APE n'est pas pris en charge.%0A%0ASIRET: ${entrepriseData?.siret}%0ACode APE: ${entrepriseData?.codeApe}%0ARaison sociale: ${entrepriseData?.raisonSociale}%0A%0AMerci de votre retour.`}
                                                    className="btn-contact-email"
                                                >
                                                    <IonIcon icon={mailOutline} />
                                                    Nous contacter par email
                                                </a>
                                                <small>contact@applitwo.com</small>
                                            </div>
                                        )}

                                        <button
                                            type="button"
                                            className="btn-change-siret"
                                            onClick={resetSiret}
                                        >
                                            Utiliser un autre SIRET
                                        </button>
                                    </>
                                )}
                            </div>
                        )}

                        {/* ==================== ÉTAPE INFOS ==================== */}
                        {currentStepData.id === 'infos' && (
                            <div className="tab-content">
                                {entrepriseData && (
                                    <div className="entreprise-summary">
                                        <div className="entreprise-summary-item">
                                            <IonIcon icon={businessOutline} />
                                            <span>{entrepriseData.raisonSociale}</span>
                                        </div>
                                        <div className="entreprise-summary-item">
                                            <span className="ape-badge">{entrepriseData.codeApe}</span>
                                        </div>
                                    </div>
                                )}

                                <div className="form-group">
                                    <label>Nom du commerce *</label>
                                    <input
                                        type="text"
                                        name="nomCommerce"
                                        value={formData.nomCommerce}
                                        onChange={handleChange}
                                        placeholder="Ex: Boulangerie du Centre"
                                        autoComplete="organization"
                                        autoCapitalize="words"
                                        autoCorrect="on"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Type *</label>
                                    <select
                                        name="typeCommerce"
                                        value={formData.typeCommerce}
                                        onChange={handleChange}
                                    >
                                        <option value="">Sélectionner...</option>
                                        {typesCommerce.map(type => (
                                            <option key={type.value} value={type.value}>
                                                {type.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>
                                        Catégorie *
                                        {filteredCategories.length > 0 && filteredCategories.length < categories.length && (
                                            <span className="category-filter-info">
                                                ({filteredCategories.length} disponible{filteredCategories.length > 1 ? 's' : ''} pour votre activité)
                                            </span>
                                        )}
                                    </label>

                                    {apeNotSupported ? (
                                        <div className="ape-not-supported-inline">
                                            <IonIcon icon={warningOutline} />
                                            <span>Aucune catégorie disponible pour votre code APE</span>
                                        </div>
                                    ) : (
                                        <div className="category-cards">
                                            {categoriesToShow.map(cat => (
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
                                    )}
                                </div>

                                <div className="form-group">
                                    <label>Description courte</label>
                                    <textarea
                                        name="descriptionCourte"
                                        value={formData.descriptionCourte}
                                        onChange={handleChange}
                                        rows={3}
                                        placeholder="Décrivez votre commerce..."
                                        autoComplete="on"
                                        autoCapitalize="sentences"
                                        autoCorrect="on"
                                        spellCheck={true}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>
                                        <IonIcon icon={globeOutline} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                                        Site web
                                    </label>
                                    <input
                                        type="url"
                                        name="website"
                                        value={formData.website}
                                        onChange={handleChange}
                                        placeholder="https://www.moncommerce.fr"
                                        autoComplete="url"
                                        autoCapitalize="off"
                                        autoCorrect="off"
                                    />
                                    <small className="help-text">Optionnel - L'adresse de votre site internet</small>
                                </div>
                            </div>
                        )}

                        {/* ==================== ÉTAPE FILTRES ==================== */}
                        {currentStepData.id === 'filtres' && (
                            <div className="tab-content">
                                <div className="step-intro">
                                    <div className="step-intro-icon">
                                        <IonIcon icon={optionsOutline} />
                                    </div>
                                    <h3>Services et caractéristiques</h3>
                                    <p>Sélectionnez les options qui correspondent à votre commerce pour aider les clients à vous trouver.</p>
                                </div>

                                {loadingFilters ? (
                                    <div className="loading-filters">
                                        <div className="spinner-small"></div>
                                        <span>Chargement des filtres...</span>
                                    </div>
                                ) : availableFilters.length === 0 ? (
                                    <div className="no-filters">
                                        <IonIcon icon={optionsOutline} />
                                        <p>Aucun filtre disponible pour cette catégorie.</p>
                                        <span>Vous pouvez passer à l'étape suivante.</span>
                                    </div>
                                ) : (
                                    <>
                                        <div className="filters-count">
                                            {selectedFilters.length} option{selectedFilters.length > 1 ? 's' : ''} sélectionnée{selectedFilters.length > 1 ? 's' : ''}
                                        </div>

                                        <div className="filters-grid">
                                            {availableFilters.map(filtre => (
                                                <div
                                                    key={filtre.id}
                                                    className={`filter-chip ${selectedFilters.includes(filtre.id) ? 'selected' : ''}`}
                                                    onClick={() => toggleFilter(filtre.id)}
                                                >
                                                    {filtre.icon && <span className="filter-icon">{filtre.icon}</span>}
                                                    <span className="filter-name">{filtre.nom}</span>
                                                    {selectedFilters.includes(filtre.id) && (
                                                        <IonIcon icon={checkmarkOutline} className="filter-check" />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        {/* ==================== ÉTAPE ADRESSE ==================== */}
                        {currentStepData.id === 'adresse' && (
                            <div className="tab-content">
                                <div className="form-group">
                                    <label>Adresse *</label>
                                    <input
                                        type="text"
                                        name="adresse"
                                        value={formData.adresse}
                                        onChange={handleChange}
                                        placeholder="123 Rue..."
                                        autoComplete="street-address"
                                        autoCapitalize="words"
                                        autoCorrect="on"
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
                                            pattern="[0-9]{5}"
                                            placeholder="75001"
                                            autoComplete="postal-code"
                                            inputMode="numeric"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Ville *</label>
                                        <input
                                            type="text"
                                            name="ville"
                                            value={formData.ville}
                                            onChange={handleChange}
                                            placeholder="Paris"
                                            autoComplete="address-level2"
                                            autoCapitalize="words"
                                            autoCorrect="on"
                                        />
                                    </div>
                                </div>

                                <div className="form-section-title">
                                    <IonIcon icon={locationOutline} />
                                    Géolocalisation
                                </div>

                                <div className="geo-status">
                                    {geoLoading && (
                                        <div className="geo-loading">
                                            <div className="spinner-small"></div>
                                            <span>Géolocalisation automatique en cours...</span>
                                        </div>
                                    )}
                                    {geoStatus === 'success' && !manualGeoEdit && (
                                        <div className="geo-success">
                                            <IonIcon icon={checkmarkCircleOutline} />
                                            <span>Coordonnées trouvées automatiquement</span>
                                        </div>
                                    )}
                                    {geoStatus === 'error' && (
                                        <div className="geo-error">
                                            <IonIcon icon={alertCircleOutline} />
                                            <span>Géolocalisation automatique échouée</span>
                                        </div>
                                    )}
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Latitude</label>
                                        <input
                                            type="text"
                                            name="latitude"
                                            value={formData.latitude}
                                            onChange={handleChange}
                                            placeholder="Ex: 48.856614"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Longitude</label>
                                        <input
                                            type="text"
                                            name="longitude"
                                            value={formData.longitude}
                                            onChange={handleChange}
                                            placeholder="Ex: 2.352222"
                                        />
                                    </div>
                                </div>

                                <div className="geo-actions">
                                    <button
                                        type="button"
                                        className="btn-geo"
                                        onClick={geocodeAddress}
                                        disabled={geoLoading || !formData.adresse || !formData.ville}
                                    >
                                        <IonIcon icon={refreshOutline} />
                                        Recalculer
                                    </button>
                                    <button
                                        type="button"
                                        className="btn-geo secondary"
                                        onClick={openGoogleMapsForCoords}
                                        disabled={!formData.adresse || !formData.ville}
                                    >
                                        <IonIcon icon={locationOutline} />
                                        Google Maps
                                    </button>
                                </div>

                                <small className="help-text geo-help">
                                    💡 Les coordonnées sont calculées automatiquement à partir de l'adresse.
                                    Si le résultat n'est pas précis, vous pouvez les modifier manuellement
                                    ou utiliser Google Maps pour trouver les coordonnées exactes.
                                </small>

                                <div className="form-group" style={{ marginTop: '15px' }}>
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

                        {/* ==================== ÉTAPE PHOTOS ==================== */}
                        {currentStepData.id === 'photos' && (
                            <div className="tab-content">
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

                        {/* ==================== ÉTAPE HORAIRES ==================== */}
                        {currentStepData.id === 'horaires' && (
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

                        {/* ==================== FOOTER NAVIGATION ==================== */}
                        <div className="form-actions">
                            {currentStep === 0 ? (
                                <button type="button" className="btn-secondary" onClick={onClose}>
                                    Annuler
                                </button>
                            ) : (
                                <button type="button" className="btn-secondary" onClick={prevStep}>
                                    <IonIcon icon={arrowBackOutline} />
                                    Précédent
                                </button>
                            )}

                            <button
                                type="button"
                                className="btn-primary"
                                onClick={() => {
                                    if (currentStepData.id === 'horaires') {
                                        // Dernière étape: soumettre
                                        handleSubmit({ preventDefault: () => { } });
                                    } else {
                                        // Pas dernière étape: naviguer
                                        nextStep();
                                    }
                                }}
                                disabled={
                                    (currentStepData.id === 'siret' && (!siretValidated || apeNotSupported)) ||
                                    (currentStepData.id === 'horaires' && (loading || apeNotSupported))
                                }
                            >
                                {currentStepData.id === 'horaires' ? (
                                    loading ? 'Enregistrement...' : (fiche ? 'Modifier' : 'Créer la fiche')
                                ) : (
                                    <>
                                        Suivant
                                        <IonIcon icon={arrowForwardOutline} />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default FicheFormModal;