const fs = require('fs');

class CartManager {
  constructor(filePath) {
    this.filePath = filePath;
    this.carts = [];
    this.readDataFromFile();
  }

  readDataFromFile() {
    try {
      const data = fs.readFileSync(this.filePath, 'utf8');
      this.carts = JSON.parse(data);
    } catch (error) {
      console.error('Error al leer el archivo:', error);
    }
  }

  getCarts() {
    return this.carts;
  }

  addCart(newCart) {
    const { products } = newCart;
    const cartId = this.carts.length > 0 ? Math.max(...this.carts.map((c) => c.id)) + 1 : 1;
    const newCartData = {
      id: cartId,
      products: products || [],
    };

    this.carts.push(newCartData);
    this.saveDataToFile();
    return cartId;
  }

  getCartById(cartId) {
    const foundCart = this.carts.find((cart) => cart.id === parseInt(cartId));
    if (foundCart) {
      return foundCart;
    } else {
      throw new Error('Cart not found.');
    }
  }

  addProductToCart(cartId, productId, quantity) {
    const cartIndex = this.carts.findIndex((cart) => cart.id === parseInt(cartId));
    if (cartIndex !== -1) {
      const existingProduct = this.carts[cartIndex].products.find(
        (product) => product.product === parseInt(productId)
      );
      if (existingProduct) {
        existingProduct.quantity += parseInt(quantity);
      } else {
        this.carts[cartIndex].products.push({ product: parseInt(productId), quantity: parseInt(quantity) });
      }
      this.saveDataToFile();
      return true;
    }
    return false;
  }

  saveDataToFile() {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(this.carts, null, 2));
    } catch (error) {
      console.error('Error al guardar en el archivo:', error);
    }
  }
}

module.exports = CartManager;
