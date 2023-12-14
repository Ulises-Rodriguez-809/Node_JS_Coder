import express from 'express';
import { engine } from 'express-handlebars';
import viewsRouter from './routes/views.router.js';
import productsRouter from './routes/productsRoutes.js';
import cartsRouter from './routes/cartRoutes.js';
import __dirname from './utlis.js';
import { Server } from 'socket.io';
import ProductManager from './manager/productManager.js';


// http://localhost:8080
// http://localhost:8080/realtimeproducts

//1-inicializamos nuestro app
const app = express();
//2- creamos el puerto
const PORT = 8080;

//3- usamos los middlewares (para poder trabajar con postman)
//3.1- toma los datos q vienen de una peticion JSON y los convierte en formato req.body
app.use(express.json());
//3.2- para poder extraer data del req.body
app.use(express.urlencoded({ extended: true }));

//4-le indicamos al servidor en q puerto tiene q escuchar (osea el puerto q queresmos q levante la app)
const httpServer = app.listen(PORT, () => {
    console.log(`Escuchando el puerto 8080, iniciando Express JS en http://localhost:${PORT}`)
});

//5-creamos el socket
const io = new Server(httpServer);

//6-instanciamos el motor de plantilla handlebars
app.engine("handlebars", engine());

//7-configuramos el motor de plantilla handlebars
//recorda q con set asignamos un nombre a un valor (esto lo hacemos para configurar el comportamiento de la app)
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

//8-middleware para poder usar el css y js de nuestro directorio public
//express.static() --> es una funcion q toma un path y retorna un middleware q sirve todos los archivos de la ruta indicada en el path
//express.static(__dirname+"/public") --> da como resultado una funcion q express la interpreta como middleware 
app.use(express.static(__dirname + "/public"));

//9-rutas
app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);


//product con socket
//13- socket del servidor (este se comunica con el socket del cliente en index.js)
io.on("connection",async (socket) => {
    //terminnal de VS
    console.log(socket.id)
    console.log("cliente conectado");

    // mensaje para el cliente q se conecto
    socket.emit("nuevo-cliente","Ingresaste con exito a la lista de productos");
    //mensaje para el resto de clientes
    socket.broadcast.emit("resto-de-clientes","Ingreso un nuevo comprador");

    //mensaje con el id del socket 
    socket.emit("id-socket",socket.id);

    // 14- intanciamos el ProductManager para poder trabajar con sus metodos
    const PATH = "productsList.json";
    const productos = new ProductManager(PATH);

    const allProducts = await productos.getProducts();

    // 15- creamos el evento "mostrar-productos" y con io.emit le mostramos a todos los clientes la lista de productos
    socket.emit("mostrar-productos", allProducts);

    //20-recivimos el evento emitido en el front de eliminar un producto
    socket.on("eliminar-producto",async (data)=>{

        //veo si el producto con el id mandado desde el front existe
        const productoEncontrado = await productos.getProductById(data);
        
        if (typeof productoEncontrado === "object") {
            //elimino el producto del json
            const productoEliminado = await productos.deleteProduct(data);
            //obtengo de nuevo todos los productos de nuevo (para asi obtener la info del json actualizado)
            const allProductsUpdate = await productos.getProducts();
            //mando al front la lista de productos 
            //fijate q lo tenes q trabajar con io ya q este cambio lo tiene q ver todos los usuarios conectados
            io.emit("producto-eliminado",{allProductsUpdate, id : data});
        } else {
            socket.emit("no-se-logro-eliminar-producto",`No se logro eliminar el producto con el id: ${data}`);
        }

    });

    // 24- recivo el evento de añadir-producto del front
    socket.on("añadir-producto",async (data)=>{
        const añadirProducto = await productos.addProduct(data);

        if (typeof añadirProducto === "object") {
            const allProducts = await productos.getProducts();

            io.emit("producto-añadido",allProducts);
        } else {
            socket.emit("no-añadido","No se logro añadir el producto")
        }
    })
})