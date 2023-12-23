import { Router } from 'express';
import ProductManagerDB from '../dao/managersDB/productManagerDB.js';
import productsModel from '../dao/models/productsModel.js';


const router = Router();

const productsDB = new ProductManagerDB();

// ESTE AHORA TIENE Q DEVOLVER 
// {
// 	status:success/error
// payload: Resultado de los productos solicitados
// totalPages: Total de páginas
// prevPage: Página anterior
// nextPage: Página siguiente
// page: Página actual
// hasPrevPage: Indicador para saber si la página previa existe
// hasNextPage: Indicador para saber si la página siguiente existe.
// prevLink: Link directo a la página previa (null si hasPrevPage=false)
// nextLink: Link directo a la página siguiente (null si hasNextPage=false)
// }


router.get("/", async (req, res) => {
    try {

        const {limit,page,sort,category,stock} = req.query;
        const query = {};


        const options = {
            limit : limit ?? 10,
            page : page ?? 1,
            sort : {price : sort === "asc" ? 1 : -1},
            lean : true
        }

        if (category) {
            query.category = category;

        } 
        else if (stock) {
            query.stock = stock;
            console.log(query);   
        }

        // console.log("stock:", stock);
        // console.log("category:", category);
        // console.log("la query es: ",query);

        const result = await productsDB.getProducts(query,options);

        // console.log(result["messagge"]);

        // tema del LINK
        if (result["messagge"].hasPrevPage) {
            console.log("tine pagina anterior");
            // analiza por casos aca para si tiene stock o no y category o no
            result["messagge"].prevLink =  `http://localhost:8080/api/productsDB?limit=${options.limit}&page=${result["messagge"].prevPage}`//aca tenes q hardcodear todas las opciones del link
            // LOCALHOST::API/PDORUCTS/PAGE=2........

            // FIJATE Q EL GET TIENE Q QUEDAR COMO LO HIZO EL PROFE 
            // ELIMINA EL GET("/PRODUCTS DE ABAJO")
        }

        if (result["messagge"].hasNextPage) {
            console.log("tiene pagina siguiente");
            result["messagge"].nextLink =  `http://localhost:8080/api/productsDB?limit=${options.limit}&page=${result["messagge"].nextPage}`//aca tenes q hardcodear todas las opciones del link
            
        }

        res.send({
            result
        })

        // if (typeof result !== "object") {
        //     res.status(400).send({
        //         status: "error",
        //         message: result
        //     });

        // } else {
        //     res.send({
        //         status: "success",
        //         message: result
        //     })
        // }

    } catch (error) {
        console.log(error);
    }
})


router.get("/products", async (req, res) => {
    try {
        const consultas = req.query;
        const { limit, page, sort, query } = consultas;

        console.log("limit: ",limit);
        console.log("page: ",page);
        console.log("query: ",query);

        // vas a tener q analizar por casos el query
        // cuando veas q te llega en query
        // le asignas con const query = {"lo q te hayan pasado" : "bibida o comida o etc"}
        // y se lo mandas a 1*

        const products = await productsModel.paginate(
            // 1* query esto lo cambias por el {} de abajo
            {},
            {
                limit : limit !== undefined ? parseInt(limit) : 10,
                lean : true, //para lo q te venga de la DB te lo convierta a formato json y habdlebars lo entienda
                page : page !== undefined ? parseInt(page) : 1 //si el page no existe q arranque del 1
                // query como option tambien
            }
        )

        // console.log(products);



        res.render("products",{products});

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