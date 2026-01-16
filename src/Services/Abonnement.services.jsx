/**
 * Service pour la gestion des abonnements
 * URLs mises à jour pour pointer vers /api/abonnements/
 */

const API_URL = import.meta.env.VITE_API_URL || 'https://cacao.mesprivileges.fr/api';

class AbonnementService {
  /**
   * Récupère le token d'authentification
   */
  static getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    };
  }

  /**
   * Récupérer tous les abonnements disponibles
   */
  static async getAbonnements() {
    try {
      const response = await fetch(`${API_URL}/abonnements`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });
      return await response.json();
    } catch (error) {
      console.error('Erreur getAbonnements:', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Récupérer un abonnement par son code
   */
  static async getAbonnementByCode(code) {
    try {
      const response = await fetch(`${API_URL}/abonnements/detail/${code}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });
      return await response.json();
    } catch (error) {
      console.error('Erreur getAbonnementByCode:', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Récupérer ma souscription active
   */
  static async getMaSouscription() {
    try {
      const response = await fetch(`${API_URL}/abonnements/ma-souscription`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });
      return await response.json();
    } catch (error) {
      console.error('Erreur getMaSouscription:', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Récupérer l'historique de mes souscriptions
   */
  static async getMesSouscriptions() {
    try {
      const response = await fetch(`${API_URL}/abonnements/mes-souscriptions`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });
      return await response.json();
    } catch (error) {
      console.error('Erreur getMesSouscriptions:', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Récupérer l'historique de mes paiements
   */
  static async getMesPaiements(limit = 10) {
    try {
      const response = await fetch(`${API_URL}/abonnements/mes-paiements?limit=${limit}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });
      return await response.json();
    } catch (error) {
      console.error('Erreur getMesPaiements:', error);
      return { success: false, message: error.message };
    }
  }

  /**
 * Créer une session de paiement Stripe
 * @param {string} abonnementCode - Code de l'abonnement
 * @param {number} nombreFiches - Nombre de fiches à acheter
 * @param {boolean} renouvellementAuto - Activer le renouvellement auto
 * @param {string|null} codePromo - Code promo de réduction (optionnel) ← NOUVEAU
 */
  static async createCheckout(abonnementCode, nombreFiches = 1, renouvellementAuto = false, codePromo = null) {
    try {
      const payload = {
        abonnementCode,
        nombreFiches,
        renouvellementAuto
      };

      // Ajouter le code promo s'il est fourni
      if (codePromo) {
        payload.codePromo = codePromo;
      }

      const response = await fetch(`${API_URL}/abonnements/checkout`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(payload)
      });
      return await response.json();
    } catch (error) {
      console.error('Erreur createCheckout:', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Vérifier le statut d'un paiement
   */
  static async verifyCheckout(sessionId) {
    try {
      const response = await fetch(`${API_URL}/abonnements/checkout/verify?sessionId=${sessionId}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });
      return await response.json();
    } catch (error) {
      console.error('Erreur verifyCheckout:', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Demander l'annulation d'une souscription
   */
  static async annulerSouscription(raison = '') {
    try {
      const response = await fetch(`${API_URL}/abonnements/annuler`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ raison })
      });
      return await response.json();
    } catch (error) {
      console.error('Erreur annulerSouscription:', error);
      return { success: false, message: error.message };
    }
  }

  // ============================================================
  // RENOUVELLEMENT AUTOMATIQUE - NOUVELLES URLS
  // ============================================================

  /**
   * Récupérer l'état du renouvellement automatique d'une souscription
   * @param {number} souscriptionId - ID de la souscription
   */
  static async getAutoRenewStatus(souscriptionId) {
    try {
      const response = await fetch(`${API_URL}/abonnements/souscription/${souscriptionId}/auto-renew`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });
      return await response.json();
    } catch (error) {
      console.error('Erreur getAutoRenewStatus:', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Toggle le renouvellement automatique (activer/désactiver)
   * @param {number} souscriptionId - ID de la souscription
   */
  static async toggleAutoRenew(souscriptionId) {
    try {
      const response = await fetch(`${API_URL}/abonnements/souscription/${souscriptionId}/auto-renew`, {
        method: 'PUT',
        headers: this.getAuthHeaders()
      });
      return await response.json();
    } catch (error) {
      console.error('Erreur toggleAutoRenew:', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Récupérer la méthode de paiement enregistrée
   */
  static async getPaymentMethod() {
    try {
      const response = await fetch(`${API_URL}/abonnements/payment-method`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });
      return await response.json();
    } catch (error) {
      console.error('Erreur getPaymentMethod:', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Créer une session pour mettre à jour la carte bancaire
   */
  static async createUpdatePaymentSession() {
    try {
      const response = await fetch(`${API_URL}/abonnements/payment-method/update-session`, {
        method: 'POST',
        headers: this.getAuthHeaders()
      });
      return await response.json();
    } catch (error) {
      console.error('Erreur createUpdatePaymentSession:', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Vérifier et activer les souscriptions pending
   * Utile quand la redirection Stripe a échoué (cas mobile)
   */
  static async checkPendingSubscriptions() {
    try {
      const response = await fetch(`${API_URL}/abonnements/check-pending`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });
      return await response.json();
    } catch (error) {
      console.error('Erreur checkPendingSubscriptions:', error);
      return { success: false, message: error.message };
    }
  }
}

export default AbonnementService;