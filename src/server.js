const express = require('express');
const productRouter = require('./data/productRouter');
const cartRouter = require('./data/cartRouter');

const app = express();
app.use(express.json());

// Implementa los routers para /api/products y /api/carts
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
