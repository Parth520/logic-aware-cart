// hooks/useCartLogic.js
// ============================================================
// CART LOGIC HOOK — All pricing rules live here.
// Rules are applied in strict order as specified.
// ============================================================

import { useState, useEffect, useMemo, useCallback } from 'react';
import {
    PRODUCT_IDS,
    CATEGORIES,
    ELECTRONICS_MAX_QTY,
    LUXURY_TAX_THRESHOLD,
    LUXURY_TAX_RATE,
    VOUCHER_CODE,
    VOUCHER_DISCOUNT_RATE,
    VOUCHER_MIN_ITEMS,
    MESSAGES,
    STORAGE_KEYS,
} from '../utils/constants';

/**
 * Loads persisted cart state from localStorage.
 * Returns defaults if nothing is stored.
 */
function loadPersistedState() {
    try {
        const cart = localStorage.getItem(STORAGE_KEYS.CART);
        const voucher = localStorage.getItem(STORAGE_KEYS.VOUCHER);
        return {
            cartItems: cart ? JSON.parse(cart) : [],
            voucherCode: voucher ? JSON.parse(voucher) : '',
        };
    } catch {
        // Defensive: if localStorage is corrupt, start fresh
        return { cartItems: [], voucherCode: '' };
    }
}

export default function useCartLogic() {
    // ── State ────────────────────────────────────────────────
    const { cartItems: persistedCart, voucherCode: persistedVoucher } = loadPersistedState();
    const [cartItems, setCartItems] = useState(persistedCart);
    const [voucherInput, setVoucherInput] = useState(persistedVoucher);
    const [appliedVoucher, setAppliedVoucher] = useState(persistedVoucher);
    const [notifications, setNotifications] = useState([]);

    // ── Persistence ──────────────────────────────────────────
    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cartItems));
    }, [cartItems]);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.VOUCHER, JSON.stringify(appliedVoucher));
    }, [appliedVoucher]);

    // ── Notification helpers ─────────────────────────────────
    const pushNotification = useCallback((message, type = 'info') => {
        const id = Date.now() + Math.random();
        setNotifications(prev => [...prev, { id, message, type }]);
        // Auto-dismiss after 4 seconds
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 4000);
    }, []);

    const dismissNotification = useCallback((id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    // ── RULE 2 CHECK: Electronics limit ─────────────────────
    /**
     * Returns current count of Electronics items in the cart.
     */
    const getElectronicsCount = useCallback((items) => {
        return items
            .filter(item => item.category === CATEGORIES.ELECTRONICS)
            .reduce((sum, item) => sum + item.quantity, 0);
    }, []);

    // ── Cart actions ─────────────────────────────────────────

    /**
     * Adds a product to the cart.
     * Enforces Rule 2 (Electronics limit) before adding.
     */
    const addItem = useCallback((product) => {
        setCartItems(prev => {
            const existing = prev.find(i => i.id === product.id);

            // RULE 2: Block Electronics if limit exceeded
            if (product.category === CATEGORIES.ELECTRONICS) {
                const currentCount = getElectronicsCount(prev);
                const addingQty = existing ? 0 : 1; // Only counts new additions
                // If already in cart, we're incrementing quantity — also check
                if (existing) {
                    if (currentCount >= ELECTRONICS_MAX_QTY) {
                        pushNotification(MESSAGES.ELECTRONICS_LIMIT, 'error');
                        return prev; // Block addition
                    }
                } else {
                    if (currentCount >= ELECTRONICS_MAX_QTY) {
                        pushNotification(MESSAGES.ELECTRONICS_LIMIT, 'error');
                        return prev; // Block addition
                    }
                }
            }

            if (existing) {
                // If Electronics, check limit before incrementing
                if (product.category === CATEGORIES.ELECTRONICS) {
                    const currentCount = getElectronicsCount(prev);
                    if (currentCount >= ELECTRONICS_MAX_QTY) {
                        pushNotification(MESSAGES.ELECTRONICS_LIMIT, 'error');
                        return prev;
                    }
                }
                return prev.map(i =>
                    i.id === product.id ? {...i, quantity: i.quantity + 1 } : i
                );
            }

            return [...prev, {...product, quantity: 1 }];
        });
    }, [getElectronicsCount, pushNotification]);

    /**
     * Removes an item completely from the cart.
     * Tracks bundle changes for notifications.
     */
    const removeItem = useCallback((productId) => {
        setCartItems(prev => {
            const hadLaptop = prev.some(i => i.id === PRODUCT_IDS.LAPTOP);
            const hadMouse = prev.some(i => i.id === PRODUCT_IDS.WIRED_MOUSE);
            const newCart = prev.filter(i => i.id !== productId);
            const stillHasLaptop = newCart.some(i => i.id === PRODUCT_IDS.LAPTOP);

            // Notify if bundle is broken by removing laptop
            if (productId === PRODUCT_IDS.LAPTOP && hadLaptop && hadMouse && !stillHasLaptop) {
                pushNotification(MESSAGES.BUNDLE_REMOVED, 'warning');
            }
            return newCart;
        });
    }, [pushNotification]);

    /**
     * Updates the quantity of a specific cart item.
     * Enforces Rule 2 on increment.
     */
    const updateQuantity = useCallback((productId, newQty) => {
        if (newQty < 1) {
            removeItem(productId);
            return;
        }

        setCartItems(prev => {
            const item = prev.find(i => i.id === productId);
            if (!item) return prev;

            // RULE 2: Check electronics limit on qty increase
            if (item.category === CATEGORIES.ELECTRONICS && newQty > item.quantity) {
                const otherElectronicsCount = prev
                    .filter(i => i.id !== productId && i.category === CATEGORIES.ELECTRONICS)
                    .reduce((sum, i) => sum + i.quantity, 0);
                if (otherElectronicsCount + newQty > ELECTRONICS_MAX_QTY) {
                    pushNotification(MESSAGES.ELECTRONICS_LIMIT, 'error');
                    return prev;
                }
            }
            return prev.map(i =>
                i.id === productId ? {...i, quantity: newQty } : i
            );
        });
    }, [removeItem, pushNotification]);

    /**
     * Clears all items from the cart.
     */
    const clearCart = useCallback(() => {
        setCartItems([]);
        setAppliedVoucher('');
        setVoucherInput('');
    }, []);

    // ── Voucher logic ─────────────────────────────────────────

    /**
     * Attempts to apply a voucher code.
     * Rule 4: DEI2024 requires 3+ items in cart.
     */
    const applyVoucher = useCallback(() => {
        const code = voucherInput.trim().toUpperCase();
        const totalItems = cartItems.reduce((sum, i) => sum + i.quantity, 0);

        if (code !== VOUCHER_CODE) {
            pushNotification(MESSAGES.VOUCHER_INVALID, 'error');
            return;
        }
        if (totalItems < VOUCHER_MIN_ITEMS) {
            pushNotification(MESSAGES.VOUCHER_MIN_ITEMS, 'warning');
            return;
        }
        setAppliedVoucher(code);
        pushNotification(MESSAGES.VOUCHER_APPLIED, 'success');
    }, [voucherInput, cartItems, pushNotification]);

    const removeVoucher = useCallback(() => {
        setAppliedVoucher('');
        setVoucherInput('');
    }, []);

    // ── PRICING ENGINE (useMemo for performance) ──────────────
    const pricingResult = useMemo(() => {
        if (cartItems.length === 0) {
            return {
                processedCart: [],
                subtotalBeforeDiscounts: 0,
                bundleDiscount: 0,
                subtotalAfterBundle: 0,
                tax: 0,
                voucherDiscount: 0,
                finalTotal: 0,
                isBundleActive: false,
                validationMessages: [],
            };
        }

        const validationMessages = [];
        let processedCart = cartItems.map(item => ({...item, effectivePrice: item.price }));

        // ── RULE 1: Bundle Discount ───────────────────────────
        // If cart contains both Laptop Pro AND Wired Mouse,
        // the Wired Mouse becomes free.
        const hasLaptop = processedCart.some(i => i.id === PRODUCT_IDS.LAPTOP);
        const hasMouse = processedCart.some(i => i.id === PRODUCT_IDS.WIRED_MOUSE);
        const isBundleActive = hasLaptop && hasMouse;

        let bundleDiscount = 0;

        if (isBundleActive) {
            processedCart = processedCart.map(item => {
                if (item.id === PRODUCT_IDS.WIRED_MOUSE) {
                    // Bundle makes each wired mouse free (all qty)
                    bundleDiscount += item.price * item.quantity;
                    return {...item, effectivePrice: 0, bundleFree: true };
                }
                return item;
            });
            validationMessages.push({ type: 'bundle', text: MESSAGES.BUNDLE_APPLIED });
        }

        // ── Subtotal after Rule 1 ─────────────────────────────
        const subtotalBeforeDiscounts = processedCart.reduce(
            (sum, item) => sum + item.price * item.quantity, 0
        );

        const subtotalAfterBundle = processedCart.reduce(
            (sum, item) => sum + item.effectivePrice * item.quantity, 0
        );

        // ── RULE 3: Luxury Tax ────────────────────────────────
        // If subtotal (after bundle discount) > 1000, apply 5% tax.
        // Applied BEFORE voucher discount.
        let tax = 0;
        if (subtotalAfterBundle > LUXURY_TAX_THRESHOLD) {
            tax = subtotalAfterBundle * LUXURY_TAX_RATE;
        }

        // ── RULE 4: Voucher Discount ──────────────────────────
        // 20% off entire cart after bundle and before/after tax.
        // We apply voucher to (subtotal + tax) for max user transparency.
        let voucherDiscount = 0;
        const totalItems = processedCart.reduce((sum, i) => sum + i.quantity, 0);

        if (appliedVoucher === VOUCHER_CODE) {
            if (totalItems >= VOUCHER_MIN_ITEMS) {
                // Voucher applied to subtotalAfterBundle (not including tax)
                voucherDiscount = (subtotalAfterBundle + tax) * VOUCHER_DISCOUNT_RATE;
            } else {
                // Items dropped below minimum — invalidate voucher
                validationMessages.push({ type: 'warning', text: MESSAGES.VOUCHER_MIN_ITEMS });
            }
        }

        const finalTotal = Math.max(0, subtotalAfterBundle + tax - voucherDiscount);

        return {
            processedCart,
            subtotalBeforeDiscounts,
            bundleDiscount,
            subtotalAfterBundle,
            tax,
            voucherDiscount,
            finalTotal,
            isBundleActive,
            validationMessages,
        };
    }, [cartItems, appliedVoucher]);

    return {
        // Cart state
        cartItems,
        // Processed pricing output
        ...pricingResult,
        // Voucher state
        voucherInput,
        setVoucherInput,
        appliedVoucher,
        // Cart actions
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        // Voucher actions
        applyVoucher,
        removeVoucher,
        // Notifications
        notifications,
        dismissNotification,
    };
}