import userModel from "../models/userModel.js";


export default class Users {
    constructor() {
        console.log("Funciona el dbManager");
    }

    getAllUsers = async () => {
        // let users = await userModel.find().lean().populate("carts.cart");
        let users = await userModel.find().lean();

        return users;
    }

    saveUser = async (user) => {
        let result = await userModel.create(user);

        return result;
    }

    getUser = async (params) => {
        // let result = await userModel.findOne(params).lean().populate("carts.cart");
        let result = await userModel.findOne(params).lean();

        return result;
    }

    updateUser = async (id, user) => {
        // como lo q me trae es un objeto

        delete user._id; //borro la referencia
        // esto se hace para checkear y no arriesgarte a pisar todos los usuarios

        let result = await userModel.updateOne({_id:id},{$set:user}) //1. filtrado sobre q registro quiero trabajar 2. la info q quiero guardar

        return result;
    }
}