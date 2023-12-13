// productRouter.js

const express = require('express');
const router = express.Router();
const ProductManager = require('../models/ProductManager');

const productManager = new ProductManager('../data/productos.json');

router.get('/', (req, res) => {
  // Lógica para obtener todos los productos
});

router.get('/:pid', (req, res) => {
  // Lógica para obtener un producto por ID
});

router.post('/', (req, res) => {
  // Lógica para agregar un nuevo producto
});

router.put('/:pid', (req, res) => {
  // Lógica para actualizar un producto por ID
});

router.delete('/:pid', (req, res) => {
  // Lógica para eliminar un producto por ID
});

module.exports = router;
