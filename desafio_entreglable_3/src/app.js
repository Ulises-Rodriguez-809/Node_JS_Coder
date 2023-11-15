import ProductManager from './manager/productManager.js';
import {productosArr} from './productsList/productsArray.js';
import {añadirProductos, obtenerProductos, obtenerProductoPorId, eliminarProductoPorId, actualizarProducto} from './functions/funtionsProducts.js';
import express from 'express';

const app = express();
const PORT = 8080;

//intancia de la clase ProductManager
const productos = new ProductManager('./files/productsList.json');

//le indicamos al servidor en q puerto tiene q escuchar (osea el puerto q queresmos q levante la app)
app.listen(PORT,()=>{
    console.log(`Escuchando el puerto 8080, iniciando Express JS en http://localhost:${PORT}`)
});

//intrucciones con ejemplos
app.get("/",async (req,res)=>{
    res.send(`
    <h1>Desafio entregable 3</h1>
    <h2>Ejemplos:</h2>
    <h3>http://localhost:8080/products para ver todos los productos</h3>
    <h3>http://localhost:8080/products/2 para ver el producto con el id 2</h3>
    <h3>http://localhost:8080/products?limit=5 para ver los primeros 5 productos</h3>
    `)
});

//ruta q muestra todos los productos o una cantidad especifica si se pasa una variable por la url (query params)
app.get("/products",async (req,res)=>{    
    const productsList = await productos.getProducts();
    
    const consultas = req.query;
    const {limit} = consultas;

    //comprobar q limit se haya ingresado en la url
    if (limit !== undefined) {

        //convertir limit q es un string a numero
        const limitNumber = Number(limit);

        //si el el numero en limitNumber es mayor q la cantidad de productos totales, entonces devolve todos los productos
        //con esto evito q complete el resto de productos con null
        if (limitNumber > productsList.length) {
            res.json({productsList});   

        } else { //caso contrario devolvemos la cantidad indicada en limit
            const auxArr = [];
    
            for (let i = 0; i < limitNumber; i++) {
                auxArr.push(productsList[i]);
            }
    
            res.json({auxArr});
        }
        
    } else {  //si no se pone el ?limit=n en la url devolvemos todos los productos
        res.json({productsList});
    }


});

//mostrar un producto especifico dependiendo su id
app.get("/products/:idProducto",async (req,res)=>{

    let id = req.params.idProducto;

    const product = await productos.getProductById(Number(id)); //acordate q lo q te biene por la url es texto y tus id en el .json son numeros
    
    (typeof product === "object") ? res.json({product}) : res.send(`<h1>No se encontro el producto con el id: ${id}</h1>`);
});



const env = async()=>{
    await añadirProductos(productosArr,productos);
    
    // const respuesta = await eliminarProductoPorId(productos,0);
    // console.log(respuesta);

    // const producto = await obtenerProductoPorId(productos,3);
    // console.log(producto)
    
    // await añadirProductos([{
	// 	title: "Monster Blanco",
	// 	descripcion: "Bebida energetica sin azucar",
	// 	price: 450,
	// 	thumbnail: "https://acdn.mitiendanube.com/stores/001/448/812/products/energy-ultra-mosnter1-641988d832c190fedf16276771317278-640-0.jpg",
	// 	code: "48aec566",
	// 	stock: 15
	// }],productos);

    const productsList = await obtenerProductos(productos);
    console.log(productsList);

    // const res = await actualizarProducto(productos,2,{title : "alfajor", price : 150 ,stock : 20});
    // console.log(res);

}

// env();

