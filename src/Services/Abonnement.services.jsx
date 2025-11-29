/**
 * Service pour la gestion des abonnements côté frontend
 */

const API_URL = import.meta.env.VITE_API_URL;

class AbonnementService {
  /**
   * Récupérer le token d'authentification
   */
  static getAuthHeader() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  /**
   * Récupérer tous les abonnements disponibles
   */
  static async getAbonnements() {
    try {
      const response = await fetch(`${API_URL}/abonnements`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      return await response.json();
    } catch (error) {
      console.error('Erreur getAbonnements:', error);
      return { success: false, message: 'Erreur de connexion' };
    }
  }

  /**
   * Récupérer un abonnement par son code
   */
  static async getAbonnementByCode(code) {
    try {
      const response = await fetch(`${API_URL}/abonnements/detail/${code}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      return await response.json();
    } catch (error) {
      console.error('Erreur getAbonnementByCode:', error);
      return { success: false, message: 'Erreur de connexion' };
    }
  }

  /**
   * Récupérer ma souscription active
   */
  static async getMaSouscription() {
    try {
      const response = await fetch(`${API_URL}/abonnements/ma-souscription`, {
        method: 'GET',
        headers: this.getAuthHeader()
      });
      return await response.json();
    } catch (error) {
      console.error('Erreur getMaSouscription:', error);
      return { success: false, message: 'Erreur de connexion' };
    }
  }

  /**
   * Récupérer l'historique de mes souscriptions
   */
  static async getMesSouscriptions() {
    try {
      const response = await fetch(`${API_URL}/abonnements/mes-souscriptions`, {
        method: 'GET',
        headers: this.getAuthHeader()
      });
      return await response.json();
    } catch (error) {
      console.error('Erreur getMesSouscriptions:', error);
      return { success: false, message: 'Erreur de connexion' };
    }
  }

  /**
   * Récupérer l'historique de mes paiements
   */
  static async getMesPaiements(limit = 10) {
    try {
      const response = await fetch(`${API_URL}/abonnements/mes-paiements?limit=${limit}`, {
        method: 'GET',
        headers: this.getAuthHeader()
      });
      return await response.json();
    } catch (error) {
      console.error('Erreur getMesPaiements:', error);
      return { success: false, message: 'Erreur de connexion' };
    }
  }

  /**
   * Créer une session de paiement Stripe
   */
  static async createCheckout(abonnementCode) {
    try {
      const response = await fetch(`${API_URL}/abonnements/checkout`, {
        method: 'POST',
        headers: this.getAuthHeader(),
        body: JSON.stringify({ abonnementCode })
      });
      return await response.json();
    } catch (error) {
      console.error('Erreur createCheckout:', error);
      return { success: false, message: 'Erreur de connexion' };
    }
  }

  /**
   * Vérifier le statut d'un paiement
   */
  static async verifyCheckout(sessionId) {
    try {
      const response = await fetch(`${API_URL}/abonnements/checkout/verify?sessionId=${sessionId}`, {
        method: 'GET',
        headers: this.getAuthHeader()
      });
      return await response.json();
    } catch (error) {
      console.error('Erreur verifyCheckout:', error);
      return { success: false, message: 'Erreur de connexion' };
    }
  }

  /**
   * Demander l'annulation d'une souscription
   */
  static async annulerSouscription(raison = null) {
    try {
      const response = await fetch(`${API_URL}/abonnements/annuler`, {
        method: 'POST',
        headers: this.getAuthHeader(),
        body: JSON.stringify({ raison })
      });
      return await response.json();
    } catch (error) {
      console.error('Erreur annulerSouscription:', error);
      return { success: false, message: 'Erreur de connexion' };
    }
  }
}

export default AbonnementService;
