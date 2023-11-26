const fs = require('fs');

class ProductManager {
  constructor(path) {
    this.path = path;
    this.products = [];
    this.readDataFromFile();
  }

  readDataFromFile() {
    try {
      const data = fs.readFileSync(this.path, 'utf8');
      this.products = JSON.parse(data);
    } catch (error) {
      console.error('Error al leer el archivo:', error);
    }
  }

  async saveDataToFile() {
    try {
      await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2));
    } catch (error) {
      console.error('Error al guardar en el archivo:', error);
    }
  }

  async addProduct(title, description, price, thumbnail, code, stock) {
    // Validar campos obligatorios
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      throw new Error('Todos los campos son obligatorios.');
    }

    // Validar código único
    const codeExists = this.products.some((product) => product.code === code);
    if (codeExists) {
      throw new Error('El código ya existe. Debe ser único.');
    }

    const newProduct = {
      id: this.products.length > 0 ? Math.max(...this.products.map((p) => p.id)) + 1 : 1,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };

    this.products.push(newProduct);
    await this.saveDataToFile();
    return newProduct.id;
  }

  getProducts() {
    return this.products;
  }

  getProductById(id) {
    const foundProduct = this.products.find((product) => product.id === id);
    if (foundProduct) {
      return foundProduct;
    } else {
      throw new Error('Producto no encontrado.');
    }
  }

  async updateProduct(id, updatedFields) {
    const productIndex = this.products.findIndex((product) => product.id === id);
    if (productIndex !== -1) {
      this.products[productIndex] = { ...this.products[productIndex], ...updatedFields };
      await this.saveDataToFile();
      return true;
    }
    return false;
  }

  async deleteProduct(id) {
    const initialLength = this.products.length;
    this.products = this.products.filter((product) => product.id !== id);
    if (this.products.length !== initialLength) {
      await this.saveDataToFile();
      return true;
    }
    return false;
  }
}

// Ejemplo de uso:
const productManager = new ProductManager('products.json');

(async () => {
  // Agregar un producto
  try {
    const productId = await productManager.addProduct(
      'producto prueba',
      'Este es un producto prueba',
      200,
      'Sin imagen',
      'abc123',
      25
    );
    console.log('Producto agregado con ID:', productId);
  } catch (error) {
    console.log('Error al agregar el producto:', error.message);
  }

  // Obtener todos los productos
  const allProducts = productManager.getProducts();
  console.log('Todos los productos:', allProducts);

  // Obtener un producto por ID
  try {
    const productById = productManager.getProductById(1);
    console.log('Producto con ID 1:', productById);
  } catch (error) {
    console.log('Error:', error.message);
  }

  // Actualizar un producto
  const updated = await productManager.updateProduct(1, { price: 150, stock: 25 });
  if (updated) {
    console.log('Producto actualizado exitosamente');
  } else {
    console.log('No se pudo actualizar el producto');
  }

  // Eliminar un producto por ID
  const deleted = await productManager.deleteProduct(1);
  if (deleted) {
    console.log('Producto eliminado exitosamente');
  } else {
    console.log('No se pudo eliminar el producto');
  }
})();
