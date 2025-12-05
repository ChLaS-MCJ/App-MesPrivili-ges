import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';

const TermsOfService = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const previousPath = location.state?.previousPath || '/auth/maps';

    return (
        <div className="legal-page">
            {/* Header */}
            <div className="legal-header">
                <button className="back-button" onClick={() => navigate(previousPath, { state: { openDrawer: true } })}>
                    <ArrowLeftOutlined />
                </button>
                <h1>Conditions Générales d'Utilisation</h1>
            </div>

            {/* Content */}
            <div className="legal-content">

                {/* Mentions légales obligatoires (LCEN) */}
                <section className="legal-section">
                    <h2>Mentions légales</h2>
                    <p>
                        L'application mobile <strong>Mes Privilèges</strong> est éditée par :
                    </p>
                    <div className="legal-info-box">
                        <p><strong>APPLITWO</strong></p>
                        <p>Société par Actions Simplifiée (SAS) </p>
                        <p>Siège social : 18 Allée de la Passée, 64140 LONS</p>
                        <p>Immatriculée au RCS de Pau sous le numéro 941 291 999</p>
                        <p>SIRET : 941 291 999 00014</p>
                        <p>Code APE : 62.01Z - Programmation informatique</p>
                        <p>N° TVA Intracommunautaire : FR 94 941291999</p>
                    </div>
                    <p><strong>Présidente :</strong> Madame Véronique FAURE</p>
                    <p><strong>Directeur de la publication :</strong> Monsieur Maxime CHALAS FAURE, en qualité de Directeur Général</p>
                    <p><strong>Contact :</strong></p>
                    <ul>
                        <li>Email : contact@applitwo.com</li>
                        <li>Téléphone : 07 60 02 43 78</li>
                        <li>Site web : <a href="https://applitwo.fr" target="_blank" rel="noopener noreferrer">https://applitwo.fr</a></li>
                    </ul>
                    <p><strong>Hébergeur :</strong></p>
                    <p>
                        IONOS SE<br />
                        Elgendorfer Str. 57, 56410 Montabaur, Allemagne<br />
                        Site web : <a href="https://www.ionos.fr" target="_blank" rel="noopener noreferrer">https://www.ionos.fr</a>
                    </p>
                </section>

                <section className="legal-section">
                    <h2>Article 1 - Objet</h2>
                    <p>
                        Les présentes Conditions Générales d'Utilisation ont pour objet de définir les modalités et conditions d'accès et d'utilisation de l'application mobile Mes Privilèges, ainsi que les droits et obligations des utilisateurs.
                    </p>
                    <p>
                        L'Application est une plateforme de mise en relation entre des utilisateurs particuliers (ci-après « Clients ») et des professionnels proposant des services ou produits (ci-après « Prestataires »).
                    </p>
                    <p>
                        L'utilisation de l'Application implique l'acceptation pleine et entière des présentes CGU. Si vous n'acceptez pas ces conditions, vous devez cesser immédiatement d'utiliser l'Application.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>Article 2 - Description des services</h2>
                    <h3>2.1. Services proposés aux Clients</h3>
                    <p>
                        L'Application permet aux Clients, à titre gratuit, de :
                    </p>
                    <ul>
                        <li>Créer un compte utilisateur</li>
                        <li>Rechercher et découvrir des prestataires à proximité via la géolocalisation</li>
                        <li>Consulter les fiches descriptives des Prestataires</li>
                        <li>Scanner des QR codes pour accéder à des avantages et privilèges</li>
                        <li>Consulter leur historique d'activité</li>
                        <li>Gérer leur profil utilisateur</li>
                    </ul>
                    <h3>2.2. Services proposés aux Prestataires</h3>
                    <p>
                        L'Application permet aux Prestataires, moyennant la souscription d'un abonnement payant, de :
                    </p>
                    <ul>
                        <li>Créer un compte professionnel</li>
                        <li>Créer et gérer une ou plusieurs fiches établissement</li>
                        <li>Être référencé et visible sur l'Application</li>
                        <li>Proposer des avantages et privilèges à leurs clients</li>
                        <li>Accéder à des statistiques de consultation</li>
                    </ul>
                </section>

                <section className="legal-section">
                    <h2>Article 3 - Accès à l'Application</h2>
                    <h3>3.1. Conditions d'accès</h3>
                    <p>
                        L'Application est accessible gratuitement depuis les plateformes de téléchargement Apple App Store (iOS) et Google Play Store (Android). Les frais liés à l'accès au service (connexion Internet, équipement mobile) restent à la charge de l'utilisateur.
                    </p>
                    <h3>3.2. Disponibilité</h3>
                    <p>
                        APPLITWO s'efforce d'assurer une disponibilité optimale de l'Application. Toutefois, l'accès peut être temporairement suspendu pour des raisons de maintenance, de mise à jour ou pour tout autre motif technique, sans que cela ne puisse engager la responsabilité d'APPLITWO ni ouvrir droit à une quelconque indemnisation.
                    </p>
                    <h3>3.3. Évolutions</h3>
                    <p>
                        APPLITWO se réserve le droit de faire évoluer, modifier ou supprimer tout ou partie des fonctionnalités de l'Application à tout moment, sans préavis.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>Article 4 - Inscription et compte utilisateur</h2>
                    <h3>4.1. Création de compte</h3>
                    <p>
                        L'accès à certaines fonctionnalités de l'Application nécessite la création d'un compte utilisateur. Lors de l'inscription, l'utilisateur s'engage à fournir des informations exactes, complètes et à jour. Il s'engage à mettre à jour ces informations en cas de changement.
                    </p>
                    <p>
                        L'utilisateur doit être âgé d'au moins 18 ans ou disposer de l'autorisation de son représentant légal pour créer un compte.
                    </p>
                    <h3>4.2. Identifiants de connexion</h3>
                    <p>
                        L'utilisateur est seul responsable de la confidentialité de ses identifiants de connexion (adresse email et mot de passe). Toute utilisation de l'Application effectuée à partir de son compte est réputée avoir été effectuée par l'utilisateur lui-même.
                    </p>
                    <p>
                        En cas de perte, de vol ou d'utilisation frauduleuse de ses identifiants, l'utilisateur doit en informer immédiatement APPLITWO à l'adresse contact@applitwo.com.
                    </p>
                    <h3>4.3. Authentification tierce</h3>
                    <p>
                        L'Application propose des options de connexion via les services Google et Apple. En utilisant ces méthodes d'authentification, l'utilisateur accepte également les conditions d'utilisation de ces services tiers.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>Article 5 - Abonnements et tarification (Prestataires)</h2>
                    <h3>5.1. Principes généraux</h3>
                    <p>
                        L'accès aux services dédiés aux Prestataires est conditionné à la souscription d'un abonnement payant. Les tarifs et formules d'abonnement sont présentés dans l'Application lors du processus de souscription.
                    </p>
                    <h3>5.2. Paiement</h3>
                    <p>
                        Les paiements sont effectués de manière sécurisée via la plateforme de paiement Stripe. APPLITWO ne stocke aucune donnée bancaire, celles-ci étant exclusivement traitées par Stripe conformément aux normes de sécurité PCI-DSS.
                    </p>
                    <p>
                        Le paiement s'effectue par carte bancaire (Visa, Mastercard). Le montant de l'abonnement est prélevé lors de la souscription.
                    </p>
                    <h3>5.3. Durée et renouvellement</h3>
                    <p>
                        Les abonnements sont souscrits pour la durée indiquée lors de la commande. Sauf activation du renouvellement automatique par le Prestataire, l'abonnement prend fin à l'issue de la période souscrite.
                    </p>
                    <p>
                        En cas de renouvellement automatique, le Prestataire peut désactiver cette option à tout moment depuis son espace de gestion, avant la date de renouvellement.
                    </p>
                    <h3>5.4. Absence de droit de rétractation</h3>
                    <p>
                        Conformément à l'article L. 221-28 du Code de la consommation, le droit de rétractation ne s'applique pas aux contrats de fourniture de services pleinement exécutés avant la fin du délai de rétractation et dont l'exécution a commencé après accord préalable exprès du consommateur et renoncement exprès à son droit de rétractation.
                    </p>
                    <p>
                        En souscrivant un abonnement, le Prestataire reconnaît que le service est immédiatement accessible et renonce expressément à son droit de rétractation.
                    </p>
                    <h3>5.5. Absence de remboursement</h3>
                    <p>
                        <strong>Aucun remboursement ne sera effectué</strong> une fois l'abonnement souscrit et le paiement validé, quelle que soit la durée d'utilisation effective du service.
                    </p>
                    <p>
                        En contrepartie, APPLITWO s'engage à maintenir les fiches du Prestataire visibles et accessibles sur l'Application pendant toute la durée de l'abonnement souscrit, sous réserve du respect des présentes CGU par le Prestataire.
                    </p>
                    <h3>5.6. Codes promotionnels</h3>
                    <p>
                        APPLITWO peut proposer des codes promotionnels permettant un accès gratuit ou à tarif réduit aux services. Ces codes sont soumis à des conditions spécifiques (durée de validité, restrictions d'usage) communiquées lors de leur distribution. Les abonnements obtenus via code promotionnel ne donnent lieu à aucun remboursement et ne sont pas renouvelés automatiquement.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>Article 6 - Obligations des utilisateurs</h2>
                    <h3>6.1. Obligations générales</h3>
                    <p>
                        Tout utilisateur de l'Application s'engage à :
                    </p>
                    <ul>
                        <li>Utiliser l'Application conformément à sa destination et aux présentes CGU</li>
                        <li>Ne pas porter atteinte à l'ordre public et aux bonnes mœurs</li>
                        <li>Ne pas diffuser de contenu illicite, diffamatoire, injurieux ou contraire aux droits des tiers</li>
                        <li>Ne pas usurper l'identité d'un tiers</li>
                        <li>Ne pas tenter de contourner les mesures de sécurité de l'Application</li>
                        <li>Ne pas collecter les données personnelles d'autres utilisateurs</li>
                        <li>Ne pas utiliser l'Application à des fins commerciales non autorisées</li>
                        <li>Respecter les droits de propriété intellectuelle d'APPLITWO et des tiers</li>
                    </ul>
                    <h3>6.2. Obligations spécifiques des Prestataires</h3>
                    <p>
                        Les Prestataires s'engagent en outre à :
                    </p>
                    <ul>
                        <li>Fournir des informations exactes et à jour concernant leur établissement</li>
                        <li>Disposer de toutes les autorisations nécessaires à l'exercice de leur activité</li>
                        <li>Respecter la réglementation applicable à leur secteur d'activité</li>
                        <li>Honorer les avantages et privilèges proposés aux Clients</li>
                        <li>Ne pas publier de contenu trompeur ou de nature à induire les Clients en erreur</li>
                    </ul>
                    <h3>6.3. Sanctions</h3>
                    <p>
                        En cas de manquement aux présentes CGU, APPLITWO se réserve le droit de suspendre ou supprimer le compte de l'utilisateur concerné, sans préavis, mise en demeure préalable, ni indemnité d'aucune sorte.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>Article 7 - Données personnelles</h2>
                    <h3>7.1. Responsable du traitement</h3>
                    <p>
                        APPLITWO, en qualité de responsable du traitement, collecte et traite les données personnelles des utilisateurs conformément au Règlement Général sur la Protection des Données (RGPD) n° 2016/679 et à la loi Informatique et Libertés du 6 janvier 1978 modifiée.
                    </p>
                    <h3>7.2. Données collectées</h3>
                    <p>
                        Les données personnelles collectées peuvent inclure :
                    </p>
                    <ul>
                        <li><strong>Données d'identification :</strong> nom, prénom, adresse email, numéro de téléphone</li>
                        <li><strong>Données professionnelles (Prestataires) :</strong> dénomination sociale, SIRET, adresse de l'établissement</li>
                        <li><strong>Données de connexion :</strong> identifiants, logs de connexion</li>
                        <li><strong>Données d'utilisation :</strong> historique des scans, réservations, préférences</li>
                    </ul>
                    <h3>7.3. Géolocalisation</h3>
                    <p>
                        L'Application utilise la géolocalisation pour afficher les Prestataires à proximité de l'utilisateur. Cette fonctionnalité nécessite le consentement préalable de l'utilisateur.
                    </p>
                    <p>
                        <strong>Important :</strong> Les données de géolocalisation ne sont pas stockées sur nos serveurs. Elles sont uniquement conservées localement sur l'appareil de l'utilisateur (stockage local) et sont utilisées en temps réel pour l'affichage de la carte.
                    </p>
                    <h3>7.4. Finalités du traitement</h3>
                    <p>
                        Les données sont collectées pour les finalités suivantes :
                    </p>
                    <ul>
                        <li>Gestion des comptes utilisateurs</li>
                        <li>Fourniture des services de l'Application</li>
                        <li>Gestion des abonnements et de la facturation</li>
                        <li>Communication avec les utilisateurs</li>
                        <li>Amélioration des services</li>
                        <li>Respect des obligations légales</li>
                    </ul>
                    <h3>7.5. Base légale</h3>
                    <p>
                        Le traitement des données est fondé sur :
                    </p>
                    <ul>
                        <li>L'exécution du contrat (fourniture des services)</li>
                        <li>Le consentement de l'utilisateur (géolocalisation)</li>
                        <li>Les obligations légales (conservation des factures)</li>
                        <li>L'intérêt légitime (amélioration des services, sécurité)</li>
                    </ul>
                    <h3>7.6. Destinataires des données</h3>
                    <p>
                        Les données personnelles peuvent être transmises à :
                    </p>
                    <ul>
                        <li>Stripe (prestataire de paiement) pour le traitement des transactions</li>
                        <li>IONOS (hébergeur) pour l'hébergement des données</li>
                        <li>Les autorités compétentes en cas d'obligation légale</li>
                    </ul>
                    <p>
                        Les données sont hébergées au sein de l'Union Européenne (Allemagne).
                    </p>
                    <h3>7.7. Durée de conservation</h3>
                    <p>
                        Les données personnelles sont conservées pendant la durée de la relation contractuelle. En cas de suppression du compte, les données sont effacées immédiatement, à l'exception des données que nous sommes tenus de conserver pour des raisons légales (notamment les données de facturation conservées 10 ans conformément aux obligations comptables).
                    </p>
                    <h3>7.8. Droits des utilisateurs</h3>
                    <p>
                        Conformément au RGPD, vous disposez des droits suivants sur vos données personnelles :
                    </p>
                    <ul>
                        <li><strong>Droit d'accès :</strong> obtenir une copie de vos données</li>
                        <li><strong>Droit de rectification :</strong> corriger des données inexactes</li>
                        <li><strong>Droit à l'effacement :</strong> demander la suppression de vos données</li>
                        <li><strong>Droit à la limitation :</strong> limiter le traitement de vos données</li>
                        <li><strong>Droit à la portabilité :</strong> recevoir vos données dans un format structuré</li>
                        <li><strong>Droit d'opposition :</strong> vous opposer au traitement de vos données</li>
                        <li><strong>Droit de retirer votre consentement :</strong> à tout moment pour les traitements fondés sur le consentement</li>
                    </ul>
                    <p>
                        Pour exercer ces droits, vous pouvez nous contacter à l'adresse : <strong>contact@applitwo.com</strong>
                    </p>
                    <p>
                        Vous disposez également du droit d'introduire une réclamation auprès de la CNIL (Commission Nationale de l'Informatique et des Libertés) : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">www.cnil.fr</a>
                    </p>
                </section>

                <section className="legal-section">
                    <h2>Article 8 - Cookies et traceurs</h2>
                    <p>
                        L'Application mobile n'utilise pas de cookies au sens traditionnel du terme. Cependant, des données techniques peuvent être stockées localement sur votre appareil pour assurer le bon fonctionnement de l'Application (tokens d'authentification, préférences utilisateur).
                    </p>
                </section>

                <section className="legal-section">
                    <h2>Article 9 - Propriété intellectuelle</h2>
                    <h3>9.1. Droits d'APPLITWO</h3>
                    <p>
                        L'ensemble des éléments composant l'Application (textes, images, logos, icônes, sons, logiciels, base de données, design, architecture, code source) est la propriété exclusive d'APPLITWO ou de ses partenaires et est protégé par les lois françaises et internationales relatives à la propriété intellectuelle.
                    </p>
                    <p>
                        Toute reproduction, représentation, modification, publication, transmission, dénaturation, totale ou partielle de l'Application ou de son contenu, par quelque procédé que ce soit, sans l'autorisation expresse et préalable d'APPLITWO, est interdite et constituerait une contrefaçon sanctionnée par les articles L. 335-2 et suivants du Code de la propriété intellectuelle.
                    </p>
                    <h3>9.2. Contenu des Prestataires</h3>
                    <p>
                        Les Prestataires conservent la propriété intellectuelle des contenus qu'ils publient sur l'Application (textes descriptifs, photographies). En publiant ces contenus, ils accordent à APPLITWO une licence non exclusive, gratuite et mondiale d'utilisation, de reproduction et de représentation de ces contenus aux fins d'exploitation de l'Application.
                    </p>
                    <p>
                        Les Prestataires garantissent qu'ils disposent des droits nécessaires sur les contenus publiés et qu'ils ne portent pas atteinte aux droits des tiers.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>Article 10 - Responsabilité</h2>
                    <h3>10.1. Responsabilité d'APPLITWO</h3>
                    <p>
                        APPLITWO agit en qualité d'intermédiaire technique mettant en relation les Clients et les Prestataires. À ce titre, APPLITWO ne saurait être tenue responsable :
                    </p>
                    <ul>
                        <li>Des informations publiées par les Prestataires sur leurs fiches établissement</li>
                        <li>De la qualité des prestations fournies par les Prestataires</li>
                        <li>Des litiges pouvant survenir entre Clients et Prestataires</li>
                        <li>Des dommages directs ou indirects résultant de l'utilisation de l'Application</li>
                        <li>Des interruptions temporaires de service pour maintenance ou mise à jour</li>
                        <li>Des problèmes techniques indépendants de sa volonté (pannes réseau, etc.)</li>
                    </ul>
                    <h3>10.2. Garanties</h3>
                    <p>
                        L'Application est fournie « en l'état ». APPLITWO ne garantit pas que l'Application sera exempte d'erreurs, de bugs ou disponible de manière ininterrompue.
                    </p>
                    <h3>10.3. Force majeure</h3>
                    <p>
                        APPLITWO ne pourra être tenue responsable de l'inexécution de ses obligations en cas de survenance d'un événement de force majeure, tel que défini par l'article 1218 du Code civil et la jurisprudence des tribunaux français.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>Article 11 - Liens hypertextes</h2>
                    <p>
                        L'Application peut contenir des liens vers des sites ou applications tiers. APPLITWO n'exerce aucun contrôle sur ces sites tiers et décline toute responsabilité quant à leur contenu ou aux services qu'ils proposent.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>Article 12 - Résiliation</h2>
                    <h3>12.1. Résiliation par l'utilisateur</h3>
                    <p>
                        <strong>Clients :</strong> Tout Client peut supprimer son compte à tout moment depuis les paramètres de l'Application. La suppression entraîne l'effacement immédiat et définitif de l'ensemble de ses données personnelles.
                    </p>
                    <p>
                        <strong>Prestataires :</strong> Tout Prestataire peut supprimer son compte à tout moment. Cependant, cette suppression n'ouvre droit à aucun remboursement de l'abonnement en cours. Les données personnelles seront supprimées, à l'exception des données de facturation conservées conformément aux obligations légales.
                    </p>
                    <h3>12.2. Résiliation par APPLITWO</h3>
                    <p>
                        APPLITWO se réserve le droit de suspendre ou résilier l'accès d'un utilisateur en cas de :
                    </p>
                    <ul>
                        <li>Manquement aux présentes CGU</li>
                        <li>Comportement frauduleux ou abusif</li>
                        <li>Publication de contenu illicite</li>
                        <li>Atteinte aux droits d'APPLITWO ou de tiers</li>
                    </ul>
                    <p>
                        Cette résiliation peut intervenir sans préavis, mise en demeure préalable, ni indemnité.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>Article 13 - Modification des CGU</h2>
                    <p>
                        APPLITWO se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs seront informés de toute modification substantielle par notification dans l'Application ou par email.
                    </p>
                    <p>
                        La poursuite de l'utilisation de l'Application après notification de la modification vaut acceptation des nouvelles CGU. En cas de désaccord, l'utilisateur doit cesser d'utiliser l'Application et supprimer son compte.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>Article 14 - Intégralité</h2>
                    <p>
                        Les présentes CGU constituent l'intégralité de l'accord entre l'utilisateur et APPLITWO concernant l'utilisation de l'Application. Elles annulent et remplacent toutes les communications, propositions et accords antérieurs, écrits ou oraux, entre les parties.
                    </p>
                    <p>
                        Si une disposition des présentes CGU s'avérait nulle ou inapplicable, elle serait réputée non écrite, sans que cela n'affecte la validité des autres dispositions.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>Article 15 - Droit applicable et juridiction compétente</h2>
                    <p>
                        Les présentes CGU sont régies par le droit français.
                    </p>
                    <p>
                        En cas de litige relatif à l'interprétation, l'exécution ou la validité des présentes CGU, les parties s'efforceront de trouver une solution amiable. À défaut d'accord amiable dans un délai de trente (30) jours, le litige sera soumis aux tribunaux compétents du ressort de la Cour d'appel de Pau.
                    </p>
                    <p>
                        Conformément aux dispositions du Code de la consommation concernant le règlement amiable des litiges, les Clients consommateurs peuvent recourir gratuitement au service de médiation proposé par APPLITWO. Le médiateur peut être saisi via la plateforme européenne de règlement en ligne des litiges : <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer">https://ec.europa.eu/consumers/odr</a>
                    </p>
                </section>

                <section className="legal-section">
                    <h2>Article 16 - Contact</h2>
                    <p>
                        Pour toute question relative aux présentes CGU ou à l'utilisation de l'Application, vous pouvez nous contacter :
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
                    <p className="acceptance-note">
                        En utilisant l'application Mes Privilèges, vous reconnaissez avoir lu, compris et accepté les présentes Conditions Générales d'Utilisation.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TermsOfService;