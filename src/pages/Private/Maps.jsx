import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import PrestataireService from '../../Services/Prestataire.services';

// Position par défaut : Centre de la France
const DEFAULT_CENTER = [46.603354, 1.888334];
const DEFAULT_ZOOM = 6;
const USER_ZOOM = 10;

// Seuils de zoom pour l'affichage
const ZOOM_INDIVIDUAL = 13; // À partir de ce zoom, afficher chaque commerce
const ZOOM_VILLE = 10;      // À partir de ce zoom, afficher par ville

// Détecter si c'est un appareil tactile
const isTouchDevice = () => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

// Détecter si c'est un mobile (pour réduire les animations)
const isMobile = () => {
    return window.innerWidth <= 768 || isTouchDevice();
};

const Maps = () => {
    const navigate = useNavigate();
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markersRef = useRef([]);
    const userMarkerRef = useRef(null);
    const tileLayerRef = useRef(null);
    const sheetRef = useRef(null);

    const [prestataires, setPrestataires] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userLocation, setUserLocation] = useState(null);
    const [mapReady, setMapReady] = useState(false);
    const [isZooming, setIsZooming] = useState(false);
    const [markersVersion, setMarkersVersion] = useState(0);
    const [tilesLoaded, setTilesLoaded] = useState(false);
    const [isZoomingTiles, setIsZoomingTiles] = useState(false);

    // State pour le bottom sheet
    const [selectedPrestataire, setSelectedPrestataire] = useState(null);
    
    // State pour le swipe
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState(0);
    const dragStartY = useRef(0);
    const dragCurrentY = useRef(0);

    // Charger les prestataires
    useEffect(() => {
        const fetchPrestataires = async () => {
            try {
                const result = await PrestataireService.getAll({ limit: 1000 });
                if (result.success) {
                    setPrestataires(result.data.prestataires || []);
                }
            } catch (error) {
                console.error('Erreur chargement prestataires:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPrestataires();
    }, []);

    // Géolocalisation
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                (error) => {
                    console.log('Géolocalisation refusée:', error);
                    setUserLocation(null);
                },
                { enableHighAccuracy: true, timeout: 10000 }
            );
        }
    }, []);

    // Fermer le bottom sheet au clic sur la carte
    useEffect(() => {
        if (!mapInstanceRef.current || !mapReady) return;

        const map = mapInstanceRef.current;

        const handleMapClick = () => {
            setSelectedPrestataire(null);
        };

        map.on('click', handleMapClick);

        return () => {
            map.off('click', handleMapClick);
        };
    }, [mapReady]);

    // Gestion du swipe pour fermer le sheet
    const handleTouchStart = useCallback((e) => {
        if (!sheetRef.current) return;
        
        const touch = e.touches[0];
        dragStartY.current = touch.clientY;
        dragCurrentY.current = touch.clientY;
        setIsDragging(true);
    }, []);

    const handleTouchMove = useCallback((e) => {
        if (!isDragging) return;
        
        const touch = e.touches[0];
        dragCurrentY.current = touch.clientY;
        const diff = dragCurrentY.current - dragStartY.current;
        
        // Seulement vers le bas
        if (diff > 0) {
            setDragOffset(diff);
        }
    }, [isDragging]);

    const handleTouchEnd = useCallback(() => {
        if (!isDragging) return;
        
        setIsDragging(false);
        
        // Si on a glissé de plus de 100px, fermer le sheet
        if (dragOffset > 100) {
            setSelectedPrestataire(null);
        }
        
        setDragOffset(0);
    }, [isDragging, dragOffset]);

    // Grouper les prestataires par ville
    const groupByVille = useCallback((prestataires) => {
        const groups = {};

        prestataires.forEach(p => {
            const villeNormalisee = p.ville
                .toLowerCase()
                .trim()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '');

            if (!groups[villeNormalisee]) {
                groups[villeNormalisee] = {
                    ville: p.ville,
                    villeNormalisee: villeNormalisee,
                    latitudes: [],
                    longitudes: [],
                    prestataires: []
                };
            }

            if (p.latitude && p.longitude) {
                groups[villeNormalisee].latitudes.push(parseFloat(p.latitude));
                groups[villeNormalisee].longitudes.push(parseFloat(p.longitude));
            }
            groups[villeNormalisee].prestataires.push(p);
        });

        return Object.values(groups).map(group => {
            const lat = group.latitudes.length > 0
                ? group.latitudes.reduce((a, b) => a + b, 0) / group.latitudes.length
                : 0;
            const lng = group.longitudes.length > 0
                ? group.longitudes.reduce((a, b) => a + b, 0) / group.longitudes.length
                : 0;

            return {
                ville: group.ville,
                lat: lat,
                lng: lng,
                prestataires: group.prestataires
            };
        }).filter(g => g.lat !== 0 && g.lng !== 0);
    }, []);

    // Calculer les clusters/markers selon le niveau de zoom
    const calculateMarkers = useCallback((prestataires, villeGroups, zoom) => {
        // ZOOM ÉLEVÉ (>= 14) : Afficher chaque commerce individuellement
        if (zoom >= ZOOM_INDIVIDUAL) {
            return prestataires
                .filter(p => p.latitude && p.longitude)
                .map(p => ({
                    lat: parseFloat(p.latitude),
                    lng: parseFloat(p.longitude),
                    count: 1,
                    prestataires: [p],
                    villes: [p.ville],
                    isSingleVille: true,
                    isIndividual: true,
                    prestataire: p
                }));
        }

        // ZOOM MOYEN (>= 10) : Un marker par ville
        if (zoom >= ZOOM_VILLE) {
            return villeGroups.map(g => ({
                ...g,
                count: g.prestataires.length,
                villes: [g.ville],
                isSingleVille: true,
                isIndividual: false
            }));
        }

        // ZOOM FAIBLE (< 10) : Clusters de villes proches
        const clusters = [];
        const used = new Set();
        const clusterDistance = Math.pow(2, 10 - zoom) * 0.1;

        villeGroups.forEach((group, i) => {
            if (used.has(i)) return;

            const cluster = {
                lat: group.lat,
                lng: group.lng,
                prestataires: [...group.prestataires],
                villes: [group.ville],
                count: group.prestataires.length,
                isSingleVille: false,
                isIndividual: false
            };

            villeGroups.forEach((other, j) => {
                if (i === j || used.has(j)) return;

                const distance = Math.sqrt(
                    Math.pow(group.lat - other.lat, 2) +
                    Math.pow(group.lng - other.lng, 2)
                );

                if (distance < clusterDistance) {
                    cluster.prestataires.push(...other.prestataires);
                    cluster.villes.push(other.ville);
                    cluster.count += other.prestataires.length;
                    cluster.lat = (cluster.lat + other.lat) / 2;
                    cluster.lng = (cluster.lng + other.lng) / 2;
                    used.add(j);
                }
            });

            cluster.isSingleVille = cluster.villes.length === 1;
            used.add(i);
            clusters.push(cluster);
        });

        return clusters;
    }, []);

    // Créer l'icône du marker
    const createMarkerIcon = useCallback((count, isSingleVille, isHovered = false, isIndividual = false, isSelected = false) => {
        // Marker individuel (commerce unique) - Style PIN CORAIL
        if (isIndividual) {
            const size = isSelected ? 44 : (isHovered ? 40 : 36);

            // Couleurs corail - plus vif quand sélectionné
            const gradientNormal = 'linear-gradient(135deg, #FF7F7F 0%, #FF6B6B 50%, #FF5252 100%)';
            const gradientSelected = 'linear-gradient(135deg, #FF5252 0%, #FF4040 50%, #E53935 100%)';
            const shadowColor = isSelected ? 'rgba(255, 82, 82, 0.8)' : 'rgba(255, 107, 107, 0.5)';
            const borderWidth = isSelected ? 4 : 3;
            
            // Rotation : pointe sud (-45deg) ou sud-ouest (-20deg) si sélectionné
            const rotation = isSelected ? '-20deg' : '-45deg';
            const innerRotation = isSelected ? '20deg' : '45deg';

            const html = `
                <div class="map-marker-individual ${isHovered ? 'hovered' : ''} ${isSelected ? 'selected' : ''}" style="
                    width: ${size}px;
                    height: ${size}px;
                    background: ${isSelected ? gradientSelected : gradientNormal};
                    border-radius: 50% 50% 50% 0;
                    transform: rotate(${rotation});
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 ${isSelected ? '6' : '4'}px ${isSelected ? '20' : '15'}px ${shadowColor};
                    border: ${borderWidth}px solid white;
                    cursor: pointer;
                    position: relative;
                ">
                    <div style="
                        transform: rotate(${innerRotation});
                        width: ${size * 0.4}px;
                        height: ${size * 0.4}px;
                        background: white;
                        border-radius: 50%;
                    "></div>
                </div>
            `;

            return L.divIcon({
                html,
                className: `custom-marker-icon individual ${isSelected ? 'selected' : ''}`,
                iconSize: [size, size],
                iconAnchor: [size / 2, size]
            });
        }

        // Marker cluster/ville (avec compteur)
        const size = isSingleVille ? 44 : Math.min(60, 44 + Math.log(count) * 8);
        const scale = isHovered ? 1.15 : 1;
        const finalSize = size * scale;

        let gradient, glowColor;
        if (count === 1) {
            gradient = 'linear-gradient(135deg, #FF7F7F 0%, #FF6B6B 100%)';
            glowColor = 'rgba(255, 107, 107, 0.6)';
        } else if (count <= 5) {
            gradient = 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)';
            glowColor = 'rgba(252, 182, 159, 0.6)';
        } else if (count <= 15) {
            gradient = 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)';
            glowColor = 'rgba(161, 196, 253, 0.6)';
        } else {
            gradient = 'linear-gradient(135deg, #a8edea 0%, #9ad7d4ff 100%)';
            glowColor = 'rgba(168, 237, 234, 0.6)';
        }

        const pulseRing = `
            <div class="pulse-ring" style="
                position: absolute;
                width: 100%;
                height: 100%;
                border-radius: 50%;
                border: 2px solid ${glowColor};
                animation: pulse-animation 2s ease-out infinite;
                transform: translateZ(0);
                will-change: transform, opacity;
            "></div>
        `;

        const html = `
            <div class="map-marker ${isHovered ? 'hovered' : ''}" style="
                width: ${finalSize}px;
                height: ${finalSize}px;
                background: ${gradient};
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 4px 15px ${glowColor};
                border: 3px solid rgba(255,255,255,0.9);
                cursor: pointer;
                position: relative;
                will-change: transform;
            ">
                <span style="
                    color: #1a1a2e;
                    font-weight: 700;
                    font-size: ${isSingleVille ? 14 : 16}px;
                    text-shadow: 0 1px 2px rgba(255,255,255,0.5);
                ">${count}</span>
                ${pulseRing}
            </div>
        `;

        return L.divIcon({
            html,
            className: 'custom-marker-icon',
            iconSize: [finalSize, finalSize],
            iconAnchor: [finalSize / 2, finalSize / 2]
        });
    }, []);

    // Mettre à jour les markers
    const updateMarkers = useCallback((map, markers) => {
        markersRef.current.forEach(m => map.removeLayer(m));
        markersRef.current = [];

        const isTouch = isTouchDevice();

        markers.forEach(markerData => {
            const isSelected = selectedPrestataire?.id === markerData.prestataire?.id;

            const marker = L.marker([markerData.lat, markerData.lng], {
                icon: createMarkerIcon(
                    markerData.count,
                    markerData.isSingleVille,
                    false,
                    markerData.isIndividual,
                    isSelected
                )
            });

            // Hover effect (desktop uniquement)
            if (!isTouch) {
                marker.on('mouseover', () => {
                    marker.setIcon(createMarkerIcon(
                        markerData.count,
                        markerData.isSingleVille,
                        true,
                        markerData.isIndividual,
                        isSelected
                    ));
                });
                marker.on('mouseout', () => {
                    marker.setIcon(createMarkerIcon(
                        markerData.count,
                        markerData.isSingleVille,
                        false,
                        markerData.isIndividual,
                        isSelected
                    ));
                });
            }

            const handleMarkerClick = (e) => {
                if (e.originalEvent) {
                    e.originalEvent.preventDefault();
                    e.originalEvent.stopPropagation();
                }

                // Click sur un commerce individuel → afficher le bottom sheet
                if (markerData.isIndividual && markerData.prestataire) {
                    setSelectedPrestataire(markerData.prestataire);
                    return;
                }

                // Click sur une ville unique → aller sur la page catégories de la ville
                if (markerData.isSingleVille) {
                    navigate(`/auth/categories?ville=${encodeURIComponent(markerData.villes[0])}`);
                    return;
                }

                // Click sur un cluster → zoomer
                const mobile = isMobile();

                if (mobile) {
                    const targetZoom = Math.min(map.getZoom() + 3, 16);
                    map.flyTo([markerData.lat, markerData.lng], targetZoom, {
                        duration: 0.5,
                        easeLinearity: 0.5
                    });
                } else {
                    setIsZooming(true);
                    const targetZoom = Math.min(map.getZoom() + 3, 16);

                    setTimeout(() => {
                        map.flyTo([markerData.lat, markerData.lng], targetZoom, {
                            duration: 1.2,
                            easeLinearity: 0.1
                        });
                    }, 100);

                    setTimeout(() => {
                        setIsZooming(false);
                    }, 1300);
                }
            };

            marker.on('click', handleMarkerClick);
            marker.addTo(map);
            markersRef.current.push(marker);
        });
    }, [createMarkerIcon, navigate, selectedPrestataire]);

    // Initialiser la carte
    useEffect(() => {
        if (!mapRef.current || mapInstanceRef.current) return;

        const map = L.map(mapRef.current, {
            center: DEFAULT_CENTER,
            zoom: DEFAULT_ZOOM,
            zoomControl: false,
            attributionControl: false,
            tap: true,
            tapTolerance: 15,
            zoomAnimation: false,
            markerZoomAnimation: false,
            fadeAnimation: false,
            preferCanvas: true,
            zoomSnap: 1,
            zoomDelta: 1
        });

        const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            keepBuffer: 10,
            updateWhenIdle: false,
            updateWhenZooming: true,
            tileSize: 256,
            zoomOffset: 0
        }).addTo(map);

        tileLayer.on('load', () => {
            setTilesLoaded(true);
            setIsZoomingTiles(false);
        });

        tileLayer.on('loading', () => {
            if (tilesLoaded) {
                setIsZoomingTiles(true);
            }
        });

        map.on('zoomstart', () => {
            setIsZoomingTiles(true);
        });

        map.on('zoomend', () => {
            setTimeout(() => {
                setIsZoomingTiles(false);
            }, 150);
        });

        tileLayerRef.current = tileLayer;

        L.control.zoom({
            position: 'bottomright'
        }).addTo(map);

        mapInstanceRef.current = map;
        setMapReady(true);

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, []);

    // Marker utilisateur
    useEffect(() => {
        if (!mapInstanceRef.current || !mapReady || !userLocation) return;

        const map = mapInstanceRef.current;

        if (userMarkerRef.current) {
            map.removeLayer(userMarkerRef.current);
        }

        const userIcon = L.divIcon({
            html: `
                <div style="
                    width: 20px;
                    height: 20px;
                    background: #4facfe;
                    border-radius: 50%;
                    border: 4px solid white;
                    box-shadow: 0 0 20px rgba(79, 172, 254, 0.8);
                "></div>
            `,
            className: 'user-location-marker',
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });

        userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], {
            icon: userIcon,
            interactive: false
        }).addTo(map);

        const duration = isMobile() ? 0.8 : 1.5;
        map.flyTo([userLocation.lat, userLocation.lng], USER_ZOOM, {
            duration: duration,
            easeLinearity: 0.25
        });

        const onMoveEnd = () => {
            setMarkersVersion(v => v + 1);
            map.off('moveend', onMoveEnd);
        };
        map.on('moveend', onMoveEnd);

    }, [userLocation, mapReady]);

    // Mettre à jour les markers selon le zoom ET quand selectedPrestataire change
    useEffect(() => {
        if (!mapInstanceRef.current || !mapReady || prestataires.length === 0) return;

        const map = mapInstanceRef.current;
        const villeGroups = groupByVille(prestataires);

        const updateMarkersForZoom = () => {
            const zoom = map.getZoom();
            const markers = calculateMarkers(prestataires, villeGroups, zoom);
            updateMarkers(map, markers);
        };

        updateMarkersForZoom();
        map.on('zoomend', updateMarkersForZoom);

        return () => {
            map.off('zoomend', updateMarkersForZoom);
        };
    }, [mapReady, prestataires, groupByVille, calculateMarkers, updateMarkers, markersVersion, selectedPrestataire]);

    // Aller vers la fiche du prestataire
    const handleVoirFiche = () => {
        if (selectedPrestataire) {
            navigate(`/auth/prestataire/${selectedPrestataire.id}`);
        }
    };

    // Fermer le bottom sheet
    const handleCloseSheet = () => {
        setSelectedPrestataire(null);
    };

    // Générer les étoiles pour la note
    const renderStars = (note) => {
        const stars = [];
        const numNote = parseFloat(note) || 0;
        const fullStars = Math.floor(numNote);
        const hasHalfStar = numNote % 1 >= 0.5;

        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push(<span key={i} className="star filled">★</span>);
            } else if (i === fullStars && hasHalfStar) {
                stars.push(<span key={i} className="star half">★</span>);
            } else {
                stars.push(<span key={i} className="star empty">★</span>);
            }
        }
        return stars;
    };

    // Style dynamique pour le drag
    const sheetStyle = {
        transform: selectedPrestataire 
            ? `translateY(${dragOffset}px)` 
            : 'translateY(100%)',
        transition: isDragging ? 'none' : 'transform 0.35s cubic-bezier(0.32, 0.72, 0, 1)'
    };

    return (
        <div className="maps-fullscreen">
            <div ref={mapRef} className="map-container" />

            {/* Overlay de préchargement initial */}
            <div className={`map-preload-overlay ${tilesLoaded && !loading ? 'loaded' : ''}`}>
                <div className="map-loader">
                    <div className="loader-spinner" />
                    <p>Chargement de la carte...</p>
                </div>
            </div>

            {/* Overlay pendant le zoom */}
            <div className={`map-zoom-overlay ${isZoomingTiles ? 'active' : ''}`} />

            {/* Effet zoom cluster - SEULEMENT sur desktop */}
            {isZooming && !isMobile() && (
                <div className="zoom-overlay">
                    <div className="zoom-door zoom-door-left" />
                    <div className="zoom-door zoom-door-right" />
                </div>
            )}

            {/* Bouton recentrer */}
            {userLocation && tilesLoaded && (
                <button
                    className="recenter-button"
                    onClick={() => {
                        const duration = isMobile() ? 0.5 : 1;
                        mapInstanceRef.current?.flyTo(
                            [userLocation.lat, userLocation.lng],
                            USER_ZOOM,
                            { duration }
                        );
                    }}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="3" />
                        <path d="M12 2v4m0 12v4M2 12h4m12 0h4" />
                    </svg>
                </button>
            )}

            {/* Bottom Sheet */}
            <div 
                ref={sheetRef}
                className={`map-bottom-sheet ${selectedPrestataire ? 'visible' : ''} ${isDragging ? 'dragging' : ''}`}
                style={sheetStyle}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {selectedPrestataire && (
                    <>
                        {/* Bouton fermer */}
                        <button className="sheet-close" onClick={handleCloseSheet}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Handle pour drag */}
                        <div className="sheet-handle">
                            <div className="handle-bar"></div>
                        </div>

                        <div className="sheet-content">
                            {/* Image */}
                            <div className="sheet-image">
                                {selectedPrestataire.imagePrincipale ? (
                                    <img
                                        src={selectedPrestataire.imagePrincipale}
                                        alt={selectedPrestataire.nomCommerce}
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'flex';
                                        }}
                                    />
                                ) : null}
                                <div className="image-placeholder" style={{ display: selectedPrestataire.imagePrincipale ? 'none' : 'flex' }}>
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                            </div>

                            {/* Infos */}
                            <div className="sheet-info">
                                <h3 className="sheet-title">{selectedPrestataire.nomCommerce}</h3>

                                <div className="sheet-meta">
                                    {selectedPrestataire.category && (
                                        <span className="sheet-category">
                                            {selectedPrestataire.category.nom}
                                        </span>
                                    )}
                                    <span className="sheet-city">{selectedPrestataire.ville}</span>
                                </div>

                                {selectedPrestataire.noteGlobale && parseFloat(selectedPrestataire.noteGlobale) > 0 && (
                                    <div className="sheet-rating">
                                        <div className="stars">
                                            {renderStars(parseFloat(selectedPrestataire.noteGlobale))}
                                        </div>
                                        <span className="rating-value">{parseFloat(selectedPrestataire.noteGlobale).toFixed(1)}</span>
                                        {selectedPrestataire.nombreAvis > 0 && (
                                            <span className="rating-count">({selectedPrestataire.nombreAvis} avis)</span>
                                        )}
                                    </div>
                                )}

                                {selectedPrestataire.descriptionCourte && (
                                    <p className="sheet-description">
                                        {selectedPrestataire.descriptionCourte.length > 100
                                            ? selectedPrestataire.descriptionCourte.substring(0, 100) + '...'
                                            : selectedPrestataire.descriptionCourte
                                        }
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Bouton CTA */}
                        <button className="sheet-cta" onClick={handleVoirFiche}>
                            <span>Voir la fiche</span>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </button>
                    </>
                )}
            </div>

            {/* Backdrop pour fermer le sheet */}
            {selectedPrestataire && (
                <div className="sheet-backdrop" onClick={handleCloseSheet} />
            )}
        </div>
    );
};

export default Maps;