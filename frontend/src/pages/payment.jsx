import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './payment.css';

export default function Payment() {
  const { cart, clearCart, getTotalPrice } = useContext(CartContext);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    // Informations de carte
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    
    // Adresse de facturation
    address: '',
    city: '',
    postalCode: '',
    country: '',
    
    // Contact
    email: '',
    phone: '',
    
    // Acceptation des conditions
    acceptTerms: false
  });

  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Redirection si non authentifié
  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  // Redirection si panier vide
  if (!cart || cart.length === 0) {
    navigate('/');
    return null;
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation basique
    if (!formData.cardNumber || formData.cardNumber.length < 16) {
      setError('Numéro de carte invalide');
      return;
    }

    if (!formData.cardName) {
      setError('Nom du titulaire requis');
      return;
    }

    if (!formData.expiryDate || !formData.cvv) {
      setError('Date d\'expiration et CVV requis');
      return;
    }

    if (!formData.address || !formData.city || !formData.postalCode) {
      setError('Adresse complète requise');
      return;
    }

    if (!formData.email || !formData.phone) {
      setError('Email et téléphone requis');
      return;
    }

    if (!formData.acceptTerms) {
      setError('Vous devez accepter les conditions');
      return;
    }

    setIsProcessing(true);

    // Simulation du traitement du paiement
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Ici vous ajouteriez votre logique de paiement réelle
      // const response = await processPayment(formData, cart, getTotalPrice());
      
      clearCart();
      alert('Paiement réussi ! Merci pour votre achat.');
      navigate('/');
    } catch (err) {
      setError('Erreur lors du paiement. Veuillez réessayer.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="payment-container">
      <div className="payment-card">
        <div className="payment-card-inner">
          <h2 className="payment-title">Paiement Sécurisé</h2>
          
          <div className="payment-divider"></div>

          {/* Résumé de la commande */}
          <div className="order-summary">
            <h3>Résumé de votre commande</h3>
            {cart.map((item, index) => (
              <p key={index}>
                <span>{item.name} x{item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </p>
            ))}
            <p className="total">
              <span>Total</span>
              <span>${getTotalPrice().toFixed(2)}</span>
            </p>
          </div>

          {error && <div className="payment-error">{error}</div>}

          <form className="payment-form" onSubmit={handleSubmit}>
            {/* Informations de carte */}
            <div className="form-section">
              <h3>Informations de carte</h3>
              
              <div className="input-group">
                <label className="input-label">Numéro de carte</label>
                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  placeholder="1234 5678 9012 3456"
                  maxLength="16"
                  className="payment-input"
                  required
                />
              </div>

              <div className="input-group">
                <label className="input-label">Nom du titulaire</label>
                <input
                  type="text"
                  name="cardName"
                  value={formData.cardName}
                  onChange={handleChange}
                  placeholder="Nom complet"
                  className="payment-input"
                  required
                />
              </div>

              <div className="input-row">
                <div className="input-group">
                  <label className="input-label">Date d'expiration</label>
                  <input
                    type="text"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    placeholder="MM/AA"
                    maxLength="5"
                    className="payment-input"
                    required
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">CVV</label>
                  <input
                    type="text"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleChange}
                    placeholder="123"
                    maxLength="3"
                    className="payment-input"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Adresse de facturation */}
            <div className="form-section">
              <h3>Adresse de facturation</h3>
              
              <div className="input-group">
                <label className="input-label">Adresse</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Rue, numéro, appartement..."
                  className="payment-input"
                  required
                />
              </div>

              <div className="input-row">
                <div className="input-group">
                  <label className="input-label">Ville</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Ville"
                    className="payment-input"
                    required
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Code postal</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    placeholder="12345"
                    className="payment-input"
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Pays</label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="payment-select"
                  required
                >
                  <option value="">Sélectionnez un pays</option>
                  <option value="FR">France</option>
                  <option value="BE">Belgique</option>
                  <option value="CH">Suisse</option>
                  <option value="CA">Canada</option>
                  <option value="US">États-Unis</option>
                  <option value="DZ">Algérie</option>
                  <option value="MA">Maroc</option>
                  <option value="TN">Tunisie</option>
                </select>
              </div>
            </div>

            {/* Coordonnées */}
            <div className="form-section">
              <h3>Coordonnées</h3>
              
              <div className="input-group">
                <label className="input-label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="votre@email.com"
                  className="payment-input"
                  required
                />
              </div>

              <div className="input-group">
                <label className="input-label">Téléphone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+33 6 12 34 56 78"
                  className="payment-input"
                  required
                />
              </div>
            </div>

            {/* Acceptation des conditions */}
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="acceptTerms"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleChange}
                className="payment-checkbox"
                required
              />
              <label htmlFor="acceptTerms" className="checkbox-label">
                J'accepte les conditions générales de vente
              </label>
            </div>

            {/* Bouton de paiement */}
            <button 
              type="submit" 
              className="payment-button"
              disabled={isProcessing}
            >
              {isProcessing ? 'Traitement en cours...' : `Payer $${getTotalPrice().toFixed(2)}`}
            </button>

            {/* Note de sécurité */}
            <div className="security-note">
              Vos informations de paiement sont sécurisées et cryptées
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}