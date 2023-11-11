import ProductManager from './manager/productManager.js';

//array de productos
const productosArr = [
    {
        title : "Monster Blanco",
        descripcion : "Bebida energetica sin azucar",
        price : 450,
        thumbnail : "https://acdn.mitiendanube.com/stores/001/448/812/products/energy-ultra-mosnter1-641988d832c190fedf16276771317278-640-0.jpg",
        code : "48aec566",
        stock : 15
    },
    {
        title : "Pepitos",
        descripcion : "Masitas de trigo y chocolate",
        price : 100,
        thumbnail : "https://d3ugyf2ht6aenh.cloudfront.net/stores/001/750/456/products/galletitas-pepitos1-997665b2ca5ad112c016255133287229-640-0.jpeg",
        code : "dsf594as8",
        stock : 10
    },
    {
        title : "Mismo code",
        descripcion : "probar q no se agrega si tiene el mismo code",
        price : 450,
        thumbnail : "https://acdn.mitiendanube.com/stores/001/448/812/products/energy-ultra-mosnter1-641988d832c190fedf16276771317278-640-0.jpg",
        code : "48aec566",
        stock : 15
    },
    {
        pepe : "pepe",
        descripcion : "probar q no se agrega key diferente a los aceptados",
        price : 450,
        thumbnail : "https://acdn.mitiendanube.com/stores/001/448/812/products/energy-ultra-mosnter1-641988d832c190fedf16276771317278-640-0.jpg",
        code : "34534as534a",
        stock : 15
    },
    {
        title : null,
        descripcion : "probar q no se agrega si tiene algun key-value sin completar",
        price : 450,
        thumbnail : "https://acdn.mitiendanube.com/stores/001/448/812/products/energy-ultra-mosnter1-641988d832c190fedf16276771317278-640-0.jpg",
        code : "456123sdf8",
        stock : 15
    },
    {
        title : undefined,
        descripcion : "probar q no se agrega si tiene algun key-value sin completar",
        price : 450,
        thumbnail : "https://acdn.mitiendanube.com/stores/001/448/812/products/energy-ultra-mosnter1-641988d832c190fedf16276771317278-640-0.jpg",
        code : "789fas54sg",
        stock : 15
    },
    {
        title : "",
        descripcion : "probar q no se agrega si tiene algun key-value sin completar",
        price : 450,
        thumbnail : "https://acdn.mitiendanube.com/stores/001/448/812/products/energy-ultra-mosnter1-641988d832c190fedf16276771317278-640-0.jpg",
        code : "a48d5e2666",
        stock : 15
    }
];

//intancia de la clase ProductManager
const productos = new ProductManager('./files/productsList.json');

//fun para añadir productos
const añadirProductos = async (arr,obj)=>{
    // arr.forEach(async (producto) => await obj.addProduct(producto));

    for (let i = 0; i < arr.length; i++) {
        await obj.addProduct(arr[i]);
    }
}

//fun para obtener la lista de productos
const obtenerProductos = async (obj)=>{
    const productsList = await obj.getProducts();

    return productsList;
}

//fun para obtener el producto por su id
const obtenerProductoPorId = async (obj,id)=>{
    const product = await obj.getProductById(id);

    return product
}

const eliminarProductoPorId = async (obj,id)=>{
    const msg = await obj.deleteProduct(id);

    return msg
}

const actualizarProducto = async (obj,id,newProps)=>{
    const msg = await obj.updateProduct(id,newProps); 

    return msg;
}


const env = async()=>{
    // await añadirProductos(productosArr,productos);
    
    // const respuesta = await eliminarProductoPorId(productos,1);
    // console.log(respuesta);

    // const producto = await obtenerProductoPorId(productos,3);
    // console.log(producto)
    
    // await añadirProductos([{
    //     title : "Pepitos",
    //     descripcion : "Masitas de trigo y chocolate",
    //     price : 100,
    //     thumbnail : "https://d3ugyf2ht6aenh.cloudfront.net/stores/001/750/456/products/galletitas-pepitos1-997665b2ca5ad112c016255133287229-640-0.jpeg",
    //     code : "ddas5f465sd4f65sdf",
    //     stock : 10
    // }],productos);

    // const productsList = await obtenerProductos(productos);
    // console.log(productsList);

    const res = await actualizarProducto(productos,2,{title : "alfajor", price : 150 ,stock : 20});
    console.log(res);

}

env();

// console.log(productos.updateProduct(1,{title : "alfajor", price : 150 ,stock : 20}));