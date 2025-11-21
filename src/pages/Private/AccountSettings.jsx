import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Utils/AuthContext';
import {
    ArrowLeftOutlined,
    UserOutlined,
    MailOutlined,
    PhoneOutlined,
    LockOutlined,
    CameraOutlined,
    SaveOutlined,
    InfoCircleOutlined,
    GoogleOutlined,
} from '@ant-design/icons';
import { FaApple } from 'react-icons/fa';

const AccountSettings = () => {
    const { user, updateProfile, changePassword, logout } = useAuth();
    const navigate = useNavigate();

    // États pour les infos personnelles
    const [profileData, setProfileData] = useState({
        prenom: '',
        nom: '',
        email: '',
        telephone: '',
    });

    // États pour le changement de mot de passe
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    // États pour l'image de profil
    const [profileImage, setProfileImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    // États UI
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: '' });
    const [activeSection, setActiveSection] = useState('profile'); // 'profile' ou 'password'

    // Déterminer si l'utilisateur peut modifier son mot de passe
    const canChangePassword = user?.authProvider === 'local' || !user?.authProvider;

    // Déterminer le type de connexion
    const getAuthProviderInfo = () => {
        if (!user?.authProvider || user.authProvider === 'local') {
            return { name: 'Compte local', icon: <LockOutlined />, color: '#333' };
        }
        if (user.authProvider === 'google') {
            return { name: 'Google', icon: <GoogleOutlined />, color: '#4285F4' };
        }
        if (user.authProvider === 'apple') {
            return { name: 'Apple', icon: <FaApple />, color: '#000' };
        }
        return null;
    };

    const authProvider = getAuthProviderInfo();

    // Charger les données utilisateur au montage
    useEffect(() => {
        if (user) {
            setProfileData({
                prenom: user.client?.prenom || user.prenom || '',
                nom: user.client?.nom || user.nom || '',
                email: user.email || '',
                telephone: user.client?.telephone || user.telephone || '',
            });

            // Si l'utilisateur a déjà une image de profil
            if (user.profileImage) {
                setImagePreview(user.profileImage);
            }
        }
    }, [user]);

    // Gérer le changement d'image
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Vérifier la taille (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setToast({
                    show: true,
                    message: "L'image ne doit pas dépasser 5MB",
                    type: 'error',
                });
                return;
            }

            // Vérifier le type
            if (!file.type.startsWith('image/')) {
                setToast({
                    show: true,
                    message: 'Le fichier doit être une image',
                    type: 'error',
                });
                return;
            }

            setProfileImage(file);

            // Créer un aperçu
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Mettre à jour le profil
    const handleUpdateProfile = async () => {
        setLoading(true);

        try {
            // TODO: Upload de l'image si elle existe
            // Pour l'instant, on update juste les infos textuelles

            const result = await updateProfile({
                prenom: profileData.prenom,
                nom: profileData.nom,
                telephone: profileData.telephone,
            });

            if (result.success) {
                setToast({
                    show: true,
                    message: 'Profil mis à jour avec succès !',
                    type: 'success',
                });
            } else {
                setToast({
                    show: true,
                    message: result.message || 'Erreur lors de la mise à jour',
                    type: 'error',
                });
            }
        } catch (error) {
            setToast({
                show: true,
                message: 'Erreur lors de la mise à jour',
                type: 'error',
            });
        } finally {
            setLoading(false);
        }
    };

    // Changer le mot de passe
    const handleChangePassword = async () => {
        // Validation
        if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
            setToast({
                show: true,
                message: 'Veuillez remplir tous les champs',
                type: 'error',
            });
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setToast({
                show: true,
                message: 'Les mots de passe ne correspondent pas',
                type: 'error',
            });
            return;
        }

        if (passwordData.newPassword.length < 8) {
            setToast({
                show: true,
                message: 'Le mot de passe doit contenir au moins 8 caractères',
                type: 'error',
            });
            return;
        }

        // Validation du format du mot de passe
        if (!/[A-Z]/.test(passwordData.newPassword)) {
            setToast({
                show: true,
                message: 'Le mot de passe doit contenir au moins une majuscule',
                type: 'error',
            });
            return;
        }

        if (!/[a-z]/.test(passwordData.newPassword)) {
            setToast({
                show: true,
                message: 'Le mot de passe doit contenir au moins une minuscule',
                type: 'error',
            });
            return;
        }

        if (!/[0-9]/.test(passwordData.newPassword)) {
            setToast({
                show: true,
                message: 'Le mot de passe doit contenir au moins un chiffre',
                type: 'error',
            });
            return;
        }

        setLoading(true);

        try {
            const result = await changePassword(
                passwordData.currentPassword,
                passwordData.newPassword
            );

            if (result.success) {
                setToast({
                    show: true,
                    message: 'Mot de passe modifié avec succès !',
                    type: 'success',
                });

                // Réinitialiser les champs
                setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                });
            } else {
                setToast({
                    show: true,
                    message: result.message || 'Erreur lors du changement de mot de passe',
                    type: 'error',
                });
            }
        } catch (error) {
            setToast({
                show: true,
                message: 'Erreur lors du changement de mot de passe',
                type: 'error',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="account-settings-page">
            {/* Header */}
            <div className="settings-header">
                <button className="back-button" onClick={() => navigate(-1)}>
                    <ArrowLeftOutlined />
                </button>
                <h1>Mon Compte</h1>
            </div>

            <div className="settings-content">
                {/* Section image de profil */}
                <div className="profile-image-section">
                    <div className="profile-avatar">
                        <img
                            src={imagePreview || 'https://via.placeholder.com/150'}
                            alt="Profile"
                        />
                        <button
                            className="camera-button"
                            onClick={() => document.getElementById('profile-image-input').click()}
                        >
                            <CameraOutlined />
                        </button>
                    </div>

                    <input
                        type="file"
                        id="profile-image-input"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleImageChange}
                    />

                    {/* Badge du type de connexion */}
                    {authProvider && (
                        <div className="auth-provider-badge" style={{ color: authProvider.color }}>
                            {authProvider.icon}
                            <span>Connecté via {authProvider.name}</span>
                        </div>
                    )}
                </div>

                {/* Onglets */}
                <div className="section-tabs">
                    <button
                        className={`tab-button ${activeSection === 'profile' ? 'active' : ''}`}
                        onClick={() => setActiveSection('profile')}
                    >
                        <UserOutlined />
                        Informations
                    </button>
                    {canChangePassword && (
                        <button
                            className={`tab-button ${activeSection === 'password' ? 'active' : ''}`}
                            onClick={() => setActiveSection('password')}
                        >
                            <LockOutlined />
                            Mot de passe
                        </button>
                    )}
                </div>

                {/* Section Informations personnelles */}
                {activeSection === 'profile' && (
                    <div className="settings-card">
                        <h2>Mes informations</h2>

                        <div className="form-group">
                            <label>
                                <UserOutlined />
                                Prénom
                            </label>
                            <input
                                type="text"
                                value={profileData.prenom}
                                onChange={(e) =>
                                    setProfileData({ ...profileData, prenom: e.target.value })
                                }
                                placeholder="Votre prénom"
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                <UserOutlined />
                                Nom
                            </label>
                            <input
                                type="text"
                                value={profileData.nom}
                                onChange={(e) =>
                                    setProfileData({ ...profileData, nom: e.target.value })
                                }
                                placeholder="Votre nom"
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                <MailOutlined />
                                Email
                            </label>
                            <input
                                type="email"
                                value={profileData.email}
                                disabled
                                className="disabled-input"
                            />
                            <small className="helper-text">
                                <InfoCircleOutlined /> L'email ne peut pas être modifié
                            </small>
                        </div>

                        <div className="form-group">
                            <label>
                                <PhoneOutlined />
                                Téléphone
                            </label>
                            <input
                                type="tel"
                                value={profileData.telephone}
                                onChange={(e) =>
                                    setProfileData({ ...profileData, telephone: e.target.value })
                                }
                                placeholder="Votre numéro de téléphone"
                            />
                        </div>

                        <button
                            className="save-button"
                            onClick={handleUpdateProfile}
                            disabled={loading}
                        >
                            <SaveOutlined />
                            Enregistrer les modifications
                        </button>
                    </div>
                )}

                {/* Section Mot de passe */}
                {activeSection === 'password' && canChangePassword && (
                    <div className="settings-card">
                        <h2>Changer le mot de passe</h2>

                        <div className="form-group">
                            <label>
                                <LockOutlined />
                                Mot de passe actuel
                            </label>
                            <input
                                type="password"
                                value={passwordData.currentPassword}
                                onChange={(e) =>
                                    setPasswordData({
                                        ...passwordData,
                                        currentPassword: e.target.value,
                                    })
                                }
                                placeholder="Votre mot de passe actuel"
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                <LockOutlined />
                                Nouveau mot de passe
                            </label>
                            <input
                                type="password"
                                value={passwordData.newPassword}
                                onChange={(e) =>
                                    setPasswordData({
                                        ...passwordData,
                                        newPassword: e.target.value,
                                    })
                                }
                                placeholder="Nouveau mot de passe"
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                <LockOutlined />
                                Confirmer le mot de passe
                            </label>
                            <input
                                type="password"
                                value={passwordData.confirmPassword}
                                onChange={(e) =>
                                    setPasswordData({
                                        ...passwordData,
                                        confirmPassword: e.target.value,
                                    })
                                }
                                placeholder="Confirmez le nouveau mot de passe"
                            />
                        </div>

                        <div className="password-requirements">
                            <p><InfoCircleOutlined /> Le mot de passe doit contenir :</p>
                            <ul>
                                <li className={passwordData.newPassword.length >= 8 ? 'valid' : ''}>
                                    Au moins 8 caractères
                                </li>
                                <li className={/[A-Z]/.test(passwordData.newPassword) ? 'valid' : ''}>
                                    Au moins une majuscule
                                </li>
                                <li className={/[a-z]/.test(passwordData.newPassword) ? 'valid' : ''}>
                                    Au moins une minuscule
                                </li>
                                <li className={/[0-9]/.test(passwordData.newPassword) ? 'valid' : ''}>
                                    Au moins un chiffre
                                </li>
                            </ul>
                        </div>

                        <button
                            className="save-button"
                            onClick={handleChangePassword}
                            disabled={loading}
                        >
                            <SaveOutlined />
                            Changer le mot de passe
                        </button>
                    </div>
                )}

                {/* Message si pas de changement de mot de passe disponible */}
                {!canChangePassword && activeSection === 'password' && (
                    <div className="settings-card info-card">
                        <InfoCircleOutlined style={{ fontSize: '48px', color: authProvider?.color }} />
                        <h3>Connexion via {authProvider?.name}</h3>
                        <p>
                            Votre compte est connecté via {authProvider?.name}.
                            Le changement de mot de passe n'est pas disponible pour ce type de connexion.
                        </p>
                        <p>
                            Pour modifier votre mot de passe, veuillez le faire directement
                            depuis les paramètres de votre compte {authProvider?.name}.
                        </p>
                    </div>
                )}
            </div>

            {/* Loading overlay */}
            {loading && (
                <div className="loading-overlay">
                    <div className="loading-spinner"></div>
                </div>
            )}

            {/* Toast notification */}
            {toast.show && (
                <div className={`toast-notification ${toast.type}`}>
                    {toast.message}
                </div>
            )}
        </div>
    );
};

export default AccountSettings;