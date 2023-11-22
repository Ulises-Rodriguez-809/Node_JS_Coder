import {Router} from 'express';
import ProductManager from '../manager/productManager.js';


const router = Router();
const productos = new ProductManager('./files/productsList.json');

let productsList = [];

//ruta q muestra todos los productos o una cantidad especifica si se pasa una variable por la url (query params)
router.get("/",async (req,res)=>{    
    productsList = await productos.getProducts();
    
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
router.get("/:idProducto",async (req,res)=>{

    let id = req.params.idProducto;

    const product = await productos.getProductById(Number(id)); //acordate q lo q te biene por la url es texto y tus id en el .json son numeros
    
    (typeof product === "object") ? res.json({product}) : res.send(`<h1>No se encontro el producto con el id: ${id}</h1>`);
});


export default router;