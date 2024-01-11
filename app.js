const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const exphbs = require('express-handlebars');
const path = require('path');
const mongoose = require('mongoose');  // Agrega Mongoose
const ProductManager = require('./src/models/ProductManager');
const CartManager = require('./src/models/CartManager');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.json());
// Configuración de Handlebars como motor de plantillas
app.engine('.handlebars', exphbs({ extname: '.handlebars' }));

app.set('view engine', '.handlebars');
app.set('views', path.join(__dirname, 'src/views'));

// Archivos estáticos (CSS, JS, imágenes)
app.use(express.static(path.join(__dirname, 'public')));

// Conexión a MongoDB usando Mongoose
mongoose.connect('mongodb+srv://JonaDesigne:Timoteo2020@ecommercecoder.madz2qs.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Inicialización de los managers
const productManager = new ProductManager('./data/productos.json');
const cartManager = new CartManager('./data/carritos.json');

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

// Resto de las rutas para productos y carritos
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

// Configurar Socket.IO para manejar eventos en tiempo real
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('newProduct', (productData) => {
    try {
      const productId = productManager.addProduct(productData);
      io.emit('updateProducts', productManager.getProducts());
    } catch (error) {
      console.error('Error adding product:', error.message);
    }
  });

  socket.on('deleteProduct', (productId) => {
    try {
      const deleted = productManager.deleteProduct(productId);
      if (deleted) {
        io.emit('updateProducts', productManager.getProducts());
      }
    } catch (error) {
      console.error('Error deleting product:', error.message);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 8081;
server.listen(PORT, () => {
  console.log(`Servidor Express corriendo en el puerto ${PORT}`);
});
