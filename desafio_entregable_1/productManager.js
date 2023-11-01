class ProductManager {
    constructor(){
        this.products = []
    }

    addProduct(product){

        const productKeys = Object.keys(product);

        productKeys.forEach(key => {
            if (key.trim() === "" || key === undefined || key === null) {
                return `El campo ${key} se ecnuentra vacio, igrese correctamente su valor`;
            }
        })

        const productoEncontrado = this.products.find(element => element.code === product.code);

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
        let productoEncontrado = this.products.find(product => product.id === idProducto);

        productoEncontrado ? productoEncontrado : productoEncontrado = `No se encontro el porducto con el con el ID : ${idProducto}`;

        return productoEncontrado;
    }
}


//array de productos
const productosArr = [
    {
        title : "Monster Blanco",
        descripcion : "Bebida energetica sin azucar",
        price : 450,
        thumbnail : "https://acdn.mitiendanube.com/stores/001/448/812/products/energy-ultra-mosnter1-641988d832c190fedf16276771317278-640-0.jpg",
        code : 45789517,
        stock : 15
    },
    {
        title : "Pepitos",
        descripcion : "Masitas de trigo y chocolate",
        price : 100,
        thumbnail : "https://d3ugyf2ht6aenh.cloudfront.net/stores/001/750/456/products/galletitas-pepitos1-997665b2ca5ad112c016255133287229-640-0.jpeg",
        code : 15978643,
        stock : 10
    },
    {
        title : "Mismo code",
        descripcion : "probar q no se agrega si tiene el mismo code",
        price : 450,
        thumbnail : "https://acdn.mitiendanube.com/stores/001/448/812/products/energy-ultra-mosnter1-641988d832c190fedf16276771317278-640-0.jpg",
        code : 45789517,
        stock : 15
    },
    {
        title : "                  ",
        descripcion : "probar q no se agrega tiene algun key-value sin completar",
        price : 450,
        thumbnail : "https://acdn.mitiendanube.com/stores/001/448/812/products/energy-ultra-mosnter1-641988d832c190fedf16276771317278-640-0.jpg",
        code : 345345435347,
        stock : 15
    },
    {
        title : null,
        descripcion : "probar q no se agrega si tiene algun key-value sin completar",
        price : 450,
        thumbnail : "https://acdn.mitiendanube.com/stores/001/448/812/products/energy-ultra-mosnter1-641988d832c190fedf16276771317278-640-0.jpg",
        code : 487867867817,
        stock : 15
    },
    {
        title : undefined,
        descripcion : "probar q no se agrega si tiene algun key-value sin completar",
        price : 450,
        thumbnail : "https://acdn.mitiendanube.com/stores/001/448/812/products/energy-ultra-mosnter1-641988d832c190fedf16276771317278-640-0.jpg",
        code : 489089098017,
        stock : 15
    }
];

//intancia de la clase ProductManager
const productos = new ProductManager();

//fun para añadir productos
const añadirProductos = (arr,obj)=>{
    arr.forEach(producto => obj.addProduct(producto));
}

//fun para obtener la lista de productos
const obtenerProductos = (obj)=>{
    console.log(obj.getProducts());
}

//fun para obtener el producto por su id
const obtenerProductoPorId = (obj,id)=>{
    console.log(obj.getProductById(id));
}

añadirProductos(productosArr,productos);
obtenerProductos(productos);
obtenerProductoPorId(productos,1);
obtenerProductoPorId(productos,156);