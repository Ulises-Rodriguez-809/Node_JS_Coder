import {productosArr} from './productsList/productsArray.js';
import {añadirProductos, obtenerProductos, obtenerProductoPorId, eliminarProductoPorId, actualizarProducto} from './functions/funtionsProducts.js';
import express from 'express';
import productsRouter from './routes/productsRoutes.js';
import cartsRouter from './routes/cartRoutes.js';

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({extended:true}));

//le indicamos al servidor en q puerto tiene q escuchar (osea el puerto q queresmos q levante la app)
const server = app.listen(PORT,()=>{
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

app.use('/products',productsRouter);
app.use('/carts',cartsRouter);


const env = async()=>{
    await añadirProductos(productosArr,productos);
    
    // const respuesta = await eliminarProductoPorId(productos,0);
    // console.log(respuesta);

    // const producto = await obtenerProductoPorId(productos,3);
    // console.log(producto)

    const productsList = await obtenerProductos(productos);
    console.log(productsList);

    // const res = await actualizarProducto(productos,2,{title : "alfajor", price : 150 ,stock : 20});
    // console.log(res);

}

// env();

