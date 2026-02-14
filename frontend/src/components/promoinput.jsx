// components/PromoInput.jsx
import { VOUCHER_CODE } from '../utils/constants';
import '../styles/PromoInput.css';

export default function PromoInput({
  voucherInput,
  setVoucherInput,
  appliedVoucher,
  onApply,
  onRemove,
}) {
  const isApplied = Boolean(appliedVoucher);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') onApply();
  };

  return (
    <div className="promo-input">
      <div className="promo-label">Promo Code</div>
      {isApplied ? (
        <div className="promo-applied">
          <span className="promo-code-tag">
            🏷 {appliedVoucher} — 20% OFF
          </span>
          <button className="promo-remove" onClick={onRemove}>
            Remove
          </button>
        </div>
      ) : (
        <div className="promo-field">
          <input
            type="text"
            className="promo-text-input"
            placeholder={`Try ${VOUCHER_CODE}`}
            value={voucherInput}
            onChange={e => setVoucherInput(e.target.value)}
            onKeyDown={handleKeyDown}
            maxLength={20}
            aria-label="Promo code"
          />
          <button className="promo-apply-btn" onClick={onApply}>
            Apply
          </button>
        </div>
      )}
    </div>
  );
}