import { useState, useEffect } from 'react';
import { IonIcon } from '@ionic/react';
import { closeOutline } from 'ionicons/icons';
import { useAuth } from '../Utils/AuthContext';
import QRCode from 'qrcode';

const QRCodeModal = ({ isOpen, onClose }) => {
    const { user } = useAuth();
    const [qrCodeUrl, setQrCodeUrl] = useState('');

    useEffect(() => {
        if (isOpen && user?.client?.qrCode) {
            generateQRCode(user.client.qrCode);
        }
    }, [isOpen, user]);

    const generateQRCode = async (qrCodeData) => {
        try {
            const url = await QRCode.toDataURL(qrCodeData, {
                width: 300,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                }
            });
            setQrCodeUrl(url);
        } catch (error) {
            console.error('Erreur génération QR Code:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="qrcode-modal-overlay" onClick={onClose}>
            <div className="qrcode-modal" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}>
                    <IonIcon icon={closeOutline} />
                </button>

                <div className="modal-header">
                    <h2 className="modal-title">Mon QR Code</h2>
                    <p className="modal-subtitle">Scannez ce code pour valider vos avantages</p>
                </div>

                <div className="qrcode-container">
                    {qrCodeUrl ? (
                        <>
                            <div className="qrcode-wrapper">
                                <img src={qrCodeUrl} alt="QR Code" className="qrcode-image" />
                            </div>
                            <div className="qrcode-info">
                                <p className="qrcode-id">ID: {user?.client?.qrCode}</p>
                                <p className="qrcode-name">{user?.client?.prenom} {user?.client?.nom}</p>
                            </div>
                        </>
                    ) : (
                        <div className="loading-qr">
                            <div className="spinner"></div>
                            <p>Génération du QR Code...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QRCodeModal;