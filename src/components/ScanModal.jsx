// components/ScanModal.jsx
import { useState, useEffect, useRef } from 'react';
import { IonIcon } from '@ionic/react';
import { closeOutline, flashOutline, flashOffOutline, checkmarkCircle, alertCircle } from 'ionicons/icons';
import { Html5Qrcode } from 'html5-qrcode';
import ScanService from '../Services/Scan.services';

const ScanModal = ({ isOpen, onClose }) => {
    const [step, setStep] = useState('scan'); // scan, select-promo, success, error
    const [promotions, setPromotions] = useState([]);
    const [selectedPromo, setSelectedPromo] = useState(null);
    const [scannedQrCode, setScannedQrCode] = useState(null);
    const [scanResult, setScanResult] = useState(null);
    const [error, setError] = useState(null);
    const [isFlashOn, setIsFlashOn] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const scannerRef = useRef(null);
    const html5QrCodeRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            loadPromotions();
            startScanner();
        }

        return () => {
            stopScanner();
        };
    }, [isOpen]);

    const loadPromotions = async () => {
        try {
            const result = await ScanService.getMyPromotions();
            if (result.success) {
                // Filtrer les promotions actives
                const activePromos = result.data.filter(p => {
                    const now = new Date();
                    return p.estActive &&
                        new Date(p.dateDebut) <= now &&
                        new Date(p.dateFin) >= now;
                });
                setPromotions(activePromos);
            }
        } catch (err) {
            console.error('Erreur chargement promos:', err);
        }
    };

    const startScanner = async () => {
        try {
            if (!scannerRef.current) return;

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
        } catch (err) {
            console.error('Erreur démarrage scanner:', err);
            setError('Impossible d\'accéder à la caméra. Vérifiez les permissions.');
        }
    };

    const stopScanner = async () => {
        if (html5QrCodeRef.current) {
            try {
                await html5QrCodeRef.current.stop();
                html5QrCodeRef.current = null;
            } catch (err) {
                console.error('Erreur arrêt scanner:', err);
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

        // Si une seule promo active, scanner directement
        if (promotions.length === 1) {
            handleScan(decodedText, promotions[0].id);
        } else if (promotions.length > 1) {
            setStep('select-promo');
        } else {
            setError('Aucune promotion active. Créez une promotion d\'abord.');
            setStep('error');
        }
    };

    const onScanFailure = (error) => {
        // Silencieux - le scan continue
    };

    const handleScan = async (qrCode, promoId) => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await ScanService.scan(qrCode, promoId);

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

    const handleSelectPromo = (promo) => {
        setSelectedPromo(promo);
        handleScan(scannedQrCode, promo.id);
    };

    const handleRetry = () => {
        setStep('scan');
        setScannedQrCode(null);
        setError(null);
        setScanResult(null);
        setSelectedPromo(null);
        startScanner();
    };

    const toggleFlash = async () => {
        if (html5QrCodeRef.current) {
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
        setStep('scan');
        setScannedQrCode(null);
        setError(null);
        setScanResult(null);
        setSelectedPromo(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="scan-modal-overlay" onClick={handleClose}>
            <div className="scan-modal" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={handleClose}>
                    <IonIcon icon={closeOutline} />
                </button>

                {/* ÉTAPE 1: Scanner */}
                {step === 'scan' && (
                    <>
                        <div className="modal-header">
                            <h2 className="modal-title">Scanner un client</h2>
                            <p className="modal-subtitle">Pointez la caméra vers le QR code du client</p>
                        </div>

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

                        {promotions.length === 0 && (
                            <div className="no-promo-warning">
                                <IonIcon icon={alertCircle} />
                                <p>Aucune promotion active</p>
                            </div>
                        )}
                    </>
                )}

                {/* ÉTAPE 2: Sélection de la promotion */}
                {step === 'select-promo' && (
                    <>
                        <div className="modal-header">
                            <h2 className="modal-title">Choisir la promotion</h2>
                            <p className="modal-subtitle">Quelle promotion appliquer ?</p>
                        </div>

                        <div className="promo-list">
                            {promotions.map((promo) => (
                                <button
                                    key={promo.id}
                                    className="promo-item"
                                    onClick={() => handleSelectPromo(promo)}
                                    disabled={isLoading}
                                >
                                    <div className="promo-info">
                                        <h3>{promo.titre}</h3>
                                        <p>{promo.description}</p>
                                    </div>
                                    <div className="promo-meta">
                                        <span className="promo-uses">
                                            {promo.nombreUtilisations} utilisations
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>

                        <button className="btn-secondary" onClick={handleRetry}>
                            Annuler
                        </button>
                    </>
                )}

                {/* ÉTAPE 3: Succès */}
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
                                <p className="promo-applied">
                                    Promotion: {scanResult.promotion?.titre}
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

                {/* ÉTAPE 4: Erreur */}
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