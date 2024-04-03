import supertest from 'supertest'
import chai from 'chai'
import {app} from '../src/app.js';
import {options} from '../src/config/config.js';
import {CartsControllers} from '../src/controlador/carts.controllers.js'
import cartsModel from '../src/dao/models/cartsModel.js';
// import mongoose from 'mongoose';
// import {CartsRepository} from '../src/respository/carts.repository.js';

// CAPAZ Q EN VES DE IMPORTAR TODOS LOS MODELOS DE LO Q NECESITA CART PARA ANDAR LO IDEAL SEA IMPORTAR EL CARTS.CONTROLLER
// y como en carts.controller trabajas con static no hace falta intanciar la clase


const MONGO = options.MONGO_URL;

const expect = chai.expect;

describe('testing para el router de carts', () => { 
    befroeEach(async function(){
        //borra todas los usuarios de prueba los va borrando asi no te quedan usuarios de prueba en la db
        await cartsModel.deleteMany({});
    })

    it("enpoint: /api/cartsDB metodo: GET, obtiene todos los carts de la DB", async function () {
        
    })
})