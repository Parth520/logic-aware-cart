// App.jsx — Root component
import { useState, useEffect } from 'react';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import NotificationToast from './components/NotificationToast';
import useCartLogic from './hooks/useCartLogic';
import { fetchProducts } from './services/api';
import './styles/global.css';

export default function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);

  const cartLogic = useCartLogic();

  useEffect(() => {
    fetchProducts()
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const cartItemCount = cartLogic.cartItems.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="app">
      {/* ── Header ── */}
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-mark">◈</span>
            <span className="logo-text">CARTIS</span>
            <span className="logo-sub">adaptive engine</span>
          </div>
          <button
            className="cart-toggle"
            onClick={() => setCartOpen(o => !o)}
            aria-label="Toggle cart"
          >
            <span className="cart-icon">◫</span>
            <span className="cart-label">Cart</span>
            {cartItemCount > 0 && (
              <span className="cart-badge">{cartItemCount}</span>
            )}
          </button>
        </div>
      </header>

      {/* ── Main layout ── */}
      <main className={`main-layout ${cartOpen ? 'cart-open' : ''}`}>
        <section className="products-section">
          <div className="section-header">
            <h1 className="section-title">Catalog</h1>
            <p className="section-subtitle">
              Smart pricing · bundle deals · real-time rules
            </p>
          </div>
          {loading && (
            <div className="loading-state">
              <div className="spinner" />
              <p>Loading catalog…</p>
            </div>
          )}
          {error && (
            <div className="error-state">
              <p>⚠ {error}</p>
              <p className="error-hint">Make sure the backend is running on port 4000.</p>
            </div>
          )}
          {!loading && !error && (
            <ProductList
              products={products}
              cartItems={cartLogic.cartItems}
              onAddItem={cartLogic.addItem}
            />
          )}
        </section>

        {/* ── Cart panel ── */}
        <aside className={`cart-panel ${cartOpen ? 'is-open' : ''}`}>
          <Cart
            {...cartLogic}
            onClose={() => setCartOpen(false)}
          />
        </aside>
      </main>

      {/* ── Overlay for mobile cart ── */}
      {cartOpen && (
        <div className="overlay" onClick={() => setCartOpen(false)} />
      )}

      {/* ── Notification toasts ── */}
      <NotificationToast
        notifications={cartLogic.notifications}
        onDismiss={cartLogic.dismissNotification}
      />
    </div>
  );
}