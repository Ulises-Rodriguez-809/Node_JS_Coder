class ProductManager {
    constructor(){
        this.products = []
    }

    addProduct(product){
        const productoEncontrado = this.products.find(element => element.code === product.code);

        //FALTA COMPROBAR Q NINGUNO DE LOS CAMPOS ES NULL
        if (productoEncontrado === undefined) {
            this.products.push({
                ...product,
                id : this.products.length
            });
        }
    }

    getProducts(){
        return this.products;
    }

    getProductById(idProducto){
        const productoEncontrado = this.products.find(product => product.id === idProducto);

        if (productoEncontrado) {
            return productoEncontrado
        } else {
            console.log(`No se encontro el porducto con el con el ID : ${idProducto}`);
        }
    }
}


//esto ponelo dentro de un array y para agregarlos hacelo con un foreach NO LO DEJES ASI CHOTO
//HACETE UN REPO EN GITHUB
const product1 = {
    title : "Monster Blanco",
    descripcion : "Bebida energetica sin azucar",
    price : 450,
    thumbnail : "https://acdn.mitiendanube.com/stores/001/448/812/products/energy-ultra-mosnter1-641988d832c190fedf16276771317278-640-0.jpg",
    code : 45789517,
    stock : 15
}

const product2 = {
    title : "Pepitos",
    descripcion : "Masitas de trigo y chocolate",
    price : 100,
    thumbnail : "https://d3ugyf2ht6aenh.cloudfront.net/stores/001/750/456/products/galletitas-pepitos1-997665b2ca5ad112c016255133287229-640-0.jpeg",
    code : 457895173,
    stock : 10
}

const productos = new ProductManager();

console.log(productos.getProducts());
productos.addProduct(product1);
productos.addProduct(product2);
console.log(productos.getProducts());
