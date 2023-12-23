import mongoose from 'mongoose';

const collection = "carts";

const cartsSchema = new mongoose.Schema({
    products : [
        {
            product : {
                type : mongoose.Schema.Types.ObjectId,
                ref : "products",
                require : true
            },
            quantity : {
                type : Number,
                require : true,
                default : 1
            }
        }
    ]
})

// const cartsSchema = new mongoose.Schema({
//     products : Object
// })

cartsSchema.pre("find",function () {
    this.populate("products.product")
})

const cartsModel = mongoose.model(collection,cartsSchema);

export default cartsModel;