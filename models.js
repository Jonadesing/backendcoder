const mongoose = require('mongoose');

// Conectar a tu base de datos en Atlas (asegúrate de tener la URL de conexión correcta)
mongoose.connect('mongodb+srv://JonaDesigne:Timoteo2020@ecommercecoder.madz2qs.mongodb.net/', {
});

// Esquema para productos
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  // Otros campos que desees para tus productos
});

// Esquema para carritos
const cartSchema = new mongoose.Schema({
  // Puedes definir los campos necesarios para tus carritos
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product', // Referencia al modelo de productos
    quantity: Number,
  }],
  // Otros campos que puedas necesitar para los carritos
});

// Esquema para mensajes (si los necesitas)
const messageSchema = new mongoose.Schema({
  // Campos para mensajes, si los utilizas en tu aplicación
  // Por ejemplo: sender, receiver, content, timestamps, etc.
});

// Crear modelos a partir de los esquemas definidos
const Product = mongoose.model('Product', productSchema);
const Cart = mongoose.model('Cart', cartSchema);
const Message = mongoose.model('Message', messageSchema);

module.exports = { Product, Cart, Message };
