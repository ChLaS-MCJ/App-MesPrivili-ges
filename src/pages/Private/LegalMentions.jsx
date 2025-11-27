import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';

const LegalMentions = () => {
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
                <h1>Mentions Légales</h1>
            </div>

            {/* Content */}
            <div className="legal-content">
                <section className="legal-section">
                    <h2>1. Éditeur du site</h2>
                    <p>
                        Le site [Nom de votre application] est édité par [Nom de votre entreprise].
                    </p>
                    <ul>
                        <li><strong>Raison sociale :</strong> [Nom de l'entreprise]</li>
                        <li><strong>Forme juridique :</strong> [SARL, SAS, etc.]</li>
                        <li><strong>Capital social :</strong> [Montant] €</li>
                        <li><strong>Siège social :</strong> [Adresse complète]</li>
                        <li><strong>RCS :</strong> [Ville] [Numéro]</li>
                        <li><strong>SIRET :</strong> [Numéro]</li>
                        <li><strong>TVA intracommunautaire :</strong> [Numéro]</li>
                        <li><strong>Téléphone :</strong> [Numéro]</li>
                        <li><strong>Email :</strong> [Adresse email]</li>
                    </ul>
                </section>

                <section className="legal-section">
                    <h2>2. Directeur de la publication</h2>
                    <p>
                        Le directeur de la publication est [Nom et Prénom].
                    </p>
                </section>

                <section className="legal-section">
                    <h2>3. Hébergement</h2>
                    <p>
                        Le site est hébergé par :
                    </p>
                    <ul>
                        <li><strong>Nom :</strong> [Nom de l'hébergeur]</li>
                        <li><strong>Adresse :</strong> [Adresse complète]</li>
                        <li><strong>Téléphone :</strong> [Numéro]</li>
                    </ul>
                </section>

                <section className="legal-section">
                    <h2>4. Propriété intellectuelle</h2>
                    <p>
                        L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
                    </p>
                    <p>
                        La reproduction de tout ou partie de ce site sur un support électronique ou autre quel qu'il soit, est formellement interdite sauf autorisation expresse du directeur de la publication.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>5. Protection des données personnelles</h2>
                    <p>
                        Conformément à la loi n° 78-17 du 6 janvier 1978 modifiée relative à l'informatique, aux fichiers et aux libertés et au Règlement Général sur la Protection des Données (RGPD), vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition aux données personnelles vous concernant.
                    </p>
                    <p>
                        Pour exercer ce droit, veuillez nous contacter à l'adresse suivante : [Email de contact].
                    </p>
                </section>

                <section className="legal-section">
                    <h2>6. Cookies</h2>
                    <p>
                        Le site peut être amené à vous demander l'acceptation des cookies pour des besoins de statistiques et d'affichage. Un cookie est une information déposée sur votre disque dur par le serveur du site que vous visitez.
                    </p>
                    <p>
                        Vous pouvez vous opposer à l'enregistrement de cookies en configurant votre navigateur.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>7. Limitation de responsabilité</h2>
                    <p>
                        Les informations contenues sur ce site sont aussi précises que possible et le site est périodiquement remis à jour, mais peut toutefois contenir des inexactitudes, des omissions ou des lacunes.
                    </p>
                    <p>
                        [Nom de l'entreprise] ne pourra être tenu responsable des dommages directs et indirects causés au matériel de l'utilisateur, lors de l'accès au site.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>8. Liens hypertextes</h2>
                    <p>
                        Le site peut contenir des liens hypertextes vers d'autres sites. [Nom de l'entreprise] n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>9. Droit applicable</h2>
                    <p>
                        Les présentes mentions légales sont régies par la loi française. En cas de litige, les tribunaux français seront seuls compétents.
                    </p>
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