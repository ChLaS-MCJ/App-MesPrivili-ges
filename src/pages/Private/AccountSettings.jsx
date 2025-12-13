import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../Utils/AuthContext';
import UserService from '../../Services/User.service';
import profilimg from '../../Assets/Images/profilimg.png';
import {
    UserOutlined,
    LockOutlined,
    CameraOutlined,
    SaveOutlined,
    CheckOutlined,
    DownOutlined,
    QuestionCircleOutlined,
    LoadingOutlined,
    ArrowLeftOutlined,
} from '@ant-design/icons';

const AccountSettings = () => {
    const { user, updateProfile, changePassword, getProfileImageUrl, refreshUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const previousPath = location.state?.previousPath || '/auth/maps';

    const [profileData, setProfileData] = useState({
        prenom: '',
        nom: '',
        email: '',
        telephone: '',
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [imagePreview, setImagePreview] = useState(profilimg);
    const [imageKey, setImageKey] = useState(Date.now());
    const [imageInitialized, setImageInitialized] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: '' });
    const [openSection, setOpenSection] = useState(null);

    const canChangePassword = user?.oauthProvider === 'local' || !user?.oauthProvider;

    const passwordRequirements = [
        { label: '8 caractères minimum', met: passwordData.newPassword.length >= 8 },
        { label: 'Au moins une majuscule', met: /[A-Z]/.test(passwordData.newPassword) },
        { label: 'Au moins un chiffre', met: /[0-9]/.test(passwordData.newPassword) },
    ];

    useEffect(() => {

        if (user) {
            setProfileData({
                prenom: user.client?.prenom || user.prenom || '',
                nom: user.client?.nom || user.nom || '',
                email: user.email || '',
                telephone: user.client?.telephone || user.telephone || '',
            });

            if (!imageInitialized) {
                const profileImg = getProfileImageUrl();

                setImagePreview(profileImg || profilimg);
                setImageInitialized(true);
            } else {

            }
        }

    }, [user]);

    const showToast = (message, type) => {
        setToast({ show: true, message, type });
        setTimeout(() => {
            setToast({ show: false, message: '', type: '' });
        }, 3000);
    };

    const toggleSection = (section) => {
        setOpenSection(openSection === section ? null : section);
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;


        if (file.size > 5 * 1024 * 1024) {
            showToast("L'image ne doit pas dépasser 5MB", 'error');
            return;
        }

        if (!file.type.startsWith('image/')) {
            showToast('Le fichier doit être une image', 'error');
            return;
        }


        setUploadingImage(true);

        try {
            const result = await UserService.uploadProfileImage(file);

            if (result.success) {

                showToast('Photo mise à jour', 'success');
                await refreshUser();
                const newProfileImage = result.data?.client?.profileImage;


                if (newProfileImage) {
                    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8100';
                    const cleanPath = newProfileImage.replace('/api', '');
                    const timestamp = Date.now();
                    const newImageUrl = `${baseURL}${cleanPath}?t=${timestamp}`;

                    setImageKey(timestamp);
                    setImagePreview(newImageUrl);

                } else {

                }
            } else {

                showToast(result.message || 'Erreur', 'error');
            }
        } catch (error) {
            console.error('💥 Erreur upload:', error);
            showToast('Erreur lors de l\'upload', 'error');
        } finally {
            setUploadingImage(false);

        }
    };

    const handleUpdateProfile = async () => {
        setLoading(true);
        try {
            const result = await updateProfile({
                prenom: profileData.prenom,
                nom: profileData.nom,
                telephone: profileData.telephone,
            });

            if (result.success) {
                showToast('Profil mis à jour', 'success');
            } else {
                showToast(result.message || 'Erreur', 'error');
            }
        } catch (error) {
            showToast('Erreur', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async () => {
        if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
            showToast('Remplissez tous les champs', 'error');
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            showToast('Les mots de passe ne correspondent pas', 'error');
            return;
        }

        const allRequirementsMet = passwordRequirements.every(req => req.met);
        if (!allRequirementsMet) {
            showToast('Le mot de passe ne respecte pas les exigences', 'error');
            return;
        }

        setLoading(true);
        try {
            const result = await changePassword(
                passwordData.currentPassword,
                passwordData.newPassword
            );

            if (result.success) {
                showToast('Mot de passe modifié', 'success');
                setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                });
            } else {
                showToast(result.message || 'Erreur', 'error');
            }
        } catch (error) {
            showToast('Erreur', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="account-settings-page">
            <div className="settings-container">

                <div className="settings-header">
                    <button className="back-button" onClick={() => navigate(previousPath, { state: { openDrawer: true } })}>
                        <ArrowLeftOutlined />
                    </button>
                    <h1 className="settings-title">Mon Compte</h1>
                </div>

                <div className="profile-section">
                    <div className="profile-avatar-wrapper">
                        <div className="progress-ring">
                            <svg width="132" height="132">
                                <circle cx="66" cy="66" r="60" />
                                <circle className="progress" cx="66" cy="66" r="60" />
                            </svg>
                        </div>
                        <img
                            key={imageKey}
                            src={imagePreview}
                            alt="Profile"
                            className="profile-avatar"
                            onError={(e) => { e.target.src = profilimg; }}
                        />
                        <button
                            className="avatar-edit-overlay"
                            onClick={() => document.getElementById('avatar-input').click()}
                            disabled={uploadingImage}
                        >
                            {uploadingImage ? <LoadingOutlined spin /> : <CameraOutlined />}
                        </button>
                        <input
                            type="file"
                            id="avatar-input"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handleImageChange}
                        />
                    </div>

                    <h2 className="profile-name">{profileData.prenom} {profileData.nom}</h2>
                    <p className="profile-email">{profileData.email}</p>
                </div>

                {/* Menu Accordéons */}
                <div className="menu-section">
                    {/* 1. Informations Personnelles */}
                    <div className={`menu-item ${openSection === 'account' ? 'active' : ''}`}>
                        <div className="menu-header" onClick={() => toggleSection('account')}>
                            <div className="menu-left">
                                <div className="menu-icon">
                                    <UserOutlined />
                                </div>
                                <span className="menu-label">Informations personnelles</span>
                            </div>
                            <div className="menu-right">
                                <DownOutlined className="menu-arrow" />
                            </div>
                        </div>
                        <div className="menu-content">
                            <div className="menu-content-inner">
                                <div className="form-group">
                                    <label className="form-label">Prénom</label>
                                    <input
                                        type="text"
                                        className="settings-input"
                                        placeholder="Votre prénom"
                                        value={profileData.prenom}
                                        onChange={(e) => setProfileData({ ...profileData, prenom: e.target.value })}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Nom</label>
                                    <input
                                        type="text"
                                        className="settings-input"
                                        placeholder="Votre nom"
                                        value={profileData.nom}
                                        onChange={(e) => setProfileData({ ...profileData, nom: e.target.value })}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="settings-input"
                                        value={profileData.email}
                                        disabled
                                    />
                                    <p className="field-hint">L'email ne peut pas être modifié</p>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Téléphone</label>
                                    <input
                                        type="tel"
                                        className="settings-input"
                                        placeholder="Votre numéro"
                                        value={profileData.telephone}
                                        onChange={(e) => setProfileData({ ...profileData, telephone: e.target.value })}
                                    />
                                </div>

                                <button className="save-button" onClick={handleUpdateProfile} disabled={loading}>
                                    <SaveOutlined />
                                    <span>Enregistrer</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* 2. Mot de passe - Visible SEULEMENT si compte local */}
                    {canChangePassword && (
                        <div className={`menu-item ${openSection === 'password' ? 'active' : ''}`}>
                            <div className="menu-header" onClick={() => toggleSection('password')}>
                                <div className="menu-left">
                                    <div className="menu-icon">
                                        <LockOutlined />
                                    </div>
                                    <span className="menu-label">Mot de passe</span>
                                </div>
                                <div className="menu-right">
                                    <DownOutlined className="menu-arrow" />
                                </div>
                            </div>
                            <div className="menu-content">
                                <div className="menu-content-inner">
                                    <div className="form-group">
                                        <label className="form-label">Mot de passe actuel</label>
                                        <input
                                            type="password"
                                            className="settings-input"
                                            placeholder="Entrez votre mot de passe"
                                            value={passwordData.currentPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Nouveau mot de passe</label>
                                        <input
                                            type="password"
                                            className="settings-input"
                                            placeholder="Nouveau mot de passe"
                                            value={passwordData.newPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Confirmer le mot de passe</label>
                                        <input
                                            type="password"
                                            className="settings-input"
                                            placeholder="Confirmez le mot de passe"
                                            value={passwordData.confirmPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                        />
                                    </div>

                                    <div className="password-strength">
                                        {passwordRequirements.map((req, index) => (
                                            <div key={index} className={`strength-item ${req.met ? 'valid' : ''}`}>
                                                <div className="strength-icon">
                                                    {req.met && <CheckOutlined />}
                                                </div>
                                                <span>{req.label}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <button className="save-button" onClick={handleChangePassword} disabled={loading}>
                                        <LockOutlined />
                                        <span>Changer le mot de passe</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 3. Centre d'aide */}
                    <div className={`menu-item ${openSection === 'help' ? 'active' : ''}`}>
                        <div className="menu-header" onClick={() => toggleSection('help')}>
                            <div className="menu-left">
                                <div className="menu-icon">
                                    <QuestionCircleOutlined />
                                </div>
                                <span className="menu-label">Centre d'aide</span>
                            </div>
                            <div className="menu-right">
                                <DownOutlined className="menu-arrow" />
                            </div>
                        </div>
                        <div className="menu-content">
                            <div className="menu-content-inner">
                                <p style={{ color: '#999', fontSize: '14px', lineHeight: '1.6', marginBottom: '12px' }}>
                                    Besoin d'aide ? Consultez notre centre d'assistance ou contactez notre équipe support.
                                </p>
                                <p style={{ color: '#fff', fontSize: '14px', fontWeight: '500' }}>
                                    📧 Email : <a href="mailto:contact@mesprivileges.com" style={{ color: '#ffffff', textDecoration: 'none' }}>contact@mesprivileges.com</a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Toast */}
            {toast.show && (
                <div className={`toast ${toast.type}`}>
                    <CheckOutlined />
                    <span>{toast.message}</span>
                </div>
            )}

            {/* Loading */}
            {loading && (
                <div className="loading-overlay">
                    <div className="spinner"></div>
                </div>
            )}
        </div>
    );
};

export default AccountSettings;