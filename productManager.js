class ProductManager {
    constructor() {
      this.products = [];
      this.productId = 1; // ID autoincrementable
    }
  
    addProduct(title, description, price, thumbnail, code, stock) {
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
        id: this.productId,
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
      };
  
      this.products.push(newProduct);
      this.productId++; // Incrementar el ID para el próximo producto
  
      return newProduct;
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
  }
  
  // Crear instancia de ProductManager
  const manager = new ProductManager();
  
  // Llamar a getProducts, debería devolver un arreglo vacío
  console.log(manager.getProducts());
  
  // Agregar un nuevo producto
  try {
    const newProduct = manager.addProduct(
      'producto prueba',
      'Este es un producto prueba',
      200,
      'Sin imagen',
      'abc123',
      25
    );
    console.log('Producto agregado:', newProduct);
  } catch (error) {
    console.log('Error al agregar el producto:', error.message);
  }
  
  // Volver a llamar a getProducts, debería mostrar el producto agregado anteriormente
  console.log(manager.getProducts());
  
  // Intentar agregar un producto con el mismo código
  try {
    manager.addProduct(
      'producto prueba',
      'Este es un producto prueba',
      200,
      'Sin imagen',
      'abc123',
      25
    );
  } catch (error) {
    console.log('Error al agregar el producto:', error.message);
  }
  
  // Probar getProductById con un ID válido y otro inválido
  try {
    console.log(manager.getProductById(1)); // Producto existente
    console.log(manager.getProductById(3)); // Producto no existente
  } catch (error) {
    console.log('Error:', error.message);
  }
  