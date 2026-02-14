// components/CartSummary.jsx
import '../styles/CartSummary.css';

export default function CartSummary({
  subtotalBeforeDiscounts,
  bundleDiscount,
  subtotalAfterBundle,
  tax,
  voucherDiscount,
  finalTotal,
  appliedVoucher,
}) {
  return (
    <div className="cart-summary">
      <h3 className="summary-title">Price Breakdown</h3>

      <div className="summary-lines">
        {/* Subtotal */}
        <div className="summary-line">
          <span>Subtotal</span>
          <span>${subtotalBeforeDiscounts.toFixed(2)}</span>
        </div>

        {/* Bundle discount — only shown when active */}
        {bundleDiscount > 0 && (
          <div className="summary-line summary-line--discount">
            <span>
              🎁 Bundle Discount
              <small> (Wired Mouse free)</small>
            </span>
            <span>−${bundleDiscount.toFixed(2)}</span>
          </div>
        )}

        {/* Subtotal after bundle */}
        {bundleDiscount > 0 && (
          <div className="summary-line summary-line--after-discount">
            <span>After Bundle</span>
            <span>${subtotalAfterBundle.toFixed(2)}</span>
          </div>
        )}

        {/* Luxury tax */}
        {tax > 0 && (
          <div className="summary-line summary-line--tax">
            <span>
              💎 Luxury Tax
              <small> (5% on orders over $1,000)</small>
            </span>
            <span>+${tax.toFixed(2)}</span>
          </div>
        )}

        {/* Voucher discount */}
        {voucherDiscount > 0 && (
          <div className="summary-line summary-line--discount">
            <span>
              🏷 Voucher <code>{appliedVoucher}</code>
              <small> (20% off)</small>
            </span>
            <span>−${voucherDiscount.toFixed(2)}</span>
          </div>
        )}
      </div>

      {/* Final total */}
      <div className="summary-total">
        <span>Total</span>
        <span className="total-amount">${finalTotal.toFixed(2)}</span>
      </div>
    </div>
  );
}