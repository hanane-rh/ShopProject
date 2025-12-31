import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductBySlug } from '../services/productService';
import { CartContext } from '../context/CartContext';
import { useAuth } from '../context/AuthContext'; // hook pour vérifier si connecté
import './BookDetails.css';

export default function BookDetails() {
  const { slug } = useParams();
  const [book, setBook] = useState(null);
  const [error, setError] = useState(null);

  const { addToCart } = useContext(CartContext);
  const { isAuthenticated } = useAuth(); // savoir si l'utilisateur est connecté
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const data = await getProductBySlug(slug);
        setBook(data);
      } catch (err) {
        console.error(err);
        setError('Impossible de récupérer ce livre. Veuillez réessayer plus tard.');
      }
    };
    fetchBook();
  }, [slug]);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login'); // redirige vers login si pas connecté
      return;
    }

    addToCart(book); // ajoute au panier si connecté
    alert('Livre ajouté au panier !');
  };

  if (error) return <p className="error">{error}</p>;
  if (!book) return <p>Chargement du livre...</p>;

  return (
    <div className="book-details">
      <h2>{book.name}</h2>
      <img src={book.image} alt={book.name} />
      <div className="info">
        <p><strong>Catégorie :</strong> {book.category_name}</p>
        <p><strong>Description :</strong> {book.description}</p>
        <p className="price"><strong>Prix :</strong> ${book.price}</p>
        <p className="stock"><strong>Stock :</strong> {book.stock}</p>
      </div>
      <button className="add-to-cart" onClick={handleAddToCart}>
        Ajouter au panier
      </button>
    </div>
  );
}
