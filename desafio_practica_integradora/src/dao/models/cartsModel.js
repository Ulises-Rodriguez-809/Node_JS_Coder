import mongoose from 'mongoose';

const collection = "carts";

const cartsSchema = new mongoose.Schema({
    products : Object
})

const cartsModel = mongoose.model(collection,cartsSchema);

export default cartsModel;