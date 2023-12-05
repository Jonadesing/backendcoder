const express = require('express');
const ProductManager = require('../../Jona7/productmanager/src/productManager'); // Ruta a tu archivo productManager.js

const app = express();
const productManager = new ProductManager('products.json');

// Ruta para obtener productos con límite opcional
app.get('/products', (req, res) => {
  const { limit } = req.query;
  let products = productManager.getProducts();

  if (limit) {
    const limitValue = parseInt(limit);
    products = products.slice(0, limitValue);
  }

  const formattedProducts = JSON.stringify({ products }, null, 2); // Indentación de 2 espacios

  res.header('Content-Type', 'application/json');
  res.send(formattedProducts);
});


// Iniciar el servidor en un puerto específico
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor Express corriendo en el puerto ${PORT}`);
});
