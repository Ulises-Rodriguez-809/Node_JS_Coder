import mongoose from 'mongoose';

// esta es la colleccion q aparece en atlas
//es un array
const collection = "products";

//este es el formato de como se van a guardar los documentos q vayas creando
const productsSchema = new mongoose.Schema({
    title: String,
    description: String,
    code: String,
    price: Number,
    status: String || Boolean,
    stock: Number,
    category: String,
    thumbnails: Object,
})

const productsModel = mongoose.model(collection,productsSchema);

export default productsModel;