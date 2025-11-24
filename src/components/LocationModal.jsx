import { useState, useEffect, useRef } from 'react';
import { IonIcon } from '@ionic/react';
import { 
    closeOutline, 
    locationOutline, 
    searchOutline,
    navigateOutline,
    locationSharp
} from 'ionicons/icons';
import PrestataireService from '../Services/Prestataire.services';

const LocationModal = ({ isOpen, onClose, onSelectVille }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [popularVilles, setPopularVilles] = useState([]);
    const [allVilles, setAllVilles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [geoLoading, setGeoLoading] = useState(false);
    const [error, setError] = useState('');
    const inputRef = useRef(null);

    // Charger les villes disponibles au montage
    useEffect(() => {
        if (isOpen) {
            fetchAvailableVilles();
            setSearchQuery('');
            setSuggestions([]);
            setError('');
        }
    }, [isOpen]);

    // Focus sur l'input quand la modal s'ouvre
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 300);
        }
    }, [isOpen]);

    const fetchAvailableVilles = async () => {
        try {
            setLoading(true);
            const result = await PrestataireService.getAll({ limit: 1000 });
            
            if (result.success) {
                const prestataires = result.data.prestataires || [];
                
                // Grouper par ville et compter
                const villeCount = {};
                prestataires.forEach(p => {
                    if (p.ville) {
                        if (!villeCount[p.ville]) {
                            villeCount[p.ville] = {
                                nom: p.ville,
                                count: 0,
                                codePostal: p.codePostal || '',
                                lat: parseFloat(p.latitude),
                                lng: parseFloat(p.longitude)
                            };
                        }
                        villeCount[p.ville].count++;
                    }
                });
                
                const villesList = Object.values(villeCount);
                setAllVilles(villesList);
                
                // Top 5 villes populaires
                const popular = villesList
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 5);
                setPopularVilles(popular);
            }
        } catch (error) {
            console.error('Erreur chargement villes:', error);
        } finally {
            setLoading(false);
        }
    };

    // Recherche avec debounce
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSuggestions([]);
            return;
        }

        const query = searchQuery.toLowerCase().trim();
        
        // Filtrer par nom de ville ou code postal
        const filtered = allVilles.filter(v => 
            v.nom.toLowerCase().includes(query) ||
            v.codePostal?.includes(query)
        ).slice(0, 6);

        setSuggestions(filtered);
    }, [searchQuery, allVilles]);

    // Géolocalisation
    const handleGeolocation = () => {
        if (!navigator.geolocation) {
            setError('La géolocalisation n\'est pas supportée par votre navigateur');
            return;
        }

        setGeoLoading(true);
        setError('');

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                
                // Trouver la ville la plus proche parmi les villes disponibles
                let closestVille = null;
                let minDistance = Infinity;

                allVilles.forEach(ville => {
                    const distance = Math.sqrt(
                        Math.pow(latitude - ville.lat, 2) +
                        Math.pow(longitude - ville.lng, 2)
                    );
                    if (distance < minDistance) {
                        minDistance = distance;
                        closestVille = ville;
                    }
                });

                setGeoLoading(false);

                if (closestVille) {
                    onSelectVille(closestVille.nom);
                    onClose();
                } else {
                    setError('Aucun commerce trouvé à proximité. Essayez de rechercher une ville.');
                }
            },
            (err) => {
                setGeoLoading(false);
                switch (err.code) {
                    case err.PERMISSION_DENIED:
                        setError('Localisation refusée. Veuillez rechercher une ville ci-dessous.');
                        break;
                    case err.POSITION_UNAVAILABLE:
                        setError('Position indisponible. Veuillez rechercher une ville.');
                        break;
                    case err.TIMEOUT:
                        setError('Délai dépassé. Veuillez réessayer ou rechercher une ville.');
                        break;
                    default:
                        setError('Erreur de localisation. Veuillez rechercher une ville.');
                }
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
        );
    };

    const handleSelectVille = (villeName) => {
        onSelectVille(villeName);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="location-modal-overlay" onClick={onClose}>
            <div className="location-modal" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="location-modal-header">
                    <h2>Où voulez-vous explorer ?</h2>
                    <button className="modal-close-btn" onClick={onClose}>
                        <IonIcon icon={closeOutline} />
                    </button>
                </div>

                {/* Bouton Géolocalisation */}
                <button 
                    className={`geolocation-btn ${geoLoading ? 'loading' : ''}`}
                    onClick={handleGeolocation}
                    disabled={geoLoading || loading}
                >
                    <div className="geo-btn-content">
                        <div className="geo-icon-wrapper">
                            <IonIcon icon={navigateOutline} className="geo-icon" />
                        </div>
                        <div className="geo-text">
                            <span className="geo-title">
                                {geoLoading ? 'Localisation en cours...' : 'Utiliser ma position'}
                            </span>
                            <span className="geo-subtitle">Trouver les commerces près de moi</span>
                        </div>
                    </div>
                    {geoLoading && <div className="geo-spinner" />}
                </button>

                {/* Message d'erreur */}
                {error && (
                    <div className="location-error">
                        <IonIcon icon={locationOutline} />
                        <span>{error}</span>
                    </div>
                )}

                {/* Séparateur */}
                <div className="location-divider">
                    <span>ou rechercher</span>
                </div>

                {/* Barre de recherche */}
                <div className="location-search">
                    <IonIcon icon={searchOutline} className="search-icon" />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Ville ou code postal..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Suggestions de recherche */}
                {suggestions.length > 0 && (
                    <div className="location-suggestions">
                        {suggestions.map((ville, index) => (
                            <button
                                key={index}
                                className="suggestion-item"
                                onClick={() => handleSelectVille(ville.nom)}
                            >
                                <IonIcon icon={locationSharp} className="suggestion-icon" />
                                <div className="suggestion-info">
                                    <span className="suggestion-name">{ville.nom}</span>
                                    <span className="suggestion-count">
                                        {ville.count} commerce{ville.count > 1 ? 's' : ''}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                )}

                {/* Villes populaires */}
                {!searchQuery && popularVilles.length > 0 && (
                    <div className="popular-villes">
                        <h3>Villes populaires</h3>
                        <div className="popular-list">
                            {popularVilles.map((ville, index) => (
                                <button
                                    key={index}
                                    className="popular-item"
                                    onClick={() => handleSelectVille(ville.nom)}
                                >
                                    <span className="popular-name">{ville.nom}</span>
                                    <span className="popular-badge">{ville.count}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Loading state */}
                {loading && (
                    <div className="location-loading">
                        <div className="spinner" />
                        <span>Chargement des villes...</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LocationModal;
