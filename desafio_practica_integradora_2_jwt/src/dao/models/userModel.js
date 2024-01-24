import mongoose from 'mongoose';

const collection = "users";

const userSchema = new mongoose.Schema({
    first_name : {
        type : String,
        require : true
    },
    last_name : {
        type : String,
        require : true
    },
    email : {
        type : String,
        require : true
    },
    age : {
        type : Number,
        require : true
    },
    password : {
        type : String,
        require : true
    },
    cart : {
        type : [
            {
                type : mongoose.SchemaTypes.ObjectId,
                ref : "carts"
            }
        ],
        default : []
    },
    rol : {
        type : String,
        enum : ["user","admin"], 
        default : "user"
    },
})

// userSchema.pre("find", function () {
//     this.populate("carts.cart");
// })

// userSchema.pre("findOne", function () {
//     this.populate("carts.cart");
// })

const userModel = mongoose.model(collection,userSchema);

export default userModel;