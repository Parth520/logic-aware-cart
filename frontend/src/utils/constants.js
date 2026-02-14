// ============================================================
// BUSINESS RULE CONSTANTS — single source of truth
// ============================================================

// Product IDs referenced in bundle rules
export const PRODUCT_IDS = {
    LAPTOP: 'laptop-pro',
    WIRED_MOUSE: 'wired-mouse',
};

// Category names
export const CATEGORIES = {
    ELECTRONICS: 'Electronics',
    ACCESSORIES: 'Accessories',
    PERIPHERALS: 'Peripherals',
};

// Rule 2: Electronics quantity limit
export const ELECTRONICS_MAX_QTY = 2;

// Rule 3: Luxury tax configuration
export const LUXURY_TAX_THRESHOLD = 1000;
export const LUXURY_TAX_RATE = 0.05; // 5%

// Rule 4: Voucher configuration
export const VOUCHER_CODE = 'DEI2024';
export const VOUCHER_DISCOUNT_RATE = 0.2; // 20%
export const VOUCHER_MIN_ITEMS = 3;

// Notification messages
export const MESSAGES = {
    ELECTRONICS_LIMIT: `Safety Limit Reached: Only ${ELECTRONICS_MAX_QTY} Electronic items allowed per order.`,
    VOUCHER_MIN_ITEMS: `Add more items to unlock this discount!`,
    VOUCHER_INVALID: 'Invalid promo code.',
    VOUCHER_APPLIED: `${VOUCHER_CODE} applied — 20% off!`,
    BUNDLE_APPLIED: 'Bundle deal! Wired Mouse is now FREE with your Laptop Pro.',
    BUNDLE_REMOVED: 'Bundle deal removed.',
};

// localStorage keys
export const STORAGE_KEYS = {
    CART: 'cartis_cart',
    VOUCHER: 'cartis_voucher',
};