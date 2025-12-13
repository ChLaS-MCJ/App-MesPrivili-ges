import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import PrestataireService from '../../Services/Prestataire.services';

// Position par défaut : Centre de la France
const DEFAULT_CENTER = [46.603354, 1.888334];
const DEFAULT_ZOOM = 6;
const USER_ZOOM = 12;

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

    const [prestataires, setPrestataires] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userLocation, setUserLocation] = useState(null);
    const [mapReady, setMapReady] = useState(false);
    const [isZooming, setIsZooming] = useState(false);
    const [markersVersion, setMarkersVersion] = useState(0);

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

    // Calculer les clusters
    const calculateClusters = useCallback((villeGroups, zoom) => {
        if (zoom >= 10) {
            return villeGroups.map(g => ({
                ...g,
                count: g.prestataires.length,
                villes: [g.ville],
                isSingleVille: true
            }));
        }

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
                isSingleVille: false
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

    // Créer l'icône du marker (simplifié pour mobile)
    const createMarkerIcon = useCallback((count, isSingleVille, isHovered = false) => {
        const size = isSingleVille ? 44 : Math.min(60, 44 + Math.log(count) * 8);
        const scale = isHovered ? 1.15 : 1;
        const finalSize = size * scale;

        let gradient, glowColor;
        if (count === 1) {
            gradient = 'linear-gradient(135deg, #f6c1c3ff 0%, #fac4c7ff 100%)';
            glowColor = 'rgba(255, 154, 158, 0.6)';
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

        // Pulse ring avec GPU acceleration
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
    const updateMarkers = useCallback((map, clusters) => {
        markersRef.current.forEach(m => map.removeLayer(m));
        markersRef.current = [];

        const isTouch = isTouchDevice();

        clusters.forEach(cluster => {
            const marker = L.marker([cluster.lat, cluster.lng], {
                icon: createMarkerIcon(cluster.count, cluster.isSingleVille)
            });

            if (!isTouch) {
                marker.on('mouseover', () => {
                    marker.setIcon(createMarkerIcon(cluster.count, cluster.isSingleVille, true));
                });
                marker.on('mouseout', () => {
                    marker.setIcon(createMarkerIcon(cluster.count, cluster.isSingleVille, false));
                });
            }

            const handleMarkerClick = (e) => {
                if (e.originalEvent) {
                    e.originalEvent.preventDefault();
                    e.originalEvent.stopPropagation();
                }

                if (cluster.isSingleVille) {
                    navigate(`/auth/categories?ville=${encodeURIComponent(cluster.villes[0])}`);
                } else {
                    const mobile = isMobile();

                    // Sur mobile : animation simplifiée
                    if (mobile) {
                        // Pas d'effet porte sur mobile, juste le zoom
                        const targetZoom = Math.min(map.getZoom() + 3, 14);
                        map.flyTo([cluster.lat, cluster.lng], targetZoom, {
                            duration: 0.5,  // Plus court sur mobile
                            easeLinearity: 0.5
                        });
                    } else {
                        // Sur desktop : animation complète avec les portes
                        setIsZooming(true);
                        const targetZoom = Math.min(map.getZoom() + 3, 14);

                        setTimeout(() => {
                            map.flyTo([cluster.lat, cluster.lng], targetZoom, {
                                duration: 1.2,
                                easeLinearity: 0.1
                            });
                        }, 100);

                        setTimeout(() => {
                            setIsZooming(false);
                        }, 1300);
                    }
                }
            };

            marker.on('click', handleMarkerClick);
            marker.addTo(map);
            markersRef.current.push(marker);
        });
    }, [createMarkerIcon, navigate]);

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
            // Optimisations
            preferCanvas: true,
            zoomAnimation: true,  // Animation fluide pour le zoom
            markerZoomAnimation: true,
            fadeAnimation: true   // Fade pour les tiles
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            updateWhenIdle: true,  // Met à jour seulement quand on arrête de bouger
            updateWhenZooming: false  // Pas de mise à jour pendant le zoom
        }).addTo(map);

        L.control.zoom({
            position: 'bottomright'
        }).addTo(map);

        // Intercepter les boutons +/- pour un zoom fluide
        setTimeout(() => {
            const zoomInBtn = document.querySelector('.leaflet-control-zoom-in');
            const zoomOutBtn = document.querySelector('.leaflet-control-zoom-out');

            if (zoomInBtn) {
                zoomInBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const currentZoom = map.getZoom();
                    const targetZoom = Math.min(currentZoom + 1, 19);
                    map.flyTo(map.getCenter(), targetZoom, {
                        duration: 0.3,
                        easeLinearity: 0.5
                    });
                });
            }

            if (zoomOutBtn) {
                zoomOutBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const currentZoom = map.getZoom();
                    const targetZoom = Math.max(currentZoom - 1, 1);
                    map.flyTo(map.getCenter(), targetZoom, {
                        duration: 0.3,
                        easeLinearity: 0.5
                    });
                });
            }
        }, 100);

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

        // Animation plus courte sur mobile
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

    // Mettre à jour les markers
    useEffect(() => {
        if (!mapInstanceRef.current || !mapReady || prestataires.length === 0) return;

        const map = mapInstanceRef.current;
        const villeGroups = groupByVille(prestataires);

        const updateMarkersForZoom = () => {
            const zoom = map.getZoom();
            const clusters = calculateClusters(villeGroups, zoom);
            updateMarkers(map, clusters);
        };

        updateMarkersForZoom();
        map.on('zoomend', updateMarkersForZoom);

        return () => {
            map.off('zoomend', updateMarkersForZoom);
        };
    }, [mapReady, prestataires, groupByVille, calculateClusters, updateMarkers, markersVersion]);

    return (
        <div className="maps-fullscreen">
            <div ref={mapRef} className="map-container" />

            {/* Effet zoom cluster - SEULEMENT sur desktop */}
            {isZooming && !isMobile() && (
                <div className="zoom-overlay">
                    <div className="zoom-door zoom-door-left" />
                    <div className="zoom-door zoom-door-right" />
                </div>
            )}

            {loading && (
                <div className="map-loader">
                    <div className="loader-spinner" />
                    <p>Chargement des commerces...</p>
                </div>
            )}

            {userLocation && (
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
        </div>
    );
};

export default Maps;