const fs = require('fs');

class ProductManager {
  constructor(filePath) {
    this.filePath = filePath;
    this.products = [];
    this.readDataFromFile();
  }

  // Lee los datos del archivo al iniciar
  readDataFromFile() {
    try {
      const data = fs.readFileSync(this.filePath, 'utf8');
      this.products = JSON.parse(data);
    } catch (error) {
      console.error('Error al leer el archivo:', error);
    }
  }

  // Método para obtener todos los productos
  getProducts() {
    return this.products;
  }
}

module.exports = ProductManager;
