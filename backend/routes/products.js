const express = require('express');
const router = express.Router();
const products = require('../data/products.json');

// GET /products — returns the full product catalog
router.get('/', (req, res) => {
    res.json(products);
});

// GET /products/:id — returns a single product
router.get('/:id', (req, res) => {
    const product = products.find(p => p.id === req.params.id);
    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
});

module.exports = router;