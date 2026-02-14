// components/Cart.jsx
import CartItem from './CartItem';
import CartSummary from './CartSummary';
import PromoInput from './PromoInput';
import '../styles/Cart.css';

export default function Cart({
  cartItems,
  processedCart,
  subtotalBeforeDiscounts,
  bundleDiscount,
  subtotalAfterBundle,
  tax,
  voucherDiscount,
  finalTotal,
  isBundleActive,
  validationMessages,
  voucherInput,
  setVoucherInput,
  appliedVoucher,
  removeItem,
  updateQuantity,
  clearCart,
  applyVoucher,
  removeVoucher,
  onClose,
}) {
  const isEmpty = cartItems.length === 0;

  return (
    <div className="cart">
      {/* Header */}
      <div className="cart-header">
        <h2 className="cart-title">
          <span className="cart-icon-sm">◫</span> Your Cart
        </h2>
        <div className="cart-header-actions">
          {!isEmpty && (
            <button className="clear-btn" onClick={clearCart}>
              Clear all
            </button>
          )}
          <button className="close-btn" onClick={onClose} aria-label="Close cart">
            ✕
          </button>
        </div>
      </div>

      {/* Validation messages (bundle, warnings) */}
      {validationMessages.length > 0 && (
        <div className="cart-messages">
          {validationMessages.map((msg, i) => (
            <div key={i} className={`cart-msg cart-msg--${msg.type}`}>
              {msg.type === 'bundle' ? '🎁' : '⚠️'} {msg.text}
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {isEmpty ? (
        <div className="cart-empty">
          <div className="cart-empty-icon">◫</div>
          <p>Your cart is empty</p>
          <p className="cart-empty-hint">Add products to see the magic happen</p>
        </div>
      ) : (
        <>
          {/* Cart items */}
          <div className="cart-items">
            {processedCart.map(item => (
              <CartItem
                key={item.id}
                item={item}
                onRemove={removeItem}
                onUpdateQty={updateQuantity}
              />
            ))}
          </div>

          {/* Promo code input */}
          <PromoInput
            voucherInput={voucherInput}
            setVoucherInput={setVoucherInput}
            appliedVoucher={appliedVoucher}
            onApply={applyVoucher}
            onRemove={removeVoucher}
          />

          {/* Pricing summary */}
          <CartSummary
            subtotalBeforeDiscounts={subtotalBeforeDiscounts}
            bundleDiscount={bundleDiscount}
            subtotalAfterBundle={subtotalAfterBundle}
            tax={tax}
            voucherDiscount={voucherDiscount}
            finalTotal={finalTotal}
            appliedVoucher={appliedVoucher}
          />

          {/* Checkout CTA */}
          <button className="checkout-btn">
            Checkout — ${finalTotal.toFixed(2)}
          </button>
        </>
      )}
    </div>
  );
}