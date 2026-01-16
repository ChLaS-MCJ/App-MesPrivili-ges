import { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeftOutlined, ArrowUpOutlined } from '@ant-design/icons';

const PrivacyPolicy = () => {
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
                <h1>Politique de Confidentialité</h1>
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
                    <h2>Introduction</h2>
                    <p>
                        La société APPLITWO, éditrice de l'application mobile <strong>Mes Privilèges</strong>, s'engage à protéger la vie privée des utilisateurs de son application. La présente Politique de Confidentialité a pour objectif de vous informer de manière claire et transparente sur la façon dont nous collectons, utilisons et protégeons vos données personnelles.
                    </p>
                    <p>
                        Cette politique s'applique à tous les utilisateurs de l'application Mes Privilèges, qu'ils soient Clients (utilisateurs particuliers) ou Prestataires (professionnels).
                    </p>
                    <p>
                        En utilisant notre application, vous acceptez les pratiques décrites dans la présente Politique de Confidentialité.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>1. Responsable du traitement</h2>
                    <p>
                        Le responsable du traitement des données personnelles est :
                    </p>
                    <div className="legal-info-box">
                        <p><strong>APPLITWO</strong></p>
                        <p>Société par Actions Simplifiée (SAS) au capital de 1 000 euros</p>
                        <p>Siège social : 18 Allée de la Passée, 64140 LONS</p>
                        <p>RCS Pau 941 291 999</p>
                        <p>SIRET : 941 291 999 00014</p>
                        <p>Représentée par Monsieur Maxime CHALAS FAURE, Directeur Général</p>
                    </div>
                    <p>
                        <strong>Contact pour les questions relatives aux données personnelles :</strong><br />
                        Email : contact@applitwo.com<br />
                        Téléphone : 07 60 02 43 78<br />
                        Adresse : APPLITWO - 18 Allée de la Passée, 64140 LONS
                    </p>
                </section>

                <section className="legal-section">
                    <h2>2. Données personnelles collectées</h2>
                    <p>
                        Nous collectons différentes catégories de données personnelles selon votre profil d'utilisateur :
                    </p>

                    <h3>2.1. Données collectées auprès des Clients</h3>
                    <table className="legal-table">
                        <thead>
                            <tr>
                                <th>Catégorie</th>
                                <th>Données</th>
                                <th>Caractère</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Identification</td>
                                <td>Nom, prénom, adresse email</td>
                                <td>Obligatoire</td>
                            </tr>
                            <tr>
                                <td>Contact</td>
                                <td>Numéro de téléphone</td>
                                <td>Facultatif</td>
                            </tr>
                            <tr>
                                <td>Authentification</td>
                                <td>Mot de passe (chiffré), identifiant Google/Apple</td>
                                <td>Obligatoire</td>
                            </tr>
                            <tr>
                                <td>Utilisation</td>
                                <td>Historique des scans QR, réservations, favoris</td>
                                <td>Automatique</td>
                            </tr>
                            <tr>
                                <td>Technique</td>
                                <td>Type d'appareil, version OS, logs de connexion</td>
                                <td>Automatique</td>
                            </tr>
                        </tbody>
                    </table>

                    <h3>2.2. Données collectées auprès des Prestataires</h3>
                    <table className="legal-table">
                        <thead>
                            <tr>
                                <th>Catégorie</th>
                                <th>Données</th>
                                <th>Caractère</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Identification personnelle</td>
                                <td>Nom, prénom, adresse email du représentant</td>
                                <td>Obligatoire</td>
                            </tr>
                            <tr>
                                <td>Identification entreprise</td>
                                <td>Dénomination sociale, SIRET, adresse, téléphone</td>
                                <td>Obligatoire</td>
                            </tr>
                            <tr>
                                <td>Authentification</td>
                                <td>Mot de passe (chiffré)</td>
                                <td>Obligatoire</td>
                            </tr>
                            <tr>
                                <td>Contenu</td>
                                <td>Description, photos, horaires, services proposés</td>
                                <td>Facultatif</td>
                            </tr>
                            <tr>
                                <td>Facturation</td>
                                <td>Historique des abonnements et paiements</td>
                                <td>Automatique</td>
                            </tr>
                            <tr>
                                <td>Statistiques</td>
                                <td>Nombre de vues, scans, réservations reçues</td>
                                <td>Automatique</td>
                            </tr>
                        </tbody>
                    </table>

                    <h3>2.3. Données NON collectées</h3>
                    <p>
                        Nous ne collectons <strong>jamais</strong> les données suivantes :
                    </p>
                    <ul>
                        <li>Données bancaires (traitées exclusivement par Stripe)</li>
                        <li>Données de santé</li>
                        <li>Opinions politiques ou religieuses</li>
                        <li>Origine ethnique</li>
                        <li>Données biométriques</li>
                    </ul>
                </section>

                <section className="legal-section">
                    <h2>3. Géolocalisation</h2>
                    <p>
                        L'application utilise la géolocalisation pour vous permettre de découvrir les prestataires à proximité de votre position.
                    </p>
                    <h3>3.1. Consentement</h3>
                    <p>
                        La géolocalisation est activée <strong>uniquement avec votre consentement explicite</strong>. Lors de la première utilisation de la carte, votre appareil vous demandera l'autorisation d'accéder à votre position. Vous pouvez refuser sans que cela n'empêche l'utilisation des autres fonctionnalités de l'application.
                    </p>
                    <h3>3.2. Stockage des données de localisation</h3>
                    <p>
                        <strong>Important :</strong> Vos données de géolocalisation ne sont <strong>PAS stockées sur nos serveurs</strong>.
                    </p>
                    <ul>
                        <li>Votre position est conservée uniquement dans le stockage local de votre appareil (localStorage)</li>
                        <li>Elle est utilisée en temps réel pour l'affichage de la carte</li>
                        <li>Elle n'est jamais transmise à nos serveurs ni à des tiers</li>
                        <li>Elle est automatiquement effacée lorsque vous fermez l'application</li>
                    </ul>
                    <h3>3.3. Désactivation</h3>
                    <p>
                        Vous pouvez désactiver la géolocalisation à tout moment dans les paramètres de votre appareil (iOS : Réglages &gt; Confidentialité &gt; Service de localisation ; Android : Paramètres &gt; Localisation).
                    </p>
                </section>

                <section className="legal-section">
                    <h2>4. Finalités du traitement</h2>
                    <p>
                        Vos données personnelles sont collectées et traitées pour les finalités suivantes :
                    </p>
                    <table className="legal-table">
                        <thead>
                            <tr>
                                <th>Finalité</th>
                                <th>Base légale</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Création et gestion de votre compte utilisateur</td>
                                <td>Exécution du contrat</td>
                            </tr>
                            <tr>
                                <td>Fourniture des services de l'application</td>
                                <td>Exécution du contrat</td>
                            </tr>
                            <tr>
                                <td>Gestion des abonnements et facturation (Prestataires)</td>
                                <td>Exécution du contrat</td>
                            </tr>
                            <tr>
                                <td>Affichage des prestataires à proximité</td>
                                <td>Consentement</td>
                            </tr>
                            <tr>
                                <td>Communication relative à votre compte</td>
                                <td>Exécution du contrat</td>
                            </tr>
                            <tr>
                                <td>Amélioration de nos services</td>
                                <td>Intérêt légitime</td>
                            </tr>
                            <tr>
                                <td>Prévention de la fraude et sécurité</td>
                                <td>Intérêt légitime</td>
                            </tr>
                            <tr>
                                <td>Respect des obligations légales et fiscales</td>
                                <td>Obligation légale</td>
                            </tr>
                        </tbody>
                    </table>
                </section>

                <section className="legal-section">
                    <h2>5. Destinataires des données</h2>
                    <p>
                        Vos données personnelles peuvent être transmises aux destinataires suivants :
                    </p>
                    <h3>5.1. Sous-traitants</h3>
                    <table className="legal-table">
                        <thead>
                            <tr>
                                <th>Sous-traitant</th>
                                <th>Rôle</th>
                                <th>Localisation</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>IONOS SE</td>
                                <td>Hébergement des données</td>
                                <td>Allemagne (UE)</td>
                            </tr>
                            <tr>
                                <td>Stripe Payments Europe, Ltd.</td>
                                <td>Traitement des paiements</td>
                                <td>Irlande (UE)</td>
                            </tr>
                        </tbody>
                    </table>
                    <p>
                        Ces sous-traitants sont contractuellement tenus de respecter la confidentialité de vos données et de les traiter uniquement selon nos instructions, conformément au RGPD.
                    </p>
                    <h3>5.2. Autres destinataires</h3>
                    <ul>
                        <li><strong>Prestataires :</strong> Les données relatives à vos réservations sont transmises aux prestataires concernés pour la gestion de ces réservations</li>
                        <li><strong>Autorités :</strong> Vos données peuvent être transmises aux autorités compétentes en cas d'obligation légale (réquisition judiciaire, etc.)</li>
                    </ul>
                    <h3>5.3. Absence de vente de données</h3>
                    <p>
                        <strong>APPLITWO ne vend jamais vos données personnelles à des tiers.</strong>
                    </p>
                </section>

                <section className="legal-section">
                    <h2>6. Transferts hors Union Européenne</h2>
                    <p>
                        Vos données personnelles sont hébergées au sein de l'Union Européenne (Allemagne) et ne font l'objet d'aucun transfert vers des pays situés hors de l'UE.
                    </p>
                    <p>
                        Si un tel transfert devait avoir lieu à l'avenir, il serait encadré par les garanties appropriées prévues par le RGPD (clauses contractuelles types, décision d'adéquation, etc.).
                    </p>
                </section>

                <section className="legal-section">
                    <h2>7. Durée de conservation</h2>
                    <p>
                        Nous conservons vos données personnelles selon les durées suivantes :
                    </p>
                    <table className="legal-table">
                        <thead>
                            <tr>
                                <th>Type de données</th>
                                <th>Durée de conservation</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Données de compte</td>
                                <td>Durée de la relation contractuelle + suppression immédiate à la clôture du compte</td>
                            </tr>
                            <tr>
                                <td>Données de connexion (logs)</td>
                                <td>1 an (obligation légale LCEN)</td>
                            </tr>
                            <tr>
                                <td>Données de facturation</td>
                                <td>10 ans (obligation comptable et fiscale)</td>
                            </tr>
                            <tr>
                                <td>Données de géolocalisation</td>
                                <td>Non stockées (temps réel uniquement)</td>
                            </tr>
                            <tr>
                                <td>Historique d'utilisation</td>
                                <td>Suppression immédiate à la clôture du compte</td>
                            </tr>
                        </tbody>
                    </table>
                </section>

                <section className="legal-section">
                    <h2>8. Sécurité des données</h2>
                    <p>
                        Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données personnelles contre tout accès non autorisé, perte, destruction ou altération :
                    </p>
                    <ul>
                        <li><strong>Chiffrement :</strong> Les données sensibles (mots de passe) sont chiffrées en base de données</li>
                        <li><strong>HTTPS :</strong> Toutes les communications sont sécurisées par protocole SSL/TLS</li>
                        <li><strong>Authentification :</strong> Système de tokens JWT sécurisés</li>
                        <li><strong>Paiements :</strong> Conformité PCI-DSS via Stripe (aucune donnée bancaire stockée)</li>
                        <li><strong>Hébergement :</strong> Serveurs sécurisés avec accès restreint</li>
                        <li><strong>Sauvegardes :</strong> Sauvegardes régulières et sécurisées</li>
                    </ul>
                </section>

                <section className="legal-section">
                    <h2>9. Vos droits</h2>
                    <p>
                        Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants sur vos données personnelles :
                    </p>
                    <h3>9.1. Droit d'accès (Article 15 RGPD)</h3>
                    <p>
                        Vous avez le droit d'obtenir la confirmation que des données vous concernant sont traitées et d'en obtenir une copie.
                    </p>
                    <h3>9.2. Droit de rectification (Article 16 RGPD)</h3>
                    <p>
                        Vous pouvez demander la correction de données inexactes ou incomplètes vous concernant. Vous pouvez également modifier directement certaines informations depuis votre profil dans l'application.
                    </p>
                    <h3>9.3. Droit à l'effacement (Article 17 RGPD)</h3>
                    <p>
                        Vous pouvez demander la suppression de vos données personnelles. Ce droit peut être exercé directement en supprimant votre compte depuis les paramètres de l'application. La suppression est immédiate et définitive.
                    </p>
                    <h3>9.4. Droit à la limitation du traitement (Article 18 RGPD)</h3>
                    <p>
                        Vous pouvez demander la limitation du traitement de vos données dans certains cas (contestation de l'exactitude, traitement illicite, etc.).
                    </p>
                    <h3>9.5. Droit à la portabilité (Article 20 RGPD)</h3>
                    <p>
                        Vous avez le droit de recevoir vos données dans un format structuré, couramment utilisé et lisible par machine, et de les transmettre à un autre responsable du traitement.
                    </p>
                    <h3>9.6. Droit d'opposition (Article 21 RGPD)</h3>
                    <p>
                        Vous pouvez vous opposer au traitement de vos données fondé sur l'intérêt légitime, pour des raisons tenant à votre situation particulière.
                    </p>
                    <h3>9.7. Droit de retirer votre consentement</h3>
                    <p>
                        Pour les traitements fondés sur le consentement (géolocalisation), vous pouvez retirer votre consentement à tout moment, sans que cela ne compromette la licéité du traitement effectué avant ce retrait.
                    </p>
                    <h3>9.8. Directives post-mortem</h3>
                    <p>
                        Vous pouvez définir des directives relatives à la conservation, à l'effacement et à la communication de vos données après votre décès.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>10. Exercice de vos droits</h2>
                    <p>
                        Pour exercer vos droits, vous pouvez :
                    </p>
                    <ul>
                        <li><strong>Par email :</strong> contact@applitwo.com</li>
                        <li><strong>Par courrier :</strong> APPLITWO - Protection des données - 18 Allée de la Passée, 64140 LONS</li>
                    </ul>
                    <p>
                        Votre demande doit être accompagnée d'un justificatif d'identité en cas de doute raisonnable sur votre identité.
                    </p>
                    <p>
                        Nous nous engageons à répondre à votre demande dans un délai d'un mois. Ce délai peut être prolongé de deux mois supplémentaires en cas de demande complexe, auquel cas nous vous en informerons.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>11. Réclamation auprès de la CNIL</h2>
                    <p>
                        Si vous estimez que le traitement de vos données personnelles constitue une violation du RGPD, vous avez le droit d'introduire une réclamation auprès de la Commission Nationale de l'Informatique et des Libertés (CNIL) :
                    </p>
                    <div className="legal-info-box">
                        <p><strong>CNIL</strong></p>
                        <p>3 Place de Fontenoy, TSA 80715</p>
                        <p>75334 PARIS CEDEX 07</p>
                        <p>Site web : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">www.cnil.fr</a></p>
                    </div>
                </section>

                <section className="legal-section">
                    <h2>12. Cookies et technologies similaires</h2>
                    <p>
                        L'application mobile Mes Privilèges <strong>n'utilise pas de cookies</strong> au sens traditionnel du terme, contrairement aux sites web.
                    </p>
                    <p>
                        Cependant, nous utilisons des technologies de stockage local pour le bon fonctionnement de l'application :
                    </p>
                    <table className="legal-table">
                        <thead>
                            <tr>
                                <th>Donnée stockée</th>
                                <th>Finalité</th>
                                <th>Durée</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Token d'authentification</td>
                                <td>Maintenir votre session connectée</td>
                                <td>Jusqu'à déconnexion</td>
                            </tr>
                            <tr>
                                <td>Préférences (thème)</td>
                                <td>Mémoriser vos préférences d'affichage</td>
                                <td>Jusqu'à suppression manuelle</td>
                            </tr>
                            <tr>
                                <td>Position géographique</td>
                                <td>Affichage de la carte</td>
                                <td>Session uniquement</td>
                            </tr>
                        </tbody>
                    </table>
                    <p>
                        Ces données sont stockées uniquement sur votre appareil et sont nécessaires au fonctionnement de l'application (cookies "strictement nécessaires" au sens de la directive ePrivacy). Elles ne nécessitent pas votre consentement préalable.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>13. Mineurs</h2>
                    <p>
                        L'application Mes Privilèges est destinée aux personnes âgées de 18 ans ou plus. Nous ne collectons pas sciemment de données personnelles concernant des mineurs.
                    </p>
                    <p>
                        Si vous êtes parent ou tuteur légal et que vous pensez que votre enfant mineur nous a fourni des données personnelles, veuillez nous contacter immédiatement à contact@applitwo.com afin que nous puissions supprimer ces informations.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>14. Modifications de la Politique de Confidentialité</h2>
                    <p>
                        Nous nous réservons le droit de modifier la présente Politique de Confidentialité à tout moment. En cas de modification substantielle, nous vous en informerons par :
                    </p>
                    <ul>
                        <li>Une notification dans l'application</li>
                        <li>Un email à l'adresse associée à votre compte</li>
                    </ul>
                    <p>
                        La date de dernière mise à jour est indiquée en bas de ce document. Nous vous encourageons à consulter régulièrement cette page.
                    </p>
                    <p>
                        La poursuite de l'utilisation de l'application après notification des modifications vaut acceptation de la nouvelle Politique de Confidentialité.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>15. Contact</h2>
                    <p>
                        Pour toute question concernant la présente Politique de Confidentialité ou le traitement de vos données personnelles, vous pouvez nous contacter :
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
                        En utilisant l'application Mes Privilèges, vous reconnaissez avoir lu et compris la présente Politique de Confidentialité.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;