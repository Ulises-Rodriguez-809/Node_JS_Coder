import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';
import { transporter } from './config/gmail.js';
import { Faker, en } from '@faker-js/faker';
import jwt from 'jsonwebtoken';
import { options } from './config/config.js';

export const customFaker = new Faker({
    locale: [en]
});

const { commerce, image, database, string} = customFaker;

export const generateProductMocking = () => {
    const newProduct = {
        id: database.mongodbObjectId(),
        title: commerce.productName(),
        description: commerce.productDescription(),
        price: parseFloat(commerce.price()),
        code: string.uuid(),
        stock: parseInt(string.numeric(Math.floor(Math.random() * 2 + 1))),
        category: commerce.department(),
        status: true,
        thumbnails: [image.url()]
    }

    return newProduct;
}

export const createHash = async (password) => {
    const salts = await bcrypt.genSalt(10);

    return bcrypt.hash(password, salts);
}

export const isValidPassword = async (password, user) => await bcrypt.compare(password, user.password);

export const emailSender = async (email, template, subject = "Atencion al cliente") => {
    try {

        const contenido = await transporter.sendMail({
            //Estructura del correo
            from: "e-commerce-Ulises",
            to: email,
            subject,
            html: template
        })

        return true;

    } catch (error) {
        console.log(error.message);

        return false;
    }
}

export const generateEmailToken = (email,expireTime)=>{
    //pasale 1 minuto para hacer q el token expire rapido y probarlo, despues cambialo a 1 hora 3600 
    const token = jwt.sign({email},options.EMAIL_TOKEN,{expiresIn : expireTime});

    return token;
}

export const verifyEmailToken = (token)=>{
    console.log("verifiEmailToken");
    try {
        const info = jwt.verify(token,options.EMAIL_TOKEN); 
        console.log(info);

        return info.email;

    } catch (error) {
        console.log(error);
        return null;
    }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;