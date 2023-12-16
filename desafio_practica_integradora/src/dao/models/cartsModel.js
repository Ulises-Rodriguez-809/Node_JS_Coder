import mongoose from 'mongoose';

const collection = "carts";

const cartsSchema = new mongoose.Schema({
    products : Object
})

// carts : [{
//     id : {
//         type : Number,
//         unique : true
//     },
//     products : [{
//         id : {
//             type : Number,
//             unique : true
//         },
//         quantity : Number
//     }]
// }],

// id : {
//     type : Number,
//     unique : true
// },
// products : []

const cartsModel = mongoose.model(collection,cartsSchema);

export default cartsModel;