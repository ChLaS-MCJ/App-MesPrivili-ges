import { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeftOutlined, ArrowUpOutlined } from '@ant-design/icons';

const LegalMentions = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const previousPath = location.state?.previousPath || '/auth/maps';
    const [showScrollTop, setShowScrollTop] = useState(false);
    const pageRef = useRef(null);

    const handleScroll = (e) => {
        const scrollTop = e.target.scrollTop;
        setShowScrollTop(scrollTop > 300);
    };

    const scrollToTop = () => {
        if (pageRef.current) {
            pageRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className="legal-page" ref={pageRef} onScroll={handleScroll}>
            {/* Header */}
            <div className="legal-header">
                <button className="back-button" onClick={() => navigate(previousPath, { state: { openDrawer: true } })}>
                    <ArrowLeftOutlined />
                </button>
                <h1>Mentions Légales</h1>
            </div>

            {/* Scroll to top button */}
            <button
                className={`scroll-to-top-btn ${showScrollTop ? 'visible' : ''}`}
                onClick={scrollToTop}
                aria-label="Remonter en haut"
            >
                <ArrowUpOutlined />
            </button>

            {/* Content */}
            <div className="legal-content">
                <section className="legal-section">
                    <h2>1. Éditeur de l'application</h2>
                    <p>
                        L'application mobile <strong>Mes Privilèges</strong> est éditée par la société APPLITWO.
                    </p>
                    <div className="legal-info-box">
                        <ul>
                            <li><strong>Raison sociale :</strong> APPLITWO</li>
                            <li><strong>Forme juridique :</strong> Société par Actions Simplifiée (SAS)</li>
                            <li><strong>Capital social :</strong> 1 000 euros</li>
                            <li><strong>Siège social :</strong> 18 Allée de la Passée, 64140 LONS</li>
                            <li><strong>RCS :</strong> Pau 941 291 999</li>
                            <li><strong>SIRET :</strong> 941 291 999 00014</li>
                            <li><strong>Code APE :</strong> 62.01Z - Programmation informatique</li>
                            <li><strong>TVA intracommunautaire :</strong> FR 94 941291999</li>
                            <li><strong>Téléphone :</strong> 07 60 02 43 78</li>
                            <li><strong>Email :</strong> contact@applitwo.com</li>
                            <li><strong>Site web :</strong> <a href="https://applitwo.fr" target="_blank" rel="noopener noreferrer">https://applitwo.fr</a></li>
                        </ul>
                    </div>
                </section>

                <section className="legal-section">
                    <h2>2. Direction de la publication</h2>
                    <p>
                        <strong>Présidente :</strong> Madame Véronique FAURE
                    </p>
                    <p>
                        <strong>Directeur de la publication :</strong> Monsieur Maxime CHALAS FAURE, en qualité de Directeur Général
                    </p>
                </section>

                <section className="legal-section">
                    <h2>3. Hébergement</h2>
                    <p>
                        L'application et ses données sont hébergées par :
                    </p>
                    <div className="legal-info-box">
                        <ul>
                            <li><strong>Nom :</strong> IONOS SE</li>
                            <li><strong>Adresse :</strong> Elgendorfer Str. 57, 56410 Montabaur, Allemagne</li>
                            <li><strong>Site web :</strong> <a href="https://www.ionos.fr" target="_blank" rel="noopener noreferrer">https://www.ionos.fr</a></li>
                        </ul>
                    </div>
                    <p>
                        Les données sont hébergées au sein de l'Union Européenne, conformément aux exigences du Règlement Général sur la Protection des Données (RGPD).
                    </p>
                </section>

                <section className="legal-section">
                    <h2>4. Propriété intellectuelle</h2>
                    <p>
                        L'ensemble des éléments composant l'application Mes Privilèges (textes, images, logos, icônes, sons, logiciels, base de données, design, architecture, code source) est la propriété exclusive d'APPLITWO ou de ses partenaires et est protégé par les lois françaises et internationales relatives à la propriété intellectuelle.
                    </p>
                    <p>
                        Toute reproduction, représentation, modification, publication, transmission, dénaturation, totale ou partielle de l'application ou de son contenu, par quelque procédé que ce soit, sans l'autorisation expresse et préalable d'APPLITWO, est interdite et constituerait une contrefaçon sanctionnée par les articles L. 335-2 et suivants du Code de la propriété intellectuelle.
                    </p>
                    <p>
                        Les marques et logos présents sur l'application sont des marques déposées. Toute reproduction totale ou partielle de ces marques sans autorisation expresse est prohibée au sens du Code de la propriété intellectuelle.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>5. Protection des données personnelles</h2>
                    <p>
                        Conformément au Règlement Général sur la Protection des Données (RGPD) n° 2016/679 et à la loi n° 78-17 du 6 janvier 1978 modifiée relative à l'informatique, aux fichiers et aux libertés, APPLITWO s'engage à protéger les données personnelles de ses utilisateurs.
                    </p>
                    <h3>5.1. Responsable du traitement</h3>
                    <p>
                        Le responsable du traitement des données personnelles est la société APPLITWO, représentée par Monsieur Maxime CHALAS FAURE, Directeur Général.
                    </p>
                    <h3>5.2. Données collectées</h3>
                    <p>
                        Les données personnelles collectées peuvent inclure :
                    </p>
                    <ul>
                        <li>Données d'identification : nom, prénom, adresse email, numéro de téléphone</li>
                        <li>Données professionnelles (pour les prestataires) : dénomination sociale, SIRET, adresse</li>
                        <li>Données de connexion : identifiants, logs de connexion</li>
                        <li>Données d'utilisation : historique des scans, réservations</li>
                    </ul>
                    <h3>5.3. Géolocalisation</h3>
                    <p>
                        L'application utilise la géolocalisation pour afficher les prestataires à proximité. <strong>Les données de géolocalisation ne sont pas stockées sur nos serveurs</strong> et sont uniquement conservées localement sur l'appareil de l'utilisateur.
                    </p>
                    <h3>5.4. Droits des utilisateurs</h3>
                    <p>
                        Conformément au RGPD, vous disposez des droits suivants :
                    </p>
                    <ul>
                        <li><strong>Droit d'accès :</strong> obtenir une copie de vos données personnelles</li>
                        <li><strong>Droit de rectification :</strong> corriger des données inexactes ou incomplètes</li>
                        <li><strong>Droit à l'effacement :</strong> demander la suppression de vos données</li>
                        <li><strong>Droit à la limitation :</strong> limiter le traitement de vos données</li>
                        <li><strong>Droit à la portabilité :</strong> recevoir vos données dans un format structuré</li>
                        <li><strong>Droit d'opposition :</strong> vous opposer au traitement de vos données</li>
                    </ul>
                    <p>
                        Pour exercer ces droits, contactez-nous à : <strong>contact@applitwo.com</strong>
                    </p>
                    <p>
                        Vous disposez également du droit d'introduire une réclamation auprès de la CNIL : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">www.cnil.fr</a>
                    </p>
                    <h3>5.5. Durée de conservation</h3>
                    <p>
                        Les données personnelles sont conservées pendant la durée de la relation contractuelle. En cas de suppression du compte, les données sont effacées immédiatement, à l'exception des données de facturation conservées 10 ans conformément aux obligations comptables.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>6. Cookies et stockage local</h2>
                    <p>
                        L'application mobile Mes Privilèges n'utilise pas de cookies au sens traditionnel du terme.
                    </p>
                    <p>
                        Cependant, des données techniques peuvent être stockées localement sur votre appareil pour assurer le bon fonctionnement de l'application :
                    </p>
                    <ul>
                        <li>Tokens d'authentification (pour maintenir votre session)</li>
                        <li>Préférences utilisateur (thème, langue)</li>
                        <li>Données de géolocalisation temporaires (pour l'affichage de la carte)</li>
                    </ul>
                    <p>
                        Ces données sont stockées uniquement sur votre appareil et ne sont pas transmises à nos serveurs, sauf pour les besoins d'authentification.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>7. Prestataire de paiement</h2>
                    <p>
                        Les transactions financières sont gérées par la plateforme de paiement sécurisée Stripe.
                    </p>
                    <div className="legal-info-box">
                        <ul>
                            <li><strong>Nom :</strong> Stripe Payments Europe, Ltd.</li>
                            <li><strong>Adresse :</strong> 1 Grand Canal Street Lower, Grand Canal Dock, Dublin, D02 H210, Irlande</li>
                            <li><strong>Site web :</strong> <a href="https://stripe.com/fr" target="_blank" rel="noopener noreferrer">https://stripe.com/fr</a></li>
                        </ul>
                    </div>
                    <p>
                        APPLITWO ne stocke aucune donnée bancaire. Les informations de paiement sont exclusivement traitées par Stripe, conformément aux normes de sécurité PCI-DSS.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>8. Limitation de responsabilité</h2>
                    <p>
                        APPLITWO s'efforce d'assurer au mieux de ses possibilités l'exactitude et la mise à jour des informations diffusées sur l'application. Toutefois, APPLITWO ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations mises à disposition.
                    </p>
                    <p>
                        APPLITWO décline toute responsabilité :
                    </p>
                    <ul>
                        <li>Pour toute imprécision, inexactitude ou omission portant sur des informations disponibles sur l'application</li>
                        <li>Pour tous dommages résultant d'une intrusion frauduleuse d'un tiers</li>
                        <li>Pour tout dommage causé au matériel de l'utilisateur lors de l'accès à l'application</li>
                        <li>Pour les interruptions temporaires de l'application pour maintenance ou mise à jour</li>
                        <li>Pour le contenu publié par les prestataires sur leurs fiches</li>
                        <li>Pour la qualité des prestations fournies par les prestataires référencés</li>
                    </ul>
                </section>

                <section className="legal-section">
                    <h2>9. Liens hypertextes</h2>
                    <p>
                        L'application peut contenir des liens hypertextes vers d'autres sites ou applications. APPLITWO n'exerce aucun contrôle sur ces sites tiers et décline toute responsabilité quant à leur contenu, leurs pratiques en matière de confidentialité ou les services qu'ils proposent.
                    </p>
                    <p>
                        L'existence d'un lien vers un site tiers ne constitue pas une approbation de ce site ou de son contenu par APPLITWO.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>10. Droit applicable et juridiction</h2>
                    <p>
                        Les présentes mentions légales sont régies par le droit français.
                    </p>
                    <p>
                        En cas de litige relatif à l'interprétation ou l'exécution des présentes, et à défaut d'accord amiable, les tribunaux français du ressort de la Cour d'appel de Pau seront seuls compétents.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>11. Médiation</h2>
                    <p>
                        Conformément aux articles L. 611-1 et suivants du Code de la consommation, en cas de litige, le consommateur peut recourir gratuitement à un médiateur de la consommation.
                    </p>
                    <p>
                        Vous pouvez également utiliser la plateforme européenne de règlement en ligne des litiges : <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer">https://ec.europa.eu/consumers/odr</a>
                    </p>
                </section>

                <section className="legal-section">
                    <h2>12. Contact</h2>
                    <p>
                        Pour toute question concernant les présentes mentions légales, vous pouvez nous contacter :
                    </p>
                    <ul>
                        <li><strong>Par email :</strong> contact@applitwo.com</li>
                        <li><strong>Par téléphone :</strong> 07 60 02 43 78</li>
                        <li><strong>Par courrier :</strong> APPLITWO - 18 Allée de la Passée, 64140 LONS</li>
                    </ul>
                </section>

                <div className="legal-footer">
                    <p>Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}</p>
                </div>
            </div>
        </div>
    );
};

export default LegalMentions;