import { Router } from 'express';
import ProductManagerDB from '../dao/managersDB/productManagerDB.js';

const router = Router();

const productsDB = new ProductManagerDB();

router.get("/", async (req, res) => {
    try {

        const { limit, page, sort, category, stock } = req.query;
        const query = {};

        const auxSort = `&sort=${sort}`;
        const auxCategory = `&category=${category}`;
        const auxStock = `&stock=${stock}`;

        const options = {
            limit: limit ?? 10,
            page: page ?? 1,
            sort: { price: sort === "asc" ? 1 : -1 },
            lean: true
        }

        if (category) {
            query.category = category;
        }
        else if (stock) {
            query.stock = parseInt(stock);
        }

        const result = await productsDB.getProducts(query, options);

        const totalPages = result["messagge"]["totalPages"];

        if (page > totalPages) {
            // este return es para q el resto del codigo no se ejecute ya q si bien no influye en el funcionamiento por consola tira error
            // Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client
            return res.status(400).send({
                status: "error",
                message: `El numero de pagina ingresado: ${page} no es correcto, con el limit: ${limit} el total de paginas disponibles es de : ${totalPages}, ingresar un page que se encuentre entre los valores de paginas totales`,
                link: `http://localhost:8080/api/productsDB?limit=${options.limit}&page=1`
            });
        }

        // tema del LINK
        if (result["messagge"].hasPrevPage) {
            console.log("tine pagina anterior");

            console.log(`http://localhost:8080/api/productsDB?limit=${options.limit}&page=${result["messagge"].prevPage}${sort && auxSort}${category ? auxCategory : ""}${stock ? auxStock : ""}`);

            result["messagge"].prevLink = `http://localhost:8080/api/productsDB?limit=${options.limit}&page=${result["messagge"].prevPage}${sort ? auxSort : ""}${category ? auxCategory : ""}${stock ? auxStock : ""}`;

        }

        if (result["messagge"].hasNextPage) {
            console.log("tiene pagina siguiente");

            result["messagge"].nextLink = `http://localhost:8080/api/productsDB?limit=${options.limit}&page=${result["messagge"].nextPage}${sort ? auxSort : ""}${category ? auxCategory : ""}${stock ? auxStock : ""}`;

        }

        if (typeof result !== "object") {
            res.status(400).send({
                status: "error",
                message: "Error no se encontro la DB"
            });

        } else {
            res.send({
                result
            })
        }

    }
    catch (error) {
        console.log(error);
    }
})


// router.get("/products", async (req, res) => {
//     try {
//         const consultas = req.query;
//         const { limit, page, sort, query } = consultas;

//         console.log("limit: ", limit);
//         console.log("page: ", page);
//         console.log("query: ", query);

//         // vas a tener q analizar por casos el query
//         // cuando veas q te llega en query
//         // le asignas con const query = {"lo q te hayan pasado" : "bibida o comida o etc"}
//         // y se lo mandas a 1*

//         const products = await productsModel.paginate(
//             // 1* query esto lo cambias por el {} de abajo
//             {},
//             {
//                 limit: limit !== undefined ? parseInt(limit) : 10,
//                 lean: true, //para lo q te venga de la DB te lo convierta a formato json y habdlebars lo entienda
//                 page: page !== undefined ? parseInt(page) : 1 //si el page no existe q arranque del 1
//                 // query como option tambien
//             }
//         )

//         // console.log(products);



//         res.render("products", { products });

//     } catch (error) {
//         console.log(error);
//     }
// })




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