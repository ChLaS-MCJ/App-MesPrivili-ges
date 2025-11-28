// components/ScanModal.jsx
import { useState, useEffect, useRef } from 'react';
import { IonIcon } from '@ionic/react';
import {
    closeOutline,
    flashOutline,
    flashOffOutline,
    checkmarkCircle,
    alertCircle,
    storefrontOutline,
    locationOutline,
    pricetagOutline
} from 'ionicons/icons';
import { Html5Qrcode } from 'html5-qrcode';
import ScanService from '../Services/Scan.services';

const ScanModal = ({ isOpen, onClose }) => {
    const [step, setStep] = useState('loading'); // loading, select-fiche, scan, success, error
    const [fiches, setFiches] = useState([]);
    const [selectedFiche, setSelectedFiche] = useState(null);
    const [scannedQrCode, setScannedQrCode] = useState(null);
    const [scanResult, setScanResult] = useState(null);
    const [error, setError] = useState(null);
    const [isFlashOn, setIsFlashOn] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const scannerRef = useRef(null);
    const html5QrCodeRef = useRef(null);
    const selectedFicheRef = useRef(null); // Ref pour accéder à selectedFiche dans les callbacks
    const isScannerRunning = useRef(false); // Track si le scanner tourne

    // Sync selectedFiche avec la ref
    useEffect(() => {
        selectedFicheRef.current = selectedFiche;
    }, [selectedFiche]);

    useEffect(() => {
        if (isOpen) {
            loadFiches();
        }

        return () => {
            stopScanner();
        };
    }, [isOpen]);

    const loadFiches = async () => {
        setStep('loading');
        try {
            const result = await ScanService.getMyFichesWithPromos();

            if (result.success) {
                // result.data contient { fiches: [...], maxFiches: ..., ... }
                const allFiches = result.data.fiches || [];

                // Filtrer les fiches qui ont une promotion active
                const fichesWithActivePromo = allFiches.filter(fiche => {
                    if (!fiche.promotions || fiche.promotions.length === 0) return false;

                    const now = new Date();
                    const activePromo = fiche.promotions.find(p =>
                        p.estActive &&
                        new Date(p.dateDebut) <= now &&
                        new Date(p.dateFin) >= now
                    );

                    // Stocker la promo active directement sur la fiche pour faciliter l'accès
                    if (activePromo) {
                        fiche.activePromo = activePromo;
                        return true;
                    }
                    return false;
                });

                setFiches(fichesWithActivePromo);

                // Si une seule fiche avec promo active, aller directement au scan
                if (fichesWithActivePromo.length === 1) {
                    const ficheToSelect = fichesWithActivePromo[0];
                    setSelectedFiche(ficheToSelect);
                    selectedFicheRef.current = ficheToSelect; // Set ref immédiatement
                    setStep('scan');
                    setTimeout(() => startScanner(), 100);
                } else if (fichesWithActivePromo.length > 1) {
                    setStep('select-fiche');
                } else {
                    setError('Aucune fiche avec une promotion active. Créez une promotion sur l\'une de vos fiches.');
                    setStep('error');
                }
            } else {
                setError(result.message || 'Erreur lors du chargement des fiches');
                setStep('error');
            }
        } catch (err) {
            console.error('Erreur chargement fiches:', err);
            setError('Erreur lors du chargement des fiches');
            setStep('error');
        }
    };

    const handleSelectFiche = (fiche) => {
        setSelectedFiche(fiche);
        selectedFicheRef.current = fiche; // Set ref immédiatement
        setStep('scan');
        setTimeout(() => startScanner(), 100);
    };

    const startScanner = async () => {
        try {
            if (!scannerRef.current) return;
            if (isScannerRunning.current) return; // Éviter double démarrage

            html5QrCodeRef.current = new Html5Qrcode("qr-scanner");

            await html5QrCodeRef.current.start(
                { facingMode: "environment" },
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                    aspectRatio: 1
                },
                onScanSuccess,
                onScanFailure
            );

            isScannerRunning.current = true;
        } catch (err) {
            console.error('Erreur démarrage scanner:', err);
            setError('Impossible d\'accéder à la caméra. Vérifiez les permissions.');
            setStep('error');
        }
    };

    const stopScanner = async () => {
        if (html5QrCodeRef.current && isScannerRunning.current) {
            try {
                await html5QrCodeRef.current.stop();
                html5QrCodeRef.current = null;
                isScannerRunning.current = false;
            } catch (err) {
                // Silencieux si le scanner n'est pas en cours
                isScannerRunning.current = false;
            }
        }
    };

    const onScanSuccess = async (decodedText) => {
        // Vibration feedback
        if (navigator.vibrate) {
            navigator.vibrate(200);
        }

        setScannedQrCode(decodedText);
        await stopScanner();

        // Utiliser la ref pour accéder à la fiche sélectionnée
        const currentFiche = selectedFicheRef.current;

        console.log('Scan success - Fiche:', currentFiche);
        console.log('Scan success - ActivePromo:', currentFiche?.activePromo);

        // Scanner avec la promo active de la fiche sélectionnée
        if (currentFiche && currentFiche.activePromo) {
            handleScan(decodedText, currentFiche.activePromo.id, currentFiche.id);
        } else {
            setError('Aucune promotion active sur cette fiche.');
            setStep('error');
        }
    };

    const onScanFailure = (error) => {
        // Silencieux - le scan continue
    };

    const handleScan = async (qrCode, promoId, prestataireId) => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await ScanService.scan(qrCode, promoId, prestataireId);

            if (result.success) {
                setScanResult(result.data);
                setStep('success');
            } else {
                setError(result.message);
                setStep('error');
            }
        } catch (err) {
            setError(err.message || 'Erreur lors du scan');
            setStep('error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRetry = () => {
        setScannedQrCode(null);
        setError(null);
        setScanResult(null);

        // Si plusieurs fiches, retourner à la sélection
        if (fiches.length > 1) {
            setSelectedFiche(null);
            selectedFicheRef.current = null;
            setStep('select-fiche');
        } else {
            setStep('scan');
            setTimeout(() => startScanner(), 100);
        }
    };

    const handleBackToFiches = async () => {
        await stopScanner();
        setSelectedFiche(null);
        selectedFicheRef.current = null;
        setScannedQrCode(null);
        setError(null);
        setStep('select-fiche');
    };

    const toggleFlash = async () => {
        if (html5QrCodeRef.current && isScannerRunning.current) {
            try {
                const track = html5QrCodeRef.current.getRunningTrackCameraCapabilities();
                if (track.torchFeature().isSupported()) {
                    await track.torchFeature().apply(!isFlashOn);
                    setIsFlashOn(!isFlashOn);
                }
            } catch (err) {
                console.error('Flash non supporté:', err);
            }
        }
    };

    const handleClose = () => {
        stopScanner();
        setStep('loading');
        setFiches([]);
        setSelectedFiche(null);
        selectedFicheRef.current = null;
        setScannedQrCode(null);
        setError(null);
        setScanResult(null);
        setIsFlashOn(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="scan-modal-overlay" onClick={handleClose}>
            <div className="scan-modal" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={handleClose}>
                    <IonIcon icon={closeOutline} />
                </button>

                {/* ÉTAPE: Loading */}
                {step === 'loading' && (
                    <div className="scan-loading">
                        <div className="spinner"></div>
                        <p>Chargement...</p>
                    </div>
                )}

                {/* ÉTAPE: Sélection de la fiche */}
                {step === 'select-fiche' && (
                    <>
                        <div className="modal-header">
                            <h2 className="modal-title">Choisir le commerce</h2>
                            <p className="modal-subtitle">Sur quel commerce voulez-vous scanner ?</p>
                        </div>

                        <div className="fiche-list">
                            {fiches.map((fiche) => (
                                <button
                                    key={fiche.id}
                                    className="fiche-select-item"
                                    onClick={() => handleSelectFiche(fiche)}
                                >
                                    <div className="fiche-select-image">
                                        {fiche.imagePrincipale ? (
                                            <img src={fiche.imagePrincipale} alt={fiche.nomCommerce} />
                                        ) : (
                                            <div className="fiche-select-no-image">
                                                <IonIcon icon={storefrontOutline} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="fiche-select-info">
                                        <h3>{fiche.nomCommerce}</h3>
                                        <p className="fiche-select-location">
                                            <IonIcon icon={locationOutline} />
                                            {fiche.ville}
                                        </p>
                                        {fiche.activePromo && (
                                            <p className="fiche-select-promo">
                                                <IonIcon icon={pricetagOutline} />
                                                {fiche.activePromo.titre}
                                            </p>
                                        )}
                                    </div>
                                    <div className="fiche-select-arrow">
                                        ›
                                    </div>
                                </button>
                            ))}
                        </div>
                    </>
                )}

                {/* ÉTAPE: Scanner */}
                {step === 'scan' && (
                    <>
                        <div className="modal-header">
                            <h2 className="modal-title">Scanner un client</h2>
                            {selectedFiche && (
                                <p className="modal-subtitle">
                                    {selectedFiche.nomCommerce}
                                    {selectedFiche.activePromo && (
                                        <span className="current-promo"> • {selectedFiche.activePromo.titre}</span>
                                    )}
                                </p>
                            )}
                        </div>

                        {/* Bouton retour si plusieurs fiches */}
                        {fiches.length > 1 && (
                            <button className="btn-back-fiches" onClick={handleBackToFiches}>
                                ← Changer de commerce
                            </button>
                        )}

                        <div className="scanner-container">
                            <div id="qr-scanner" ref={scannerRef} className="scanner-view"></div>

                            <div className="scanner-overlay">
                                <div className="scanner-frame">
                                    <div className="corner top-left"></div>
                                    <div className="corner top-right"></div>
                                    <div className="corner bottom-left"></div>
                                    <div className="corner bottom-right"></div>
                                </div>
                            </div>

                            <button className="flash-btn" onClick={toggleFlash}>
                                <IonIcon icon={isFlashOn ? flashOutline : flashOffOutline} />
                            </button>
                        </div>

                        <p className="scan-instruction">
                            Pointez la caméra vers le QR code du client
                        </p>
                    </>
                )}

                {/* ÉTAPE: Succès */}
                {step === 'success' && (
                    <div className="result-container success">
                        <div className="result-icon">
                            <IonIcon icon={checkmarkCircle} />
                        </div>
                        <h2>Scan réussi !</h2>
                        {scanResult && (
                            <div className="scan-details">
                                <p className="client-name">
                                    {scanResult.client?.prenom} {scanResult.client?.nom}
                                </p>
                                {selectedFiche && (
                                    <p className="commerce-name">
                                        {selectedFiche.nomCommerce}
                                    </p>
                                )}
                                <p className="promo-applied">
                                    Promotion: {scanResult.promotion?.titre || selectedFiche?.activePromo?.titre}
                                </p>
                            </div>
                        )}
                        <div className="result-actions">
                            <button className="btn-primary" onClick={handleRetry}>
                                Nouveau scan
                            </button>
                            <button className="btn-secondary" onClick={handleClose}>
                                Fermer
                            </button>
                        </div>
                    </div>
                )}

                {/* ÉTAPE: Erreur */}
                {step === 'error' && (
                    <div className="result-container error">
                        <div className="result-icon">
                            <IonIcon icon={alertCircle} />
                        </div>
                        <h2>Erreur</h2>
                        <p className="error-message">{error}</p>
                        <div className="result-actions">
                            <button className="btn-primary" onClick={handleRetry}>
                                Réessayer
                            </button>
                            <button className="btn-secondary" onClick={handleClose}>
                                Fermer
                            </button>
                        </div>
                    </div>
                )}

                {isLoading && (
                    <div className="loading-overlay">
                        <div className="spinner"></div>
                        <p>Traitement en cours...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ScanModal;