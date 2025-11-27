import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import PrestataireService from '../../Services/Prestataire.services';

// Position par défaut : Centre de la France
const DEFAULT_CENTER = [46.603354, 1.888334];
const DEFAULT_ZOOM = 6;
const USER_ZOOM = 12;

const Maps = () => {
    const navigate = useNavigate();
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markersRef = useRef([]);

    const [prestataires, setPrestataires] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userLocation, setUserLocation] = useState(null);
    const [mapReady, setMapReady] = useState(false);
    const [isZooming, setIsZooming] = useState(false);

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

    // Grouper les prestataires par ville (nom normalisé)
    // Utilise la MOYENNE des coordonnées pour chaque ville
    const groupByVille = useCallback((prestataires) => {
        const groups = {};

        prestataires.forEach(p => {
            // Normaliser le nom de ville (minuscule, sans accents, trim)
            const villeNormalisee = p.ville
                .toLowerCase()
                .trim()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '');

            if (!groups[villeNormalisee]) {
                groups[villeNormalisee] = {
                    ville: p.ville, // Garder le nom original pour l'affichage
                    villeNormalisee: villeNormalisee,
                    latitudes: [],
                    longitudes: [],
                    prestataires: []
                };
            }

            // Ajouter les coordonnées pour calculer la moyenne
            if (p.latitude && p.longitude) {
                groups[villeNormalisee].latitudes.push(parseFloat(p.latitude));
                groups[villeNormalisee].longitudes.push(parseFloat(p.longitude));
            }
            groups[villeNormalisee].prestataires.push(p);
        });

        // Calculer les coordonnées moyennes pour chaque ville
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
        }).filter(g => g.lat !== 0 && g.lng !== 0); // Exclure les villes sans coordonnées
    }, []);

    // Calculer les clusters visuels basés sur le zoom
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

    // Créer l'icône du marker
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

        const html = `
            <div class="map-marker ${isHovered ? 'hovered' : ''}" style="
                width: ${finalSize}px;
                height: ${finalSize}px;
                background: ${gradient};
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 4px 15px ${glowColor}, 0 0 30px ${glowColor};
                border: 3px solid rgba(255,255,255,0.9);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                cursor: pointer;
                position: relative;
            ">
                <span style="
                    color: #1a1a2e;
                    font-weight: 700;
                    font-size: ${isSingleVille ? 14 : 16}px;
                    text-shadow: 0 1px 2px rgba(255,255,255,0.5);
                ">${count}</span>
                <div class="pulse-ring" style="
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    border: 2px solid ${glowColor};
                    animation: pulse-animation 2s ease-out infinite;
                "></div>
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

        clusters.forEach(cluster => {
            const marker = L.marker([cluster.lat, cluster.lng], {
                icon: createMarkerIcon(cluster.count, cluster.isSingleVille)
            });

            marker.on('mouseover', () => {
                marker.setIcon(createMarkerIcon(cluster.count, cluster.isSingleVille, true));
            });
            marker.on('mouseout', () => {
                marker.setIcon(createMarkerIcon(cluster.count, cluster.isSingleVille, false));
            });

            marker.on('click', () => {
                if (cluster.isSingleVille) {
                    // Navigation directe, l'animation sera sur Categories
                    navigate(`/auth/categories?ville=${encodeURIComponent(cluster.villes[0])}`);

                } else {
                    // Effet d'ouverture puis zoom
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
            });

            marker.addTo(map);
            markersRef.current.push(marker);
        });
    }, [createMarkerIcon, navigate]);

    // Initialiser la carte
    useEffect(() => {
        if (!mapRef.current || mapInstanceRef.current) return;

        const map = L.map(mapRef.current, {
            center: userLocation ? [userLocation.lat, userLocation.lng] : DEFAULT_CENTER,
            zoom: userLocation ? USER_ZOOM : DEFAULT_ZOOM,
            zoomControl: false,
            attributionControl: false
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19
        }).addTo(map);

        L.control.zoom({
            position: 'bottomright'
        }).addTo(map);

        if (userLocation) {
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
            L.marker([userLocation.lat, userLocation.lng], { icon: userIcon }).addTo(map);
        }

        mapInstanceRef.current = map;
        setMapReady(true);

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [userLocation]);

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
    }, [mapReady, prestataires, groupByVille, calculateClusters, updateMarkers]);

    // Centrer sur l'utilisateur
    useEffect(() => {
        if (mapInstanceRef.current && userLocation && mapReady) {
            mapInstanceRef.current.flyTo([userLocation.lat, userLocation.lng], USER_ZOOM, {
                duration: 1.5,
                easeLinearity: 0.25
            });
        }
    }, [userLocation, mapReady]);

    return (
        <div className="maps-fullscreen">
            <div ref={mapRef} className="map-container" />

            {/* Effet zoom cluster */}
            {isZooming && (
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
                        mapInstanceRef.current?.flyTo(
                            [userLocation.lat, userLocation.lng],
                            USER_ZOOM,
                            { duration: 1 }
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