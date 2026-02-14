// components/ProductList.jsx
import ProductCard from './ProductCard';
import { CATEGORIES } from '../utils/constants';
import '../styles/ProductList.css';

export default function ProductList({ products, cartItems, onAddItem }) {
  const categories = Object.values(CATEGORIES);

  return (
    <div className="product-list">
      {categories.map(category => {
        const items = products.filter(p => p.category === category);
        if (items.length === 0) return null;
        return (
          <div key={category} className="category-group">
            <h2 className="category-title">
              <span className="category-pill">{category}</span>
            </h2>
            <div className="product-grid">
              {items.map(product => {
                const cartItem = cartItems.find(i => i.id === product.id);
                return (
                  <ProductCard
                    key={product.id}
                    product={product}
                    cartQty={cartItem ? cartItem.quantity : 0}
                    onAddItem={onAddItem}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}