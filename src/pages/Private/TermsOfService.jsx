import { useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';

const TermsOfService = () => {
    const navigate = useNavigate();

    return (
        <div className="legal-page">
            {/* Header */}
            <div className="legal-header">
                <button className="back-button" onClick={() => navigate(-1)}>
                    <ArrowLeftOutlined />
                </button>
                <h1>Conditions d'Utilisation</h1>
            </div>

            {/* Content */}
            <div className="legal-content">
                <section className="legal-section">
                    <h2>1. Objet</h2>
                    <p>
                        Les présentes Conditions Générales d'Utilisation (CGU) ont pour objet de définir les modalités et conditions d'utilisation de l'application [Nom de l'application], ainsi que les droits et obligations des utilisateurs.
                    </p>
                    <p>
                        En utilisant l'application, vous acceptez sans réserve les présentes CGU.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>2. Accès à l'application</h2>
                    <p>
                        L'application est accessible gratuitement à tout utilisateur disposant d'un accès à Internet. Tous les frais supportés par l'utilisateur pour accéder au service (matériel informatique, logiciels, connexion Internet, etc.) sont à sa charge.
                    </p>
                    <p>
                        L'éditeur se réserve le droit de modifier, suspendre ou interrompre l'accès à tout ou partie de l'application à tout moment, sans préavis et sans obligation d'en informer les utilisateurs.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>3. Inscription et compte utilisateur</h2>
                    <h3>3.1. Création de compte</h3>
                    <p>
                        Pour accéder à certaines fonctionnalités, l'utilisateur doit créer un compte en fournissant des informations exactes et à jour. L'utilisateur s'engage à maintenir ces informations à jour.
                    </p>
                    <h3>3.2. Responsabilité du compte</h3>
                    <p>
                        L'utilisateur est responsable de la confidentialité de ses identifiants de connexion. Toute utilisation du compte est réputée avoir été effectuée par l'utilisateur.
                    </p>
                    <h3>3.3. Authentification tierce</h3>
                    <p>
                        L'application propose des connexions via Google et Apple. En utilisant ces services, vous acceptez également leurs conditions d'utilisation respectives.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>4. Utilisation de l'application</h2>
                    <h3>4.1. Usage autorisé</h3>
                    <p>
                        L'utilisateur s'engage à utiliser l'application conformément à sa destination et aux présentes CGU. Il s'engage notamment à :
                    </p>
                    <ul>
                        <li>Ne pas porter atteinte à l'ordre public et aux bonnes mœurs</li>
                        <li>Ne pas violer les droits de propriété intellectuelle</li>
                        <li>Ne pas diffuser de contenu illicite ou préjudiciable</li>
                        <li>Ne pas tenter de contourner les mesures de sécurité</li>
                        <li>Ne pas collecter les données d'autres utilisateurs</li>
                    </ul>
                    <h3>4.2. Sanctions</h3>
                    <p>
                        En cas de manquement aux présentes CGU, l'éditeur se réserve le droit de suspendre ou supprimer le compte de l'utilisateur, sans préavis ni indemnité.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>5. Services proposés</h2>
                    <h3>5.1. Description des services</h3>
                    <p>
                        L'application permet aux utilisateurs de :
                    </p>
                    <ul>
                        <li>Scanner des QR codes</li>
                        <li>Effectuer des réservations auprès de prestataires</li>
                        <li>Consulter leur historique d'activité</li>
                        <li>Gérer leur profil utilisateur</li>
                    </ul>
                    <h3>5.2. Disponibilité</h3>
                    <p>
                        L'éditeur s'efforce d'assurer une disponibilité optimale de l'application, mais ne peut garantir un accès ininterrompu. Des interruptions peuvent survenir pour maintenance ou mise à jour.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>6. Données personnelles</h2>
                    <h3>6.1. Collecte des données</h3>
                    <p>
                        L'application collecte et traite des données personnelles conformément au RGPD et à notre Politique de Confidentialité. Les données collectées incluent :
                    </p>
                    <ul>
                        <li>Données d'identification (nom, prénom, email)</li>
                        <li>Données de connexion</li>
                        <li>Données de navigation et d'utilisation</li>
                        <li>Données de localisation (avec consentement)</li>
                    </ul>
                    <h3>6.2. Droits des utilisateurs</h3>
                    <p>
                        Conformément au RGPD, vous disposez des droits suivants :
                    </p>
                    <ul>
                        <li>Droit d'accès à vos données</li>
                        <li>Droit de rectification</li>
                        <li>Droit à l'effacement</li>
                        <li>Droit à la limitation du traitement</li>
                        <li>Droit à la portabilité</li>
                        <li>Droit d'opposition</li>
                    </ul>
                    <p>
                        Pour exercer ces droits, contactez-nous à : [Email de contact]
                    </p>
                </section>

                <section className="legal-section">
                    <h2>7. Propriété intellectuelle</h2>
                    <p>
                        Tous les éléments de l'application (textes, images, logos, vidéos, bases de données, etc.) sont protégés par le droit d'auteur, le droit des marques et/ou le droit des bases de données.
                    </p>
                    <p>
                        Toute reproduction, représentation, modification, publication ou adaptation totale ou partielle des éléments de l'application, quel que soit le moyen ou le procédé utilisé, est interdite, sauf autorisation écrite préalable.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>8. Responsabilité</h2>
                    <h3>8.1. Limitation de responsabilité</h3>
                    <p>
                        L'éditeur ne peut être tenu responsable de :
                    </p>
                    <ul>
                        <li>L'inexactitude ou l'obsolescence des informations diffusées</li>
                        <li>Les dommages résultant de l'utilisation de l'application</li>
                        <li>Les problèmes techniques indépendants de sa volonté</li>
                        <li>Les actes des prestataires référencés sur l'application</li>
                    </ul>
                    <h3>8.2. Force majeure</h3>
                    <p>
                        L'éditeur ne pourra être tenu responsable en cas de force majeure ou de faits indépendants de sa volonté.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>9. Modification des CGU</h2>
                    <p>
                        L'éditeur se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs seront informés de ces modifications par notification dans l'application ou par email.
                    </p>
                    <p>
                        La poursuite de l'utilisation de l'application après modification des CGU vaut acceptation des nouvelles conditions.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>10. Résiliation</h2>
                    <h3>10.1. Par l'utilisateur</h3>
                    <p>
                        L'utilisateur peut à tout moment supprimer son compte depuis les paramètres de l'application. Cette suppression entraîne l'effacement définitif de ses données personnelles, sauf obligation légale de conservation.
                    </p>
                    <h3>10.2. Par l'éditeur</h3>
                    <p>
                        L'éditeur peut résilier l'accès d'un utilisateur en cas de manquement aux CGU, sans préavis ni indemnité.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>11. Droit applicable et juridiction</h2>
                    <p>
                        Les présentes CGU sont régies par le droit français. En cas de litige, et à défaut d'accord amiable, les tribunaux français seront seuls compétents.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>12. Contact</h2>
                    <p>
                        Pour toute question concernant les présentes CGU, vous pouvez nous contacter :
                    </p>
                    <ul>
                        <li><strong>Par email :</strong> [Email de contact]</li>
                        <li><strong>Par courrier :</strong> [Adresse postale]</li>
                        <li><strong>Par téléphone :</strong> [Numéro de téléphone]</li>
                    </ul>
                </section>

                <div className="legal-footer">
                    <p>Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}</p>
                    <p className="acceptance-note">
                        En utilisant cette application, vous reconnaissez avoir lu et accepté les présentes Conditions d'Utilisation.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TermsOfService;