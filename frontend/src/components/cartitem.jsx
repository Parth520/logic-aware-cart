// components/CartItem.jsx
import '../styles/CartItem.css';

export default function CartItem({ item, onRemove, onUpdateQty }) {
  const linePrice = item.effectivePrice * item.quantity;
  const originalLinePrice = item.price * item.quantity;
  const isFree = item.bundleFree === true;

  return (
    <div className={`cart-item ${isFree ? 'cart-item--free' : ''}`}>
      <div className="cart-item-emoji">{item.image}</div>

      <div className="cart-item-details">
        <div className="cart-item-header">
          <span className="cart-item-name">{item.name}</span>
          {isFree && <span className="free-tag">FREE</span>}
        </div>
        <div className="cart-item-meta">
          <span className="cart-item-category">{item.category}</span>
          <span className="cart-item-unit-price">
            ${item.effectivePrice.toFixed(2)} each
          </span>
        </div>

        {/* Quantity controls */}
        <div className="cart-item-controls">
          <div className="qty-controls">
            <button
              className="qty-btn"
              onClick={() => onUpdateQty(item.id, item.quantity - 1)}
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="qty-value">{item.quantity}</span>
            <button
              className="qty-btn"
              onClick={() => onUpdateQty(item.id, item.quantity + 1)}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          <div className="cart-item-price">
            {isFree ? (
              <>
                <span className="original-price">${originalLinePrice.toFixed(2)}</span>
                <span className="free-price">$0.00</span>
              </>
            ) : (
              <span className="current-price">${linePrice.toFixed(2)}</span>
            )}
          </div>

          <button
            className="remove-btn"
            onClick={() => onRemove(item.id)}
            aria-label={`Remove ${item.name}`}
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}