import { Router } from 'express';
import ProductManagerDB from '../dao/managersDB/productManagerDB.js';


const router = Router();

const productsDB = new ProductManagerDB();

router.get("/", async (req, res) => {
    try {

        const result = await productsDB.getProducts();

        if (typeof result !== "object") {
            res.status(400).send({
                status: "error",
                message: result
            });

        } else {
            res.send({
                status: "success",
                message: result
            })
        }

    } catch (error) {
        console.log(error);
    }
})

router.get("/:productId", async (req, res) => {
    try {
        const id = req.params.productId;

        const result = await productsDB.getProductById(id);

        if (typeof result === "string") {
            res.status(400).send({
                status: "error",
                message: result
            });

        } else {
            res.send({
                status: "success",
                message: result
            })
        }

    } catch (error) {
        console.log(error);
    }
})

router.post("/", async (req, res) => {
    try {

        const fields = req.body;

        const result = await productsDB.addProduct(fields);

        if (typeof result === "string") {
            res.status(400).send({
                status: "error",
                message: result
            });
            
        }
        else {
            res.send({
                status: "success",
                message: result
            })
        }

    } catch (error) {
        console.log(error);
    }
})

router.put("/:productId", async (req, res) => {
    try {
        const id = req.params.productId;
        const fields = req.body;

        const result = await productsDB.updateProduct(id, fields);

        if (typeof result === "string") {
            res.status(400).send({
                status: "error",
                message: result
            });

        } else {
            res.send({
                status: "success",
                message: `Se modifico con exito el producto con el id: ${id}`
            })
        }

        // const updateProduct = {
        //     ...fields
        // }

        // const result = await productsModel.updateOne({ _id: id }, { $set: updateProduct });

        // if (result["modifiedCount"] === 1) {
        //     res.send({
        //         status: "success",
        //         message: `Se modifico con exito el producto con el id: ${id}`
        //     })

        // } else {
        //     // para porbar esto en postman el id debe de ser el mismo largo q los id q te genera mongo
        //     //y tiene q ser hexadecimal [0...9], [a..f] y [A...F]:
        //     //657f7256adc125700f39a8cJKL --> esto va a dar error ya q no existe hexadecimal para J,K,L
        //     res.status(400).send({
        //         status: "error",
        //         message: `No se logro modificar el producto con el id: ${id}`
        //     });
        // }


    } catch (error) {
        console.log(error);
    }
})


router.delete("/:productId", async (req, res) => {
    try {
        const id = req.params.productId;

        const result = await productsDB.deleteProduct(id);


        if (typeof result === "string") {
            res.status(400).send({
                status: "error",
                message: result
            });

        } else {
            res.send({
                status: "success",
                message: `Se logro eliminar con exito el producto con el id: ${id}`
            })
        }

    } catch (error) {
        console.log(error);
    }
})


export default router;