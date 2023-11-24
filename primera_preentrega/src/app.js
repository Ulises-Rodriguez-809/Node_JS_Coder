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
    <h3>http://localhost:8080/api/products para ver todos los productos</h3>
    <h3>http://localhost:8080/api/products/2 para ver el producto con el id 2</h3>
    <h3>http://localhost:8080/api/products?limit=5 para ver los primeros 5 productos</h3>
    <br>
    <h3>http://localhost:8080/api/carts para ver todos los carritos de compra</h3>
    <h3>http://localhost:8080/api/carts/0 para ver la info del carrito con el id 0</h3>
    <h3>http://localhost:8080/api/carts/0/products para ver solo la lista de productos del carrito con el id 0</h3>
    <h3>http://localhost:8080/api/carts/0/products/2 para ver el producto con el id 2 del carrito con el id 0</h3>
    `)
});

app.use('/api/products',productsRouter);
app.use('/api/carts',cartsRouter);

