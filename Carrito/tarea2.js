

class Producto {
  sku;            // Identificador único del producto
  nombre;         // Su nombre
  categoria;      // Categoría a la que pertenece este producto
  precio;         // Su precio
  stock;          // Cantidad disponible en stock

  constructor(sku,nombre,categoria,precio,stock){
        this.sku = sku;
        this.nombre = nombre;
        this.categoria = categoria;
        this.precio = precio;

        // Si no me definen stock, pongo 10 por default
        if(stock) {
            this.stock = stock;
        }else{
            this.stock = 10;
        }
  }
}

// Creo todos los productos que vende mi super
const queso = new Producto('KS944RUR', 'Queso', 10, 'lacteos', 4);
const gaseosa = new Producto('FN312PPE', 'Gaseosa', 5, 'bebidas');
const cerveza = new Producto('PV332MJ', 'Cerveza', 20, 'bebidas');
const arroz = new Producto('XX92LKI', 'Arroz', 7, 'alimentos', 20);
const fideos = new Producto('UI999TY', 'Fideos', 5, 'alimentos');
const lavandina = new Producto('RT324GD', 'Lavandina', 9, 'limpieza');
const shampoo = new Producto('OL883YE', 'Shampoo', 3, 'higiene', 50);
const jabon = new Producto('WE328NJ', 'Jabon', 4, 'higiene', 3);


const productosDelSuper = [queso, gaseosa, cerveza, arroz, fideos, lavandina, shampoo, jabon];

// Cada cliente que venga a mi super va a crear un carrito
class Carrito {
    productos;      // Lista de productos agregados
    categorias;     // Lista de las diferentes categorías de los productos en el carrito
    precioTotal;    // Lo que voy a pagar al finalizar mi compra
  
    // Al crear un carrito, empieza vació
    constructor() {
        this.precioTotal = 0;
        this.productos = [];
        this.categorias = [];
    }

    async agregarProducto(sku, cantidad) {
        console.log(`Agregando ${cantidad} ${sku}`);
    
        // Busco el producto en la "base de datos"
        try {
            const producto = await findProductBySku(sku);
            console.log("Producto encontrado", producto);
    
            // Verifico si el producto ya está en el carrito
            const productoExistente = this.productos.find(producto => producto.sku === sku);
            if (productoExistente) {
                // Si ya existe producto en el carrito, actualizo cantidad
                productoExistente.cantidad += cantidad;
                console.log(`La cantidad de producto existente de ${productoExistente.sku} es: ${productoExistente.cantidad}`);
            } else {
                // Agrego nuevo producto
                const nuevoProducto = new ProductoEnCarrito(sku, producto.nombre, cantidad);
                this.productos.push(nuevoProducto);
    
                // Verifico si la categoría ya está en la lista
                if (!this.categorias.includes(producto.categoria)) {
                    this.categorias.push(producto.categoria);
                }
            }
    
            const previa = producto.precio * cantidad;
            this.precioTotal += previa;
        } catch (error) {
            console.error(`Error al intentarinsertararticulo no existente:${error}`); 
        }
    }


    eliminarProducto(sku, cantidad) {
        return new Promise(async (resolve, reject) => {
          try {
            console.log(`Eliminando ${cantidad} ${sku}`);
            const producto = await findProductBySku(sku);
            
      
            // Buscar el producto en el carrito
            const productoExistente = this.productos.find(producto => producto.sku === sku);
      
            if (!productoExistente) {
              reject(`El producto ${sku} no existe en el carrito.`);
              return;
            }
      
            if (cantidad < productoExistente.cantidad) {
              productoExistente.cantidad -= cantidad;
              console.log(`Se han eliminado ${cantidad} unidades de ${sku} del carrito.`);
            } else {
              // Elimina el producto del carrito
              const index = this.productos.indexOf(productoExistente);
              this.productos.splice(index, 1);
              console.log(`Se ha eliminado el producto  ${sku} completamente del carrito.`);
            }
      
            resolve();
          } catch (error) {
            reject(`Error al eliminar el producto del carrito: ${error}`);
          }
        });
      }
    
}
class ProductoEnCarrito {
    sku;       // Identificador único del producto
    nombre;    // Su nombre
    cantidad;  // Cantidad de este producto en el carrito
  
    constructor(sku, nombre, cantidad) {
        this.sku = sku;
        this.nombre = nombre;
        this.cantidad = cantidad;
    }

  }
  

// Función que busca un producto por su sku en "la base de datos"
function findProductBySku(sku){
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const foundProduct = productosDelSuper.find(product => product.sku === sku);
                if (foundProduct){
                    resolve(foundProduct)
             //       console.log(foundProduct)
                }else {
                    reject(`product ${sku} not found`)
                }
            })
        }, 1500);
}


const carrito = new Carrito();
carrito.agregarProducto('WE328NJ', 7);
// carrito.agregarProducto('WE328NJ', 3);
// carrito.agregarProducto('OL883YE', 3);
// carrito.agregarProducto('OL883Y7', 3);
carrito.eliminarProducto('WE328NJ', 2)   //'WE328NJ', 7  
  .then(() => {
    console.log('Producto eliminado del carrito correctamente.');
  })
  .catch((error) => {
    console.error('Error al eliminar el producto del carrito:', error);
  });


