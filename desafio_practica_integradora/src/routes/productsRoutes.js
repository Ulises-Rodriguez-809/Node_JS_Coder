import { Router } from 'express';
import ProductManager from '../manager/productManager.js';

const router = Router();

const PATH = "productsList.json"
const productos = new ProductManager(PATH);

//ruta q muestra todos los productos o una cantidad especifica si se pasa una variable por la url (query params)
router.get("/", async (req, res) => {
    const productsList = await productos.getProducts();

    const consultas = req.query;
    const { limit } = consultas;

    //comprobar q limit se haya ingresado en la url
    if (limit !== undefined) {

        //convertir limit q es un string a numero
        const limitNumber = parseInt(limit);

        //si el el numero en limitNumber es mayor q la cantidad de productos totales, entonces devolve todos los productos
        //con esto evito q complete el resto de productos con null
        if (limitNumber > productsList.length) {
            res.send({
                status: "success",
                productos: productsList
            });

        } else { //caso contrario devolvemos la cantidad indicada en limit
            const auxArr = [];

            for (let i = 0; i < limitNumber; i++) {
                auxArr.push(productsList[i]);
            }

            res.send({
                status: "success",
                productos: auxArr
            });
        }

    } else {  //si no se pone el ?limit=n en la url devolvemos todos los productos
        res.send({
            status: "success",
            productos: productsList
        });
    }
});

//mostrar un producto especifico dependiendo su id
router.get("/:idProducto", async (req, res) => {

    let id = req.params.idProducto;

    const product = await productos.getProductById(id);

    (typeof product === "object") ? res.send({
        status: "success",
        producto: product
    }) : res.send(`<h1>No se encontro el producto con el id: ${id}</h1>`);
});

//añadir un nuevo producto
router.post("/", async (req, res) => {
    try {

        const product = req.body;

        const newProduct = await productos.addProduct(product);

        if (typeof newProduct === "object") {
            res.send({
                status: "success",
                productos: newProduct
            })
            
        } else {
            res.send({
                status: "error",
                msg: newProduct
            })
        }


    } catch (error) {
        console.log(error);
    }

});

//modificar las props de un producto
router.put("/:idProducto", async (req, res) => {
    try {
        const id = req.params.idProducto;
        const fields = req.body

        const msg = await productos.updateProduct(id,fields);

        res.send({
            status: "success",
            msg
        })
        
    } catch (error) {
        console.log(error);
    }

});

//eliminar un producto
router.delete("/:idProducto", async (req, res) => {
    try {
        const id = req.params.idProducto;

        const msg = await productos.deleteProduct(id);

        res.send({
            status: "success",
            msg
        })

    } catch (error) {
        console.log(error);
    }

});

export default router;