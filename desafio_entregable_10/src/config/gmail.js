import nodemailer from "nodemailer";
import { options } from "./config.js";

//credenciales
// BUSCA DESPUES XQ AL PROFE LE ANDA PONIENDO CUALQUIER CONTRASEÑA PERO A VOS NECESITAS LA Q TE GENERA LA VERIFICACION EN 2 PASOS
// const adminEmail = options.ADMIN_EMAIL;
const adminEmail = "uliisesrodriguez809@gmail.com";
// const adminPass = options.ADMIN_PASSWORD;
const adminPass = "msqccuubswmmxdzm";
// const adminPass = "123456";

//configurar el canal de comunicacion entre node y gmail
const transporter = nodemailer.createTransport({
    host:"smtp.gmail.com",
    port:587,
    auth:{
        user:adminEmail,
        pass:adminPass
    },
    secure:false,
    tls:{
        rejectUnauthorized:false
    }
})

export { transporter };