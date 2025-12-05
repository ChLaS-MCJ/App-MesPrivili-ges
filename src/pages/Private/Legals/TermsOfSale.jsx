import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';

const TermsOfSale = () => {
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
                <h1>Conditions Générales de Vente</h1>
            </div>

            {/* Content */}
            <div className="legal-content">

                <section className="legal-section">
                    <h2>Préambule</h2>
                    <p>
                        Les présentes Conditions Générales de Vente (ci-après « CGV ») régissent les relations contractuelles entre la société APPLITWO et les professionnels souhaitant souscrire un abonnement pour référencer leur établissement sur l'application mobile Mes Privilèges (ci-après « le Prestataire » ou « le Client professionnel »).
                    </p>
                    <p>
                        Toute souscription d'abonnement implique l'acceptation sans réserve des présentes CGV.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>Article 1 - Identification du vendeur</h2>
                    <div className="legal-info-box">
                        <p><strong>APPLITWO</strong></p>
                        <p>Société par Actions Simplifiée (SAS) au capital de 1 000 euros</p>
                        <p>Siège social : 18 Allée de la Passée, 64140 LONS</p>
                        <p>RCS Pau 941 291 999</p>
                        <p>SIRET : 941 291 999 00014</p>
                        <p>N° TVA Intracommunautaire : FR 94 941291999</p>
                    </div>
                    <p>
                        <strong>Contact :</strong><br />
                        Email : contact@applitwo.com<br />
                        Téléphone : 07 60 02 43 78
                    </p>
                </section>

                <section className="legal-section">
                    <h2>Article 2 - Objet</h2>
                    <p>
                        Les présentes CGV ont pour objet de définir les conditions dans lesquelles APPLITWO fournit aux Prestataires un service de référencement et de visibilité sur l'application mobile Mes Privilèges, moyennant la souscription d'un abonnement payant.
                    </p>
                    <p>
                        Les services proposés comprennent :
                    </p>
                    <ul>
                        <li>La création et la gestion d'une ou plusieurs fiches établissement</li>
                        <li>Le référencement et la visibilité sur l'application auprès des utilisateurs</li>
                        <li>La possibilité de proposer des avantages et privilèges aux clients</li>
                        <li>La gestion des réservations reçues via l'application</li>
                        <li>L'accès à des statistiques de consultation</li>
                    </ul>
                </section>

                <section className="legal-section">
                    <h2>Article 3 - Champ d'application</h2>
                    <p>
                        Les présentes CGV s'appliquent exclusivement aux relations commerciales entre APPLITWO et les Prestataires agissant dans le cadre de leur activité professionnelle.
                    </p>
                    <p>
                        Le Prestataire déclare avoir la capacité juridique de contracter et agir pour les besoins de son activité commerciale, industrielle, artisanale, libérale ou agricole.
                    </p>
                    <p>
                        Les présentes CGV prévalent sur tout autre document du Prestataire, notamment ses conditions générales d'achat.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>Article 4 - Offres et tarifs</h2>
                    <h3>4.1. Présentation des offres</h3>
                    <p>
                        Les différentes formules d'abonnement, leurs caractéristiques et leurs tarifs sont présentés dans l'application lors du processus de souscription. Les offres sont valables tant qu'elles sont visibles dans l'application.
                    </p>
                    <h3>4.2. Prix</h3>
                    <p>
                        Les prix sont indiqués en euros, hors taxes (HT) et toutes taxes comprises (TTC). Le taux de TVA applicable est le taux en vigueur au jour de la facturation (actuellement 20%).
                    </p>
                    <p>
                        APPLITWO se réserve le droit de modifier ses tarifs à tout moment. Les modifications tarifaires ne s'appliquent pas aux abonnements en cours et ne prendront effet qu'au moment du renouvellement.
                    </p>
                    <h3>4.3. Codes promotionnels</h3>
                    <p>
                        APPLITWO peut proposer des codes promotionnels permettant un accès gratuit ou à tarif réduit aux services. Ces codes sont soumis à des conditions spécifiques :
                    </p>
                    <ul>
                        <li>Durée de validité limitée</li>
                        <li>Restrictions d'usage éventuelles (catégorie d'établissement, zone géographique)</li>
                        <li>Usage unique par établissement</li>
                        <li>Non cumulables avec d'autres offres</li>
                    </ul>
                    <p>
                        Les abonnements obtenus via code promotionnel ne font pas l'objet d'un renouvellement automatique.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>Article 5 - Commande</h2>
                    <h3>5.1. Processus de commande</h3>
                    <p>
                        La souscription d'un abonnement s'effectue directement dans l'application selon les étapes suivantes :
                    </p>
                    <ol>
                        <li>Création d'un compte Prestataire</li>
                        <li>Saisie des informations de l'établissement</li>
                        <li>Choix de la formule d'abonnement</li>
                        <li>Saisie des informations de paiement</li>
                        <li>Validation de la commande</li>
                        <li>Confirmation par email</li>
                    </ol>
                    <h3>5.2. Validation de la commande</h3>
                    <p>
                        La validation de la commande par le Prestataire vaut acceptation des présentes CGV et constitue une preuve du contrat de vente.
                    </p>
                    <p>
                        APPLITWO se réserve le droit de refuser toute commande pour motif légitime, notamment en cas de :
                    </p>
                    <ul>
                        <li>Informations manifestement erronées</li>
                        <li>Établissement ne respectant pas la réglementation en vigueur</li>
                        <li>Activité incompatible avec les valeurs de l'application</li>
                        <li>Incident de paiement antérieur</li>
                    </ul>
                    <h3>5.3. Confirmation</h3>
                    <p>
                        Un email de confirmation récapitulant les détails de l'abonnement souscrit est envoyé au Prestataire à l'adresse email associée à son compte.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>Article 6 - Paiement</h2>
                    <h3>6.1. Moyens de paiement</h3>
                    <p>
                        Le paiement s'effectue par carte bancaire (Visa, Mastercard) via la plateforme de paiement sécurisée Stripe.
                    </p>
                    <h3>6.2. Sécurité des paiements</h3>
                    <p>
                        Les transactions sont sécurisées par Stripe, certifié PCI-DSS niveau 1. APPLITWO ne stocke aucune donnée bancaire. Les informations de carte sont transmises directement à Stripe via une connexion sécurisée (SSL/TLS).
                    </p>
                    <h3>6.3. Exigibilité</h3>
                    <p>
                        Le paiement est exigible immédiatement lors de la souscription. L'abonnement n'est activé qu'après confirmation du paiement par Stripe.
                    </p>
                    <h3>6.4. Incident de paiement</h3>
                    <p>
                        En cas d'échec du paiement (carte refusée, fonds insuffisants, etc.), la commande est annulée et l'abonnement n'est pas activé. Le Prestataire est invité à renouveler sa tentative avec un autre moyen de paiement.
                    </p>
                    <h3>6.5. Facturation</h3>
                    <p>
                        Une facture conforme aux exigences légales est émise pour chaque paiement et est accessible depuis l'espace de gestion du Prestataire dans l'application.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>Article 7 - Durée et renouvellement</h2>
                    <h3>7.1. Durée de l'abonnement</h3>
                    <p>
                        L'abonnement est souscrit pour la durée indiquée lors de la commande (mensuelle, trimestrielle, annuelle, etc.). L'abonnement prend effet dès la confirmation du paiement.
                    </p>
                    <h3>7.2. Renouvellement automatique</h3>
                    <p>
                        Si le Prestataire a activé l'option de renouvellement automatique, l'abonnement sera automatiquement renouvelé à son échéance pour une durée identique, au tarif en vigueur au moment du renouvellement.
                    </p>
                    <p>
                        Le Prestataire est informé par email au moins 7 jours avant la date de renouvellement.
                    </p>
                    <h3>7.3. Désactivation du renouvellement</h3>
                    <p>
                        Le Prestataire peut désactiver le renouvellement automatique à tout moment depuis son espace de gestion dans l'application, au plus tard 24 heures avant la date de renouvellement.
                    </p>
                    <p>
                        La désactivation du renouvellement n'entraîne pas la résiliation immédiate de l'abonnement : le Prestataire continue de bénéficier des services jusqu'à la fin de la période en cours.
                    </p>
                    <h3>7.4. Fin de l'abonnement</h3>
                    <p>
                        À l'expiration de l'abonnement (sans renouvellement), les fiches du Prestataire ne sont plus visibles sur l'application. Le compte reste accessible pour permettre une éventuelle réactivation ultérieure.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>Article 8 - Droit de rétractation</h2>
                    <h3>8.1. Exclusion du droit de rétractation</h3>
                    <p>
                        Conformément à l'article L. 221-28 du Code de la consommation, le droit de rétractation ne peut être exercé pour les contrats de fourniture de services pleinement exécutés avant la fin du délai de rétractation et dont l'exécution a commencé après accord préalable exprès du consommateur et renoncement exprès à son droit de rétractation.
                    </p>
                    <p>
                        <strong>En souscrivant un abonnement, le Prestataire :</strong>
                    </p>
                    <ul>
                        <li>Reconnaît que le service (référencement et visibilité de sa fiche) commence immédiatement après la validation du paiement</li>
                        <li>Demande expressément l'exécution immédiate du service</li>
                        <li>Renonce expressément à son droit de rétractation</li>
                    </ul>
                    <h3>8.2. Application aux professionnels</h3>
                    <p>
                        Il est rappelé que le droit de rétractation prévu par le Code de la consommation ne s'applique qu'aux consommateurs et non aux professionnels. Les présentes CGV s'adressant exclusivement aux professionnels, le droit de rétractation ne leur est pas applicable.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>Article 9 - Politique de remboursement</h2>
                    <p>
                        <strong>Aucun remboursement ne sera effectué</strong> une fois l'abonnement souscrit et le paiement validé, quelles que soient les circonstances, notamment :
                    </p>
                    <ul>
                        <li>En cas de résiliation anticipée par le Prestataire</li>
                        <li>En cas de non-utilisation ou de sous-utilisation des services</li>
                        <li>En cas de fermeture temporaire ou définitive de l'établissement</li>
                        <li>En cas de suppression de la fiche par le Prestataire</li>
                    </ul>
                    <p>
                        <strong>Engagement d'APPLITWO :</strong> En contrepartie de cette politique, APPLITWO s'engage à maintenir les fiches du Prestataire visibles et accessibles sur l'application pendant toute la durée de l'abonnement souscrit, sous réserve du respect des CGU et des présentes CGV par le Prestataire.
                    </p>
                    <p>
                        <strong>Exception :</strong> Un remboursement pourra être envisagé uniquement en cas de manquement grave et avéré d'APPLITWO à ses obligations contractuelles, après mise en demeure restée sans effet pendant 30 jours.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>Article 10 - Obligations d'APPLITWO</h2>
                    <p>
                        APPLITWO s'engage à :
                    </p>
                    <ul>
                        <li>Mettre à disposition les services décrits dans l'offre souscrite</li>
                        <li>Assurer la visibilité des fiches du Prestataire pendant toute la durée de l'abonnement</li>
                        <li>Maintenir l'application accessible dans des conditions optimales (sous réserve des interruptions pour maintenance)</li>
                        <li>Assurer la sécurité et la confidentialité des données du Prestataire</li>
                        <li>Fournir une assistance en cas de difficulté technique</li>
                        <li>Informer le Prestataire de toute modification substantielle des services</li>
                    </ul>
                    <p>
                        APPLITWO est soumise à une obligation de moyens et non de résultat.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>Article 11 - Obligations du Prestataire</h2>
                    <p>
                        Le Prestataire s'engage à :
                    </p>
                    <ul>
                        <li>Fournir des informations exactes et à jour lors de l'inscription et pendant toute la durée de l'abonnement</li>
                        <li>Disposer de toutes les autorisations légales nécessaires à l'exercice de son activité</li>
                        <li>Respecter la réglementation applicable à son secteur d'activité</li>
                        <li>Ne pas publier de contenu illicite, trompeur ou portant atteinte aux droits des tiers</li>
                        <li>Honorer les avantages et privilèges proposés aux utilisateurs de l'application</li>
                        <li>Respecter les Conditions Générales d'Utilisation de l'application</li>
                        <li>Utiliser les services conformément à leur destination</li>
                    </ul>
                </section>

                <section className="legal-section">
                    <h2>Article 12 - Responsabilité</h2>
                    <h3>12.1. Limitation de responsabilité</h3>
                    <p>
                        La responsabilité d'APPLITWO ne pourra être engagée qu'en cas de faute prouvée et sera limitée aux dommages directs et prévisibles, à l'exclusion de tout dommage indirect (perte de chiffre d'affaires, perte de clientèle, préjudice d'image, etc.).
                    </p>
                    <p>
                        En tout état de cause, la responsabilité d'APPLITWO est limitée au montant de l'abonnement payé par le Prestataire au cours des 12 derniers mois précédant le fait générateur.
                    </p>
                    <h3>12.2. Exclusions de responsabilité</h3>
                    <p>
                        APPLITWO ne saurait être tenue responsable :
                    </p>
                    <ul>
                        <li>Des informations publiées par le Prestataire sur sa fiche</li>
                        <li>Des relations entre le Prestataire et les utilisateurs de l'application</li>
                        <li>De l'utilisation frauduleuse des identifiants du Prestataire</li>
                        <li>Des dysfonctionnements liés à l'environnement technique du Prestataire</li>
                        <li>Des interruptions pour maintenance ou mise à jour</li>
                        <li>Des cas de force majeure</li>
                    </ul>
                    <h3>12.3. Force majeure</h3>
                    <p>
                        Aucune des parties ne pourra être tenue responsable de l'inexécution de ses obligations en cas de force majeure au sens de l'article 1218 du Code civil.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>Article 13 - Résiliation</h2>
                    <h3>13.1. Résiliation par le Prestataire</h3>
                    <p>
                        Le Prestataire peut supprimer son compte à tout moment depuis les paramètres de l'application. Cette suppression :
                    </p>
                    <ul>
                        <li>Entraîne la désactivation immédiate de ses fiches</li>
                        <li>N'ouvre droit à aucun remboursement de l'abonnement en cours</li>
                        <li>Entraîne la suppression de ses données personnelles (hors données de facturation conservées légalement)</li>
                    </ul>
                    <h3>13.2. Résiliation par APPLITWO</h3>
                    <p>
                        APPLITWO se réserve le droit de résilier l'abonnement du Prestataire, sans préavis ni indemnité, en cas de :
                    </p>
                    <ul>
                        <li>Manquement aux présentes CGV ou aux CGU</li>
                        <li>Publication de contenu illicite ou contraire aux bonnes mœurs</li>
                        <li>Comportement frauduleux</li>
                        <li>Non-paiement (en cas de renouvellement)</li>
                        <li>Atteinte à l'image ou aux intérêts d'APPLITWO</li>
                    </ul>
                    <p>
                        En cas de résiliation pour faute du Prestataire, aucun remboursement ne sera effectué.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>Article 14 - Propriété intellectuelle</h2>
                    <p>
                        Le Prestataire conserve la propriété intellectuelle des contenus qu'il publie sur sa fiche (textes, photos). En publiant ces contenus, il accorde à APPLITWO une licence non exclusive, gratuite et mondiale d'utilisation aux fins d'exploitation de l'application.
                    </p>
                    <p>
                        Le Prestataire garantit qu'il dispose des droits nécessaires sur les contenus publiés et qu'ils ne portent pas atteinte aux droits des tiers. Il garantit APPLITWO contre tout recours de tiers à ce titre.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>Article 15 - Données personnelles</h2>
                    <p>
                        Les données personnelles du Prestataire sont collectées et traitées conformément à notre Politique de Confidentialité et au RGPD. Le Prestataire dispose des droits d'accès, de rectification, d'effacement, de limitation, de portabilité et d'opposition qu'il peut exercer en contactant contact@applitwo.com.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>Article 16 - Modification des CGV</h2>
                    <p>
                        APPLITWO se réserve le droit de modifier les présentes CGV à tout moment. Les modifications seront communiquées au Prestataire par email ou notification dans l'application au moins 30 jours avant leur entrée en vigueur.
                    </p>
                    <p>
                        Si le Prestataire n'accepte pas les nouvelles CGV, il peut résilier son abonnement avant leur entrée en vigueur. La poursuite de l'utilisation des services après cette date vaut acceptation des nouvelles CGV.
                    </p>
                    <p>
                        Les CGV applicables sont celles en vigueur au jour de la souscription ou du renouvellement de l'abonnement.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>Article 17 - Intégralité</h2>
                    <p>
                        Les présentes CGV, ainsi que les CGU de l'application, constituent l'intégralité de l'accord entre APPLITWO et le Prestataire. Elles remplacent tous les accords antérieurs, écrits ou oraux, relatifs au même objet.
                    </p>
                    <p>
                        Si une clause des présentes CGV était déclarée nulle ou inapplicable, les autres clauses resteraient en vigueur.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>Article 18 - Droit applicable et litiges</h2>
                    <h3>18.1. Droit applicable</h3>
                    <p>
                        Les présentes CGV sont régies par le droit français.
                    </p>
                    <h3>18.2. Règlement amiable</h3>
                    <p>
                        En cas de litige, les parties s'engagent à rechercher une solution amiable avant toute action judiciaire. Le Prestataire peut adresser sa réclamation par email à contact@applitwo.com. APPLITWO s'engage à répondre dans un délai de 30 jours.
                    </p>
                    <h3>18.3. Juridiction compétente</h3>
                    <p>
                        À défaut d'accord amiable dans un délai de 60 jours, tout litige relatif à l'interprétation ou l'exécution des présentes CGV sera soumis à la compétence exclusive des tribunaux du ressort de la Cour d'appel de Pau.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>Article 19 - Contact</h2>
                    <p>
                        Pour toute question relative aux présentes CGV, vous pouvez nous contacter :
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
                        En souscrivant un abonnement sur l'application Mes Privilèges, vous reconnaissez avoir lu, compris et accepté les présentes Conditions Générales de Vente.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TermsOfSale;