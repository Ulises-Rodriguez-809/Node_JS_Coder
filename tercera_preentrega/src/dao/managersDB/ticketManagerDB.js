import { v4 as uuidv4 } from "uuid";
import ticketModel from '../models/ticketModel.js';
import { CartManagerDB } from './cartManagerDB.js';
import { Users } from "./userManager.js";
import { ProductManagerDB } from "./productManagerDB.js";

const Product = new ProductManagerDB();
const Cart = new CartManagerDB();
const User = new Users();

const calculateAmount = async (arrayProducts)=>{
    let totalAmount = 0;

    // https://stackoverflow.com/questions/37576685/using-async-await-with-a-foreach-loop
    for (const item of arrayProducts) {
        let amount = item.quantity;

        let isStock = await Product.isInStock(amount,item.product.id);

        if (isStock) {
            const aux = await Product.getProductById(item.product.id); 

            let stockUpdate = aux.stock - item.quantity;

            const isUpdated = await Product.updateProduct(aux._id, {stock : stockUpdate});

            if (isUpdated) {
                totalAmount += aux.price * item.quantity;
            }
        }
    }

    return totalAmount;
}

export class TicketManager {
    async getTicket(ticketId) {
        try {
            const ticket = await ticketModel.findOne({ticketId})

            if (!ticket) {
                return "Ticket de compra no encontrado";
            }

            return ticket;

        } catch (error) {
            console.log(error.message);
        }
    }

    async createTicket(cartId) {
        try {
            // code: String debe autogenerarse y ser único
// purchase_datetime: Deberá guardar la fecha y hora exacta en la cual se formalizó la compra (básicamente es un created_at)
// amount: Number, total de la compra.
// purchaser: String, contendrá el correo del usuario asociado al carrito.
            const user = await User.getUser({cart : cartId});
            // console.log("user ticket man", user);
            const cart = await Cart.getCartById(cartId);
            // console.log("cart ticket man", cart);

            if (!user) {
                return "Usuario no encontrado";
            }

            if (!cart) {
                return `No se encontro el cart con el id: ${cartId}`;
            }

            const code = uuidv4();
            let created_at = "";
            let amount = 0;
            const purchaser = user.email;

            const date = new Date();

            const [day, month, year] = [
                date.getDate(),
                date.getMonth(),
                date.getFullYear(),
            ];

            created_at = `dia: ${day}, mes: ${month+1}, año: ${year}`;

            amount = await calculateAmount(cart.products);

            const newTicket = {
                code,
                purchase_datetime : created_at,
                amount,
                purchaser
            }

            const result = ticketModel.create(newTicket);

            return result;

        } catch (error) {
            console.log(error.message);
        }
    }
}