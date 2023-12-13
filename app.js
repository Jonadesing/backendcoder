const express = require('express');
const ProductManager = require('./src/models/ProductManager'); // Ruta a tu archivo ProductManager.js
const CartManager = require('./src/models/CartManager'); // Ruta a tu archivo CartManager.js

const app = express();
const productManager = new ProductManager('./data/productos.json'); // Ruta al archivo de productos
const cartManager = new CartManager('./data/carritos.json'); // Ruta al archivo de carritos

app.use(express.json());

// Rutas para el manejo de productos
app.get('/api/products/', (req, res) => {
  const { limit } = req.query;
  let products = productManager.getProducts();

  if (limit) {
    const limitValue = parseInt(limit);
    products = products.slice(0, limitValue);
  }

  res.json(products);
});

app.get('/api/products/:pid', (req, res) => {
  const { pid } = req.params;
  const product = productManager.getProductById(pid);
  res.json(product);
});

app.post('/api/products/', (req, res) => {
  try {
    const productId = productManager.addProduct(req.body);
    res.status(201).json({ id: productId, message: 'Product added successfully' });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.put('/api/products/:pid', (req, res) => {
  const { pid } = req.params;
  const updatedFields = req.body;

  try {
    const updated = productManager.updateProduct(pid, updatedFields);
    if (updated) {
      res.status(200).json({ message: 'Product updated successfully' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.delete('/api/products/:pid', (req, res) => {
  const { pid } = req.params;
  const deleted = productManager.deleteProduct(pid);

  if (deleted) {
    res.status(200).json({ message: 'Product deleted successfully' });
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

// Rutas para el manejo de carritos
app.post('/api/carts/', (req, res) => {
  try {
    const cartId = cartManager.createCart();
    res.status(201).json({ id: cartId, message: 'Cart created successfully' });
  } catch (error) {
    res.status(500).send('Error creating cart');
  }
});

app.get('/api/carts/:cid', (req, res) => {
  const { cid } = req.params;
  const cartProducts = cartManager.getCartProducts(cid);
  res.json(cartProducts);
});

app.post('/api/carts/:cid/product/:pid', (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  try {
    const added = cartManager.addProductToCart(cid, pid, quantity);
    if (added) {
      res.status(200).json({ message: 'Product added to cart successfully' });
    } else {
      res.status(404).json({ message: 'Cart or product not found' });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Servidor Express corriendo en el puerto ${PORT}`);
});
