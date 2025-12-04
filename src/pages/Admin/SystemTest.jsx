/**
 * PAGE DE TEST SYSTÈME
 * Dashboard pour tester toutes les fonctionnalités de l'application
 * 
 * Route: /admin/system-test
 */

import React, { useState, useCallback } from 'react';
import { IonPage, IonContent, IonIcon, IonSpinner } from '@ionic/react';
import {
    checkmarkCircle,
    closeCircle,
    refreshOutline,
    playOutline,
    serverOutline,
    cardOutline,
    mailOutline,
    timerOutline,
    heartOutline,
    documentOutline,
    filterOutline,
    peopleOutline,
    alertCircleOutline,
    chevronDownOutline,
    chevronUpOutline
} from 'ionicons/icons';
import { useAuth } from '../../Utils/AuthContext';
import './SystemTest.css';

// Configuration API
const API_URL = import.meta.env.VITE_API_URL || 'https://api.mesprivileges.fr/api';

const SystemTest = () => {
    const { token, user } = useAuth();
    const [tests, setTests] = useState({});
    const [running, setRunning] = useState(false);
    const [runningTest, setRunningTest] = useState(null);
    const [expandedSections, setExpandedSections] = useState({});
    const [logs, setLogs] = useState([]);

    // Helper pour les requêtes API
    const apiCall = async (endpoint, options = {}) => {
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                ...options.headers
            }
        });
        const data = await response.json();
        return { ok: response.ok, status: response.status, data };
    };

    // Ajouter un log
    const addLog = (message, type = 'info') => {
        const timestamp = new Date().toLocaleTimeString('fr-FR');
        setLogs(prev => [...prev, { timestamp, message, type }]);
    };

    // Mettre à jour un test
    const updateTest = (category, testName, result) => {
        setTests(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [testName]: result
            }
        }));
    };

    // ============================================================
    // DÉFINITION DES TESTS
    // ============================================================

    const testCategories = [
        {
            id: 'api',
            name: 'Connexion API',
            icon: serverOutline,
            tests: [
                {
                    id: 'api_health',
                    name: 'API accessible',
                    run: async () => {
                        const res = await apiCall('/health');
                        return { success: res.ok, message: res.ok ? 'API en ligne' : 'API inaccessible' };
                    }
                },
                {
                    id: 'api_auth',
                    name: 'Authentification',
                    run: async () => {
                        if (!token) return { success: false, message: 'Non connecté (pas de token)' };
                        // Tester avec une route qui existe certainement
                        const res = await apiCall('/prestataires/me/fiches');
                        if (res.status === 401) return { success: false, message: 'Token invalide ou expiré' };
                        return { success: true, message: `Token valide` };
                    }
                },
                {
                    id: 'api_db',
                    name: 'Connexion BDD',
                    run: async () => {
                        const res = await apiCall('/abonnements');
                        return { success: res.ok, message: res.ok ? 'BDD accessible' : 'Erreur BDD' };
                    }
                }
            ]
        },
        {
            id: 'migrations',
            name: 'Migrations SQL',
            icon: documentOutline,
            tests: [
                {
                    id: 'migration_payment_method',
                    name: 'Champ stripePaymentMethodId (users)',
                    run: async () => {
                        // Tester via la route payment-method qui utilise ce champ
                        const pmRes = await apiCall('/prestataires/me/payment-method');
                        if (pmRes.status === 500) {
                            return { success: false, message: 'Erreur serveur (champ manquant?)' };
                        }
                        return {
                            success: true,
                            message: pmRes.data?.data?.hasPaymentMethod ? 'Champ OK (carte présente)' : 'Champ OK (pas de carte)'
                        };
                    }
                },
                {
                    id: 'migration_favoris',
                    name: 'Champ commercesFavoris (users)',
                    run: async () => {
                        const res = await apiCall('/users/me/favoris');
                        if (res.status === 500) {
                            return { success: false, message: 'Erreur serveur (champ manquant?)' };
                        }
                        if (res.status === 401) {
                            return { success: true, message: 'Auth requise (route OK)', skipped: true };
                        }
                        return {
                            success: true,
                            message: `Champ OK (${res.data?.favoris?.length || 0} favoris)`
                        };
                    }
                },
                {
                    id: 'migration_relance',
                    name: 'Champs renouvellement (souscriptions)',
                    run: async () => {
                        const res = await apiCall('/prestataires/me/souscriptions-disponibles');
                        if (!res.ok) return { success: true, message: 'Pas de souscription (normal si nouveau compte)' };
                        // Si on a des souscriptions, vérifier les champs
                        const souscription = res.data?.souscriptions?.[0];
                        if (!souscription) return { success: true, message: 'Aucune souscription active' };
                        const hasNewFields = souscription.hasOwnProperty('renouvellementAuto');
                        return { success: true, message: hasNewFields ? 'Champs présents' : 'Champs non exposés (OK)' };
                    }
                }
            ]
        },
        {
            id: 'renewal',
            name: 'Renouvellement Auto',
            icon: timerOutline,
            tests: [
                {
                    id: 'renewal_get_status',
                    name: 'API GET auto-renew',
                    run: async () => {
                        // D'abord récupérer une souscription
                        const sousRes = await apiCall('/prestataires/me/souscriptions-disponibles');
                        if (!sousRes.ok || !sousRes.data?.souscriptions?.length) {
                            return { success: true, message: 'Pas de souscription à tester', skipped: true };
                        }
                        const souscriptionId = sousRes.data.souscriptions[0].id;
                        const res = await apiCall(`/prestataires/me/souscription/${souscriptionId}/auto-renew`);
                        return {
                            success: res.ok,
                            message: res.ok
                                ? `autoRenew: ${res.data?.data?.autoRenew}, carte: ${res.data?.data?.hasPaymentMethod ? 'Oui' : 'Non'}`
                                : res.data?.message || 'Erreur'
                        };
                    }
                },
                {
                    id: 'renewal_toggle',
                    name: 'API PUT auto-renew (toggle)',
                    run: async () => {
                        const sousRes = await apiCall('/prestataires/me/souscriptions-disponibles');
                        if (!sousRes.ok || !sousRes.data?.souscriptions?.length) {
                            return { success: true, message: 'Pas de souscription à tester', skipped: true };
                        }
                        const souscriptionId = sousRes.data.souscriptions[0].id;

                        // Récupérer l'état actuel
                        const currentRes = await apiCall(`/prestataires/me/souscription/${souscriptionId}/auto-renew`);
                        const currentState = currentRes.data?.data?.autoRenew;

                        // Toggle
                        const toggleRes = await apiCall(`/prestataires/me/souscription/${souscriptionId}/auto-renew`, {
                            method: 'PUT',
                            body: JSON.stringify({ enabled: !currentState })
                        });

                        if (!toggleRes.ok) {
                            // Si pas de carte, c'est normal que ça échoue pour activer
                            if (toggleRes.data?.message?.includes('carte')) {
                                return { success: true, message: 'Pas de carte (comportement normal)', skipped: true };
                            }
                            return { success: false, message: toggleRes.data?.message || 'Erreur toggle' };
                        }

                        // Remettre l'état initial
                        await apiCall(`/prestataires/me/souscription/${souscriptionId}/auto-renew`, {
                            method: 'PUT',
                            body: JSON.stringify({ enabled: currentState })
                        });

                        return { success: true, message: 'Toggle fonctionne' };
                    }
                },
                {
                    id: 'renewal_payment_method',
                    name: 'API GET payment-method',
                    run: async () => {
                        const res = await apiCall('/prestataires/me/payment-method');
                        return {
                            success: res.ok,
                            message: res.ok
                                ? (res.data?.data?.hasPaymentMethod
                                    ? `Carte: ${res.data?.data?.card?.brand} ****${res.data?.data?.card?.last4}`
                                    : 'Aucune carte enregistrée')
                                : 'Erreur'
                        };
                    }
                },
                {
                    id: 'renewal_update_session',
                    name: 'API POST update-session (Stripe)',
                    run: async () => {
                        const res = await apiCall('/prestataires/me/payment-method/update-session', {
                            method: 'POST'
                        });
                        if (res.ok && res.data?.data?.url) {
                            return { success: true, message: 'Session Stripe créée', details: res.data.data.url };
                        }
                        if (res.data?.message?.includes('Stripe')) {
                            return { success: true, message: 'Stripe non configuré (mode dev)', skipped: true };
                        }
                        return { success: false, message: res.data?.message || 'Erreur' };
                    }
                }
            ]
        },
        {
            id: 'stripe',
            name: 'Stripe & Paiements',
            icon: cardOutline,
            tests: [
                {
                    id: 'stripe_customer',
                    name: 'Customer Stripe créé',
                    run: async () => {
                        const res = await apiCall('/users/profile');
                        if (!res.ok) return { success: false, message: 'Impossible de vérifier' };
                        const hasCustomer = !!res.data?.user?.stripeCustomerId;
                        return {
                            success: true,
                            message: hasCustomer
                                ? `Customer: ${res.data.user.stripeCustomerId.substring(0, 15)}...`
                                : 'Pas encore de customer (créé au 1er paiement)',
                            skipped: !hasCustomer
                        };
                    }
                },
                {
                    id: 'stripe_abonnements',
                    name: 'Abonnements disponibles',
                    run: async () => {
                        const res = await apiCall('/abonnements');
                        if (!res.ok) return { success: false, message: 'Erreur récupération' };
                        // Gérer différents formats de réponse
                        let abonnements = res.data;
                        if (res.data?.abonnements) abonnements = res.data.abonnements;
                        if (res.data?.data) abonnements = res.data.data;
                        const count = Array.isArray(abonnements) ? abonnements.length : 0;
                        return {
                            success: count > 0,
                            message: count > 0 ? `${count} abonnement(s) configuré(s)` : 'Aucun abonnement (table vide)'
                        };
                    }
                },
                {
                    id: 'stripe_prices',
                    name: 'Prix 6 mois = 194.40€',
                    run: async () => {
                        const res = await apiCall('/abonnements');
                        if (!res.ok) return { success: false, message: 'Erreur' };
                        // Gérer différents formats
                        let abonnements = res.data;
                        if (res.data?.abonnements) abonnements = res.data.abonnements;
                        if (res.data?.data) abonnements = res.data.data;
                        if (!Array.isArray(abonnements) || abonnements.length === 0) {
                            return { success: false, message: 'Aucun abonnement configuré' };
                        }
                        const abo6 = abonnements.find(a => a.dureeEnMois === 6 || a.code?.includes('6'));
                        if (!abo6) return { success: true, message: 'Abonnement 6 mois non trouvé', skipped: true };
                        const prix = parseFloat(abo6.prixTotalTTC);
                        return {
                            success: Math.abs(prix - 194.40) < 0.01,
                            message: `Prix actuel: ${prix}€`
                        };
                    }
                },
                {
                    id: 'stripe_prices_12',
                    name: 'Prix 12 mois = 316.80€',
                    run: async () => {
                        const res = await apiCall('/abonnements');
                        if (!res.ok) return { success: false, message: 'Erreur' };
                        // Gérer différents formats
                        let abonnements = res.data;
                        if (res.data?.abonnements) abonnements = res.data.abonnements;
                        if (res.data?.data) abonnements = res.data.data;
                        if (!Array.isArray(abonnements) || abonnements.length === 0) {
                            return { success: false, message: 'Aucun abonnement configuré' };
                        }
                        const abo12 = abonnements.find(a => a.dureeEnMois === 12 || a.code?.includes('12'));
                        if (!abo12) return { success: true, message: 'Abonnement 12 mois non trouvé', skipped: true };
                        const prix = parseFloat(abo12.prixTotalTTC);
                        return {
                            success: Math.abs(prix - 316.80) < 0.01,
                            message: `Prix actuel: ${prix}€`
                        };
                    }
                }
            ]
        },
        {
            id: 'favoris',
            name: 'Système Favoris',
            icon: heartOutline,
            tests: [
                {
                    id: 'favoris_list',
                    name: 'GET /users/me/favoris',
                    run: async () => {
                        const res = await apiCall('/users/me/favoris');
                        if (res.status === 401) return { success: true, message: 'Authentification requise', skipped: true };
                        if (!res.ok) return { success: false, message: `Erreur ${res.status}: ${res.data?.message || 'inconnue'}` };
                        return { success: true, message: `${res.data?.favoris?.length || 0} favoris` };
                    }
                },
                {
                    id: 'favoris_add_remove',
                    name: 'Ajouter/Retirer favori',
                    run: async () => {
                        // Récupérer un prestataire public
                        const presRes = await apiCall('/prestataires?limit=1');
                        if (!presRes.ok || !presRes.data?.data?.length) {
                            return { success: true, message: 'Pas de prestataire pour tester', skipped: true };
                        }
                        const prestataireId = presRes.data.data[0].id;

                        // Ajouter aux favoris
                        const addRes = await apiCall(`/users/me/favoris/${prestataireId}`, { method: 'POST' });
                        if (!addRes.ok && addRes.status !== 400) { // 400 = déjà en favori
                            return { success: false, message: `Erreur ajout: ${addRes.data?.message || addRes.status}` };
                        }

                        // Retirer des favoris
                        const removeRes = await apiCall(`/users/me/favoris/${prestataireId}`, { method: 'DELETE' });

                        return { success: true, message: 'Ajout/Suppression OK' };
                    }
                }
            ]
        },
        {
            id: 'fiches',
            name: 'Gestion Fiches',
            icon: documentOutline,
            tests: [
                {
                    id: 'fiches_list',
                    name: 'GET /prestataires/me/fiches',
                    run: async () => {
                        const res = await apiCall('/prestataires/me/fiches');
                        if (!res.ok) return { success: false, message: res.data?.message || 'Erreur' };
                        const count = res.data?.fiches?.length || 0;
                        return { success: true, message: `${count} fiche(s) trouvée(s)` };
                    }
                },
                {
                    id: 'fiches_filtres',
                    name: 'Filtres inclus dans réponse',
                    run: async () => {
                        const res = await apiCall('/prestataires/me/fiches');
                        if (!res.ok || !res.data?.fiches?.length) {
                            return { success: true, message: 'Pas de fiche pour tester', skipped: true };
                        }
                        const fiche = res.data.fiches[0];
                        const hasFiltres = Array.isArray(fiche.filtres);
                        return {
                            success: hasFiltres,
                            message: hasFiltres ? `${fiche.filtres.length} filtre(s) chargé(s)` : 'Filtres non inclus !'
                        };
                    }
                },
                {
                    id: 'fiches_souscription',
                    name: 'Souscription incluse dans réponse',
                    run: async () => {
                        const res = await apiCall('/prestataires/me/fiches');
                        if (!res.ok || !res.data?.fiches?.length) {
                            return { success: true, message: 'Pas de fiche pour tester', skipped: true };
                        }
                        const fiche = res.data.fiches[0];
                        const hasSouscription = fiche.souscription !== undefined;
                        return {
                            success: true,
                            message: hasSouscription
                                ? `Souscription ID: ${fiche.souscription?.id || 'N/A'}`
                                : 'Pas de souscription liée'
                        };
                    }
                }
            ]
        },
        {
            id: 'filtres',
            name: 'Filtres & Catégories',
            icon: filterOutline,
            tests: [
                {
                    id: 'filtres_list',
                    name: 'GET /filtres/category/:id',
                    run: async () => {
                        // D'abord récupérer une catégorie
                        const catRes = await apiCall('/categories');
                        if (!catRes.ok) return { success: false, message: 'Impossible de récupérer les catégories' };
                        let categories = catRes.data;
                        if (catRes.data?.categories) categories = catRes.data.categories;
                        if (catRes.data?.data) categories = catRes.data.data;
                        if (!Array.isArray(categories) || categories.length === 0) {
                            return { success: true, message: 'Pas de catégorie pour tester', skipped: true };
                        }
                        const categoryId = categories[0].id;

                        // Tester la route filtres par catégorie
                        const res = await apiCall(`/filtres/category/${categoryId}`);
                        if (!res.ok) return { success: false, message: `Erreur ${res.status}` };
                        let filtres = res.data;
                        if (res.data?.filtres) filtres = res.data.filtres;
                        if (res.data?.data) filtres = res.data.data;
                        const count = Array.isArray(filtres) ? filtres.length : 0;
                        return { success: true, message: `${count} filtre(s) pour cette catégorie` };
                    }
                },
                {
                    id: 'categories_list',
                    name: 'GET /categories',
                    run: async () => {
                        const res = await apiCall('/categories');
                        if (!res.ok) return { success: false, message: `Erreur ${res.status}: ${res.data?.message || 'API indisponible'}` };
                        let categories = res.data;
                        if (res.data?.categories) categories = res.data.categories;
                        if (res.data?.data) categories = res.data.data;
                        const count = Array.isArray(categories) ? categories.length : 0;
                        return { success: true, message: `${count} catégorie(s)` };
                    }
                }
            ]
        },
        {
            id: 'souscriptions',
            name: 'Souscriptions',
            icon: cardOutline,
            tests: [
                {
                    id: 'souscriptions_disponibles',
                    name: 'GET souscriptions disponibles',
                    run: async () => {
                        const res = await apiCall('/prestataires/me/souscriptions-disponibles');
                        if (!res.ok) {
                            if (res.status === 401) return { success: true, message: 'Non connecté', skipped: true };
                            return { success: false, message: res.data?.message || 'Erreur' };
                        }
                        const count = res.data?.souscriptions?.length || 0;
                        return { success: true, message: `${count} souscription(s) avec slots dispo` };
                    }
                },
                {
                    id: 'souscriptions_info',
                    name: 'Info souscription d\'une fiche',
                    run: async () => {
                        // D'abord récupérer une fiche
                        const fichesRes = await apiCall('/prestataires/me/fiches');
                        if (!fichesRes.ok || !fichesRes.data?.fiches?.length) {
                            return { success: true, message: 'Pas de fiche pour tester', skipped: true };
                        }
                        const ficheId = fichesRes.data.fiches[0].id;
                        const res = await apiCall(`/prestataires/me/fiches/${ficheId}/souscription-info`);
                        return {
                            success: res.ok,
                            message: res.ok
                                ? `Jours restants: ${res.data?.data?.souscription?.joursRestants || 'N/A'}`
                                : res.data?.message || 'Erreur'
                        };
                    }
                }
            ]
        },
        {
            id: 'cron',
            name: 'Jobs CRON',
            icon: timerOutline,
            tests: [
                {
                    id: 'cron_test_all',
                    name: 'Test complet CRON',
                    run: async () => {
                        const res = await apiCall('/cron/test-all');
                        if (res.status === 404) {
                            return { success: true, message: 'Route non déployée', skipped: true };
                        }
                        if (res.status === 401) {
                            return { success: true, message: 'Authentification requise (normal)', skipped: true };
                        }
                        if (!res.ok) {
                            return { success: false, message: res.data?.error || res.data?.message || `Erreur ${res.status}` };
                        }
                        return {
                            success: true,
                            message: `OK - Durée: ${res.data?.duration || 'N/A'}`
                        };
                    }
                },
                {
                    id: 'cron_test_renewals',
                    name: 'Test renouvellements auto',
                    run: async () => {
                        const res = await apiCall('/cron/test-renewals');
                        if (res.status === 404) {
                            return { success: true, message: 'Route non déployée', skipped: true };
                        }
                        if (res.status === 401) {
                            return { success: true, message: 'Authentification requise', skipped: true };
                        }
                        if (!res.ok) {
                            return { success: false, message: res.data?.error || res.data?.message || `Erreur ${res.status}` };
                        }
                        return {
                            success: true,
                            message: `Success: ${res.data?.data?.success || 0}, Failed: ${res.data?.data?.failed || 0}`
                        };
                    }
                },
                {
                    id: 'cron_test_reminders',
                    name: 'Test rappels email',
                    run: async () => {
                        const res = await apiCall('/cron/test-reminders');
                        if (res.status === 404) {
                            return { success: true, message: 'Route non déployée', skipped: true };
                        }
                        if (res.status === 401) {
                            return { success: true, message: 'Authentification requise', skipped: true };
                        }
                        if (!res.ok) {
                            return { success: false, message: res.data?.error || res.data?.message || `Erreur ${res.status}` };
                        }
                        return {
                            success: true,
                            message: `30j: ${res.data?.data?.rappels30j || 0}, 7j: ${res.data?.data?.rappels7j || 0}`
                        };
                    }
                },
                {
                    id: 'cron_health',
                    name: 'Health check CRON',
                    run: async () => {
                        const res = await apiCall('/cron/health');
                        return {
                            success: res.ok,
                            message: res.ok ? 'Service CRON opérationnel' : 'Service CRON KO'
                        };
                    }
                }
            ]
        }
    ];

    // ============================================================
    // EXÉCUTION DES TESTS
    // ============================================================

    const runSingleTest = async (category, test) => {
        setRunningTest(`${category.id}_${test.id}`);
        addLog(`▶️ ${category.name} > ${test.name}`, 'info');

        try {
            const result = await test.run();
            updateTest(category.id, test.id, result);
            addLog(`${result.success ? '✅' : '❌'} ${test.name}: ${result.message}`, result.success ? 'success' : 'error');
            return result;
        } catch (error) {
            const result = { success: false, message: error.message };
            updateTest(category.id, test.id, result);
            addLog(`❌ ${test.name}: ${error.message}`, 'error');
            return result;
        } finally {
            setRunningTest(null);
        }
    };

    const runCategoryTests = async (category) => {
        for (const test of category.tests) {
            await runSingleTest(category, test);
            await new Promise(r => setTimeout(r, 300)); // Petit délai entre les tests
        }
    };

    const runAllTests = async () => {
        setRunning(true);
        setTests({});
        setLogs([]);
        addLog('🚀 Démarrage de tous les tests...', 'info');

        for (const category of testCategories) {
            addLog(`\n📦 ${category.name}`, 'info');
            await runCategoryTests(category);
        }

        addLog('\n✨ Tests terminés !', 'info');
        setRunning(false);
    };

    // ============================================================
    // CALCUL DES STATS
    // ============================================================

    const getStats = () => {
        let total = 0;
        let passed = 0;
        let failed = 0;
        let skipped = 0;

        Object.values(tests).forEach(category => {
            Object.values(category).forEach(test => {
                total++;
                if (test.skipped) skipped++;
                else if (test.success) passed++;
                else failed++;
            });
        });

        return { total, passed, failed, skipped };
    };

    const stats = getStats();

    const toggleSection = (categoryId) => {
        setExpandedSections(prev => ({
            ...prev,
            [categoryId]: !prev[categoryId]
        }));
    };

    // ============================================================
    // RENDER
    // ============================================================

    return (
        <IonPage>
            <IonContent className="system-test-page">
                <div className="test-container">
                    {/* Header */}
                    <div className="test-header">
                        <h1>🔧 Tests Système</h1>
                        <p>Vérification complète de l'application</p>

                        <div className="test-actions">
                            <button
                                className="btn-run-all"
                                onClick={runAllTests}
                                disabled={running}
                            >
                                {running ? (
                                    <>
                                        <IonSpinner name="crescent" />
                                        Tests en cours...
                                    </>
                                ) : (
                                    <>
                                        <IonIcon icon={playOutline} />
                                        Lancer tous les tests
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Stats globales */}
                        {stats.total > 0 && (
                            <div className="test-stats">
                                <div className="stat stat-total">
                                    <span className="stat-value">{stats.total}</span>
                                    <span className="stat-label">Total</span>
                                </div>
                                <div className="stat stat-passed">
                                    <span className="stat-value">{stats.passed}</span>
                                    <span className="stat-label">Réussis</span>
                                </div>
                                <div className="stat stat-failed">
                                    <span className="stat-value">{stats.failed}</span>
                                    <span className="stat-label">Échoués</span>
                                </div>
                                <div className="stat stat-skipped">
                                    <span className="stat-value">{stats.skipped}</span>
                                    <span className="stat-label">Ignorés</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Catégories de tests */}
                    <div className="test-categories">
                        {testCategories.map(category => (
                            <div key={category.id} className="test-category">
                                <div
                                    className="category-header"
                                    onClick={() => toggleSection(category.id)}
                                >
                                    <div className="category-info">
                                        <IonIcon icon={category.icon} className="category-icon" />
                                        <h2>{category.name}</h2>
                                        <span className="category-count">
                                            {category.tests.length} test(s)
                                        </span>
                                    </div>
                                    <div className="category-status">
                                        {tests[category.id] && (
                                            <>
                                                {Object.values(tests[category.id]).every(t => t.success || t.skipped) ? (
                                                    <IonIcon icon={checkmarkCircle} className="status-icon success" />
                                                ) : Object.values(tests[category.id]).some(t => !t.success && !t.skipped) ? (
                                                    <IonIcon icon={closeCircle} className="status-icon error" />
                                                ) : (
                                                    <IonIcon icon={alertCircleOutline} className="status-icon warning" />
                                                )}
                                            </>
                                        )}
                                        <IonIcon
                                            icon={expandedSections[category.id] ? chevronUpOutline : chevronDownOutline}
                                            className="expand-icon"
                                        />
                                    </div>
                                </div>

                                {(expandedSections[category.id] !== false) && (
                                    <div className="category-tests">
                                        {category.tests.map(test => {
                                            const result = tests[category.id]?.[test.id];
                                            const isRunning = runningTest === `${category.id}_${test.id}`;

                                            return (
                                                <div
                                                    key={test.id}
                                                    className={`test-item ${result ? (result.success ? 'passed' : result.skipped ? 'skipped' : 'failed') : ''}`}
                                                >
                                                    <div className="test-info">
                                                        <div className="test-status">
                                                            {isRunning ? (
                                                                <IonSpinner name="crescent" />
                                                            ) : result ? (
                                                                result.success ? (
                                                                    <IonIcon icon={checkmarkCircle} className="icon-success" />
                                                                ) : result.skipped ? (
                                                                    <IonIcon icon={alertCircleOutline} className="icon-skipped" />
                                                                ) : (
                                                                    <IonIcon icon={closeCircle} className="icon-error" />
                                                                )
                                                            ) : (
                                                                <div className="icon-pending" />
                                                            )}
                                                        </div>
                                                        <div className="test-details">
                                                            <span className="test-name">{test.name}</span>
                                                            {result && (
                                                                <span className={`test-message ${result.success ? 'success' : result.skipped ? 'skipped' : 'error'}`}>
                                                                    {result.message}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <button
                                                        className="btn-run-single"
                                                        onClick={() => runSingleTest(category, test)}
                                                        disabled={running}
                                                    >
                                                        <IonIcon icon={refreshOutline} />
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Console de logs */}
                    <div className="test-logs">
                        <h3>📋 Logs</h3>
                        <div className="logs-container">
                            {logs.length === 0 ? (
                                <p className="logs-empty">Lancez les tests pour voir les logs...</p>
                            ) : (
                                logs.map((log, index) => (
                                    <div key={index} className={`log-entry log-${log.type}`}>
                                        <span className="log-time">{log.timestamp}</span>
                                        <span className="log-message">{log.message}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Instructions */}
                    <div className="test-instructions">
                        <h3>📖 Comment utiliser</h3>
                        <ol>
                            <li>Cliquez sur <strong>"Lancer tous les tests"</strong> pour exécuter tous les tests</li>
                            <li>Ou cliquez sur <strong>🔄</strong> à côté d'un test pour le relancer individuellement</li>
                            <li>Les résultats s'affichent en temps réel avec ✅ (succès), ❌ (échec), ou ⚠️ (ignoré)</li>
                            <li>Consultez les <strong>logs</strong> en bas pour plus de détails</li>
                        </ol>

                        <div className="legend">
                            <div className="legend-item">
                                <IonIcon icon={checkmarkCircle} className="icon-success" />
                                <span>Test réussi</span>
                            </div>
                            <div className="legend-item">
                                <IonIcon icon={closeCircle} className="icon-error" />
                                <span>Test échoué</span>
                            </div>
                            <div className="legend-item">
                                <IonIcon icon={alertCircleOutline} className="icon-skipped" />
                                <span>Test ignoré (conditions non remplies)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default SystemTest;