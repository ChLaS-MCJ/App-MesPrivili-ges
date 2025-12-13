import { useState, useEffect, useMemo } from 'react';
import {
    IonContent,
    IonPage,
    IonInput,
    IonButton,
    IonToast,
    IonLoading,
    IonIcon,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonSpinner,
} from '@ionic/react';
import {
    arrowBack,
    logoGoogle,
    logoApple,
    eyeOutline,
    eyeOffOutline,
    checkmarkCircle,
    alertCircle,
    businessOutline,
    personOutline,
    closeCircle
} from 'ionicons/icons';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../Utils/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';


const Register = () => {
    // État pour le type de compte
    const [accountType, setAccountType] = useState('client'); // 'client' ou 'prestataire'

    // Données du formulaire
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        prenom: '',
        nom: '',
        telephone: '',
        // Champ prestataire
        siret: '',
    });

    // États UI
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', color: '' });
    const [passwordTouched, setPasswordTouched] = useState(false);

    // États vérification SIRET
    const [siretVerification, setSiretVerification] = useState({
        status: 'idle', // 'idle' | 'checking' | 'valid' | 'invalid' | 'error'
        message: '',
        data: null
    });
    const [siretDebounceTimer, setSiretDebounceTimer] = useState(null);

    const { register, loginWithGoogle, loginWithApple, registerPrestataire } = useAuth();
    const navigate = useNavigate();

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isNative = Capacitor.isNativePlatform();

    // Validation du mot de passe en temps réel
    const passwordValidation = useMemo(() => {
        const password = formData.password || '';
        return {
            minLength: password.length >= 8,
            hasUppercase: /[A-Z]/.test(password),
            hasLowercase: /[a-z]/.test(password),
            hasNumber: /[0-9]/.test(password),
        };
    }, [formData.password]);

    const isPasswordValid = useMemo(() => {
        return Object.values(passwordValidation).every(v => v);
    }, [passwordValidation]);

    // Initialiser Google Auth pour les plateformes natives
    useEffect(() => {
        const initGoogleAuth = async () => {
            if (isNative) {
                try {
                    const { GoogleAuth } = await import('@codetrix-studio/capacitor-google-auth');
                    await GoogleAuth.initialize({
                        clientId: "172246921916-dv3japmohouikebh4ugfaum5s6t7vdg1.apps.googleusercontent.com",
                        scopes: ['profile', 'email'],
                        grantOfflineAccess: false,
                    });
                } catch (error) {
                    console.log('Google Auth init error:', error);
                }
            }
        };
        initGoogleAuth();
    }, []);

    // Debounce pour la vérification SIRET
    useEffect(() => {
        if (accountType !== 'prestataire') return;

        const siretClean = formData.siret.replace(/[\s-]/g, '');

        if (siretClean.length < 14) {
            setSiretVerification({ status: 'idle', message: '', data: null });
            return;
        }

        // Annuler le timer précédent
        if (siretDebounceTimer) {
            clearTimeout(siretDebounceTimer);
        }

        // Nouveau timer pour vérifier après 800ms
        const timer = setTimeout(() => {
            verifySiret(siretClean);
        }, 800);

        setSiretDebounceTimer(timer);

        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [formData.siret, accountType]);

    const verifySiret = async (siret) => {
        setSiretVerification({ status: 'checking', message: 'Vérification du SIRET...', data: null });

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/prestataires/verify-siret/${siret}`);
            const result = await response.json();

            if (result.success) {
                setSiretVerification({
                    status: 'valid',
                    message: `✓ ${result.data.raisonSociale}`,
                    data: result.data
                });
            } else {
                setSiretVerification({
                    status: 'invalid',
                    message: result.message || 'SIRET invalide',
                    data: null
                });
            }
        } catch (error) {
            console.error('Erreur vérification SIRET:', error);
            setSiretVerification({
                status: 'error',
                message: 'Erreur de vérification. Réessayez.',
                data: null
            });
        }
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value || '' }));
    };

    const handlePasswordChange = (value) => {
        setFormData(prev => ({ ...prev, password: value || '' }));
        if (!passwordTouched) setPasswordTouched(true);
    };

    const formatSiret = (value) => {
        if (!value) return '';
        // Enlever tout sauf les chiffres
        const digits = value.replace(/\D/g, '');
        // Formater: XXX XXX XXX XXXXX
        if (digits.length <= 3) return digits;
        if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
        if (digits.length <= 9) return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
        return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 9)} ${digits.slice(9, 14)}`;
    };

    const handleSiretChange = (value) => {
        const formatted = formatSiret(value);
        setFormData(prev => ({ ...prev, siret: formatted }));
    };

    const validateForm = () => {
        // Récupérer les valeurs actuelles du state
        const { email, password, confirmPassword, prenom, nom, siret } = formData;

        // Validation commune
        if (!email || !password || !prenom || !nom) {
            setToast({
                show: true,
                message: 'Veuillez remplir tous les champs obligatoires',
                color: 'danger',
            });
            return false;
        }

        // Trim les mots de passe pour éviter les espaces
        const pwd = password?.trim() || '';
        const confirmPwd = confirmPassword?.trim() || '';

        // Validation du mot de passe
        if (!isPasswordValid) {
            setToast({
                show: true,
                message: 'Le mot de passe ne respecte pas les critères requis',
                color: 'danger',
            });
            return false;
        }

        if (pwd !== confirmPwd) {
            setToast({
                show: true,
                message: 'Les mots de passe ne correspondent pas',
                color: 'danger',
            });
            return false;
        }

        // Validation prestataire
        if (accountType === 'prestataire') {
            const siretClean = siret?.replace(/[\s-]/g, '') || '';
            if (!siretClean || siretClean.length !== 14) {
                setToast({
                    show: true,
                    message: 'Le numéro SIRET doit contenir 14 chiffres',
                    color: 'danger',
                });
                return false;
            }

            if (siretVerification.status === 'invalid') {
                setToast({
                    show: true,
                    message: 'Le numéro SIRET n\'est pas valide',
                    color: 'danger',
                });
                return false;
            }

            if (siretVerification.status !== 'valid') {
                setToast({
                    show: true,
                    message: 'Veuillez attendre la vérification du SIRET',
                    color: 'warning',
                });
                return false;
            }
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);

        try {
            let result;

            if (accountType === 'client') {
                // Inscription client classique
                result = await register({
                    email: formData.email,
                    password: formData.password,
                    prenom: formData.prenom,
                    nom: formData.nom,
                    telephone: formData.telephone,
                    role: 'client',
                });
            } else {
                // Inscription prestataire (SIRET uniquement)
                result = await registerPrestataire({
                    email: formData.email,
                    password: formData.password,
                    prenom: formData.prenom,
                    nom: formData.nom,
                    telephone: formData.telephone,
                    siret: formData.siret.replace(/[\s-]/g, ''),
                });
            }

            setLoading(false);

            if (result.success) {
                setToast({
                    show: true,
                    message: accountType === 'client'
                        ? 'Inscription réussie !'
                        : 'Inscription prestataire réussie !',
                    color: 'success',
                });

                setTimeout(() => {
                    // Redirection vers la carte pour tous
                    navigate('/auth/maps');
                }, 500);
            } else {
                setToast({
                    show: true,
                    message: result.message || 'Erreur lors de l\'inscription',
                    color: 'danger',
                });
            }
        } catch (error) {
            setLoading(false);
            setToast({
                show: true,
                message: 'Une erreur est survenue',
                color: 'danger',
            });
        }
    };

    // Google Register pour le WEB (popup)
    const handleGoogleRegisterWeb = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setLoading(true);

            try {
                const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: {
                        Authorization: `Bearer ${tokenResponse.access_token}`,
                    },
                });

                const userInfo = await userInfoResponse.json();

                // Uniquement pour les clients
                const result = await loginWithGoogle({
                    googleId: userInfo.sub,
                    email: userInfo.email,
                    prenom: userInfo.given_name,
                    nom: userInfo.family_name,
                });

                if (result.success) {
                    setToast({
                        show: true,
                        message: 'Inscription Google réussie !',
                        color: 'success',
                    });

                    setTimeout(() => {
                        navigate('/auth/maps');
                    }, 500);
                } else {
                    setToast({
                        show: true,
                        message: result.message || 'Erreur lors de l\'inscription Google',
                        color: 'danger',
                    });
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des infos Google:', error);
                setToast({
                    show: true,
                    message: 'Erreur lors de l\'inscription Google',
                    color: 'danger',
                });
            } finally {
                setLoading(false);
            }
        },
        onError: () => {
            setToast({
                show: true,
                message: 'Échec de l\'inscription Google',
                color: 'danger',
            });
        },
    });

    // Google Register pour ANDROID/IOS (natif)
    const handleGoogleRegisterNative = async () => {
        setLoading(true);

        try {
            const { GoogleAuth } = await import('@codetrix-studio/capacitor-google-auth');
            const googleUser = await GoogleAuth.signIn();

            const result = await loginWithGoogle({
                googleId: googleUser.id,
                email: googleUser.email,
                prenom: googleUser.givenName,
                nom: googleUser.familyName,
            });

            if (result.success) {
                setToast({
                    show: true,
                    message: 'Inscription Google réussie !',
                    color: 'success',
                });

                setTimeout(() => {
                    navigate('/auth/maps');
                }, 500);
            } else {
                setToast({
                    show: true,
                    message: result.message || 'Erreur lors de l\'inscription Google',
                    color: 'danger',
                });
            }
        } catch (error) {
            console.error('Erreur Google Register Native:', error);
            setToast({
                show: true,
                message: 'Échec de l\'inscription Google',
                color: 'danger',
            });
        } finally {
            setLoading(false);
        }
    };

    // Choisir la bonne méthode selon la plateforme
    const handleGoogleRegister = () => {
        if (isNative) {
            handleGoogleRegisterNative();
        } else {
            handleGoogleRegisterWeb();
        }
    };

    const handleAppleRegister = async () => {
        // Apple Sign In - à implémenter selon votre configuration
        setToast({
            show: true,
            message: 'Inscription Apple bientôt disponible',
            color: 'warning',
        });
    };

    const getSiretStatusIcon = () => {
        switch (siretVerification.status) {
            case 'checking':
                return <IonSpinner name="crescent" className="siret-spinner" />;
            case 'valid':
                return <IonIcon icon={checkmarkCircle} className="siret-icon valid" />;
            case 'invalid':
            case 'error':
                return <IonIcon icon={alertCircle} className="siret-icon invalid" />;
            default:
                return null;
        }
    };

    // Composant pour afficher un critère de mot de passe
    const PasswordCriteria = ({ isValid, text }) => (
        <div className={`password-criteria ${isValid ? 'valid' : 'invalid'}`}>
            <IonIcon icon={isValid ? checkmarkCircle : closeCircle} />
            <span>{text}</span>
        </div>
    );

    return (
        <IonPage>
            <IonContent className="register-screen">
                <div className="register-container">
                    <button className="back-button-register" onClick={() => navigate(-1)}>
                        <IonIcon icon={arrowBack} />
                    </button>

                    <div className="register-header">
                        <h1 className="register-title">Créer</h1>
                        <h1 className="register-title">votre compte</h1>
                    </div>

                    {/* Sélecteur de type de compte */}
                    <div className="account-type-selector">
                        <IonSegment
                            value={accountType}
                            onIonChange={(e) => setAccountType(e.detail.value)}
                            className="account-type-segment"
                        >
                            <IonSegmentButton value="client">
                                <IonIcon icon={personOutline} />
                                <IonLabel>Client</IonLabel>
                            </IonSegmentButton>
                            <IonSegmentButton value="prestataire">
                                <IonIcon icon={businessOutline} />
                                <IonLabel>Professionnel</IonLabel>
                            </IonSegmentButton>
                        </IonSegment>
                    </div>

                    <form onSubmit={handleSubmit} className="register-form" autoComplete="off">

                        {/* Champs communs */}
                        <div className="input-group">
                            <IonInput
                                className="register-input"
                                type="text"
                                placeholder="Prénom *"
                                value={formData.prenom}
                                onIonInput={(e) => handleChange('prenom', e.detail.value)}
                                autocomplete="given-name"
                                name="prenom"
                            />
                        </div>

                        <div className="input-group">
                            <IonInput
                                className="register-input"
                                type="text"
                                placeholder="Nom *"
                                value={formData.nom}
                                onIonInput={(e) => handleChange('nom', e.detail.value)}
                                autocomplete="family-name"
                                name="nom"
                            />
                        </div>

                        <div className="input-group">
                            <IonInput
                                className="register-input"
                                type="email"
                                placeholder="Email *"
                                value={formData.email}
                                onIonInput={(e) => handleChange('email', e.detail.value)}
                                autocomplete="email"
                                name="email"
                            />
                        </div>

                        {/* Champ SIRET pour prestataire */}
                        {accountType === 'prestataire' && (
                            <div className="prestataire-section">
                                <div className="input-group siret-input-group">
                                    <IonInput
                                        className="register-input"
                                        type="text"
                                        placeholder="Numéro SIRET * (14 chiffres)"
                                        value={formData.siret}
                                        onIonInput={(e) => handleSiretChange(e.detail.value)}
                                        maxlength={17}
                                        name="siret"
                                    />
                                    <div className="siret-status">
                                        {getSiretStatusIcon()}
                                    </div>
                                </div>

                                {siretVerification.message && (
                                    <p className={`siret-message ${siretVerification.status}`}>
                                        {siretVerification.message}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Mots de passe */}
                        <div className="input-group input-password-group">
                            <IonInput
                                className="register-input"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Mot de passe *"
                                value={formData.password}
                                onIonInput={(e) => handlePasswordChange(e.detail.value)}
                                autocomplete="new-password"
                                name="password"
                            />
                            <button
                                type="button"
                                className="password-toggle-btn"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                <IonIcon icon={showPassword ? eyeOffOutline : eyeOutline} />
                            </button>
                        </div>

                        {/* Indicateurs de validation du mot de passe */}
                        {passwordTouched && (
                            <div className="password-validation-container">
                                <PasswordCriteria
                                    isValid={passwordValidation.minLength}
                                    text="8 caractères minimum"
                                />
                                <PasswordCriteria
                                    isValid={passwordValidation.hasUppercase}
                                    text="1 majuscule"
                                />
                                <PasswordCriteria
                                    isValid={passwordValidation.hasLowercase}
                                    text="1 minuscule"
                                />
                                <PasswordCriteria
                                    isValid={passwordValidation.hasNumber}
                                    text="1 chiffre"
                                />
                            </div>
                        )}

                        <div className="input-group input-password-group">
                            <IonInput
                                className="register-input"
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="Confirmer le mot de passe *"
                                value={formData.confirmPassword}
                                onIonInput={(e) => handleChange('confirmPassword', e.detail.value)}
                                autocomplete="new-password"
                                name="confirmPassword"
                            />
                            <button
                                type="button"
                                className="password-toggle-btn"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                <IonIcon icon={showConfirmPassword ? eyeOffOutline : eyeOutline} />
                            </button>
                        </div>

                        {/* Indicateur de correspondance des mots de passe */}
                        {formData.confirmPassword && (
                            <div className="password-match-container">
                                <PasswordCriteria
                                    isValid={formData.password === formData.confirmPassword}
                                    text={formData.password === formData.confirmPassword
                                        ? "Les mots de passe correspondent"
                                        : "Les mots de passe ne correspondent pas"
                                    }
                                />
                            </div>
                        )}

                        <p className="required-text">* Champs obligatoires</p>

                        <IonButton
                            expand="block"
                            type="submit"
                            className="register-button"
                            disabled={loading || (accountType === 'prestataire' && siretVerification.status === 'checking')}
                        >
                            {accountType === 'client' ? "S'inscrire" : "S'inscrire comme prestataire"}
                        </IonButton>

                        {/* Boutons Google et Apple uniquement pour les clients */}
                        {accountType === 'client' && (
                            <>
                                <IonButton
                                    expand="block"
                                    fill="outline"
                                    className="google-button"
                                    onClick={handleGoogleRegister}
                                    disabled={loading}
                                >
                                    <IonIcon icon={logoGoogle} slot="start" />
                                    S'inscrire avec Google
                                </IonButton>

                                {isIOS && (
                                    <IonButton
                                        expand="block"
                                        fill="outline"
                                        className="apple-button"
                                        onClick={handleAppleRegister}
                                        disabled={loading}
                                    >
                                        <IonIcon icon={logoApple} slot="start" />
                                        S'inscrire avec Apple
                                    </IonButton>
                                )}
                            </>
                        )}
                    </form>

                    <div className="login-group">
                        <span className="login-text">Vous avez déjà un compte ? </span>
                        <button className="login-link" onClick={() => navigate('/login')}>
                            Se connecter
                        </button>
                    </div>
                </div>

                <IonLoading
                    isOpen={loading}
                    message={accountType === 'prestataire'
                        ? "Vérification et création du compte..."
                        : "Création du compte..."
                    }
                />

                <IonToast
                    isOpen={toast.show}
                    message={toast.message}
                    duration={3000}
                    color={toast.color}
                    cssClass={`toast-${toast.color}`}
                    onDidDismiss={() => setToast({ ...toast, show: false })}
                />
            </IonContent>
        </IonPage>
    );
};

export default Register;