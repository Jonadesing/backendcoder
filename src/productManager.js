const fs = require('fs');

class ProductManager {
  constructor(filePath) {
    this.filePath = filePath;
    this.products = [];
    this.readDataFromFile();
  }

  readDataFromFile() {
    try {
      const data = fs.readFileSync(this.filePath, 'utf8');
      this.products = JSON.parse(data);
    } catch (error) {
      console.error('Error al leer el archivo:', error);
    }
  }

  getProducts() {
    return this.products;
  }

  addProduct(newProduct) {
    const { title, description, price, thumbnail, code, stock } = newProduct;
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      throw new Error('Todos los campos son obligatorios.');
    }

    const codeExists = this.products.some((existingProduct) => existingProduct.code === code);
    if (codeExists) {
      throw new Error('El código debe ser único.');
    }

    const productId = this.products.length > 0 ? Math.max(...this.products.map((p) => p.id)) + 1 : 1;
    const newProductData = {
      id: productId,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };

    this.products.push(newProductData);
    this.saveDataToFile();
    return productId;
  }

  updateProduct(productId, updatedFields) {
    const productIndex = this.products.findIndex((product) => product.id === parseInt(productId));
    if (productIndex !== -1) {
      this.products[productIndex] = { ...this.products[productIndex], ...updatedFields };
      this.saveDataToFile();
      return true;
    }
    return false;
  }

  deleteProduct(productId) {
    const initialLength = this.products.length;
    this.products = this.products.filter((product) => product.id !== parseInt(productId));
    if (this.products.length !== initialLength) {
      this.saveDataToFile();
      return true;
    }
    return false;
  }

  saveDataToFile() {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(this.products, null, 2));
    } catch (error) {
      console.error('Error al guardar en el archivo:', error);
    }
  }
}

module.exports = ProductManager;

