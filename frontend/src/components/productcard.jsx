// components/ProductCard.jsx
import { PRODUCT_IDS } from '../utils/constants';
import '../styles/ProductCard.css';

export default function ProductCard({ product, cartQty, onAddItem }) {
  const isBundleItem =
    product.id === PRODUCT_IDS.LAPTOP || product.id === PRODUCT_IDS.WIRED_MOUSE;

  return (
    <div className={`product-card ${cartQty > 0 ? 'in-cart' : ''}`}>
      {isBundleItem && (
        <span className="bundle-badge">Bundle</span>
      )}
      <div className="product-emoji">{product.image}</div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-desc">{product.description}</p>
        <div className="product-footer">
          <span className="product-price">${product.price.toFixed(2)}</span>
          <button
            className={`add-btn ${cartQty > 0 ? 'added' : ''}`}
            onClick={() => onAddItem(product)}
            aria-label={`Add ${product.name} to cart`}
          >
            {cartQty > 0 ? (
              <>
                <span className="add-btn-check">✓</span>
                <span>{cartQty} in cart</span>
              </>
            ) : (
              <>
                <span>+</span>
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}