import { useState, useEffect, useRef } from 'react';
import { IonIcon } from '@ionic/react';
import { closeOutline } from 'ionicons/icons';
import { useAuth } from '../Utils/AuthContext';
import QRCode from 'react-qr-code';
import RatingModal from './RatingModal';
import AvisService from '../Services/Avis.services';
import Caller from '../Services/Caller.services';

const QRCodeModal = ({ isOpen, onClose }) => {
    const { user } = useAuth();
    const [showRating, setShowRating] = useState(false);
    const [scanData, setScanData] = useState(null);
    const pollingRef = useRef(null);

    const qrCodeData = user?.client?.qrCode;

    useEffect(() => {
        if (isOpen && qrCodeData) {
            startPolling();
        }

        return () => {
            stopPolling();
        };
    }, [isOpen, user]);

    const startPolling = () => {
        checkForNewScan();
        pollingRef.current = setInterval(checkForNewScan, 3000);
    };

    const stopPolling = () => {
        if (pollingRef.current) {
            clearInterval(pollingRef.current);
            pollingRef.current = null;
        }
    };

    const checkForNewScan = async () => {
        try {
            const response = await Caller.get('/scans/last-pending');

            if (response.data.success && response.data.data) {
                const scan = response.data.data;

                stopPolling();

                setScanData({
                    scanId: scan.id,
                    prestataire: scan.prestataire,
                    promotion: scan.promotion
                });
                setShowRating(true);
            }
        } catch (error) {
            console.error('Erreur polling:', error);
        }
    };

    const handleSubmitRating = async (note) => {
        if (!scanData?.scanId) return { success: false };
        const result = await AvisService.create(scanData.scanId, note);
        return result;
    };

    const handleRatingClose = () => {
        setShowRating(false);
        setScanData(null);
        onClose();
    };

    if (!isOpen) return null;

    if (showRating && scanData) {
        return (
            <RatingModal
                isOpen={true}
                onClose={handleRatingClose}
                prestataire={scanData.prestataire}
                onSubmitRating={handleSubmitRating}
            />
        );
    }

    return (
        <div className="qrcode-modal-overlay" onClick={onClose}>
            <div className="qrcode-modal" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}>
                    <IonIcon icon={closeOutline} />
                </button>

                <div className="modal-header">
                    <h2 className="modal-title">Mon QR Code</h2>
                    <p className="modal-subtitle">Présentez ce code au commerçant</p>
                </div>

                <div className="qrcode-container">
                    {qrCodeData ? (
                        <>
                            <div className="qrcode-wrapper">
                                <QRCode
                                    value={qrCodeData}
                                    size={250}
                                    level="M"
                                    bgColor="#FFFFFF"
                                    fgColor="#000000"
                                />
                            </div>
                            <div className="qrcode-info">
                                <p className="qrcode-name">{user?.client?.prenom} {user?.client?.nom}</p>
                                <p className="qrcode-waiting">En attente de scan...</p>
                            </div>
                        </>
                    ) : (
                        <div className="loading-qr">
                            <div className="spinner"></div>
                            <p>Chargement du QR Code...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QRCodeModal;