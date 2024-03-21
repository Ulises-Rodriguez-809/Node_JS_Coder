import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';
import { transporter } from './config/gmail.js';
import { Faker, en } from '@faker-js/faker';

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

export const emailSender = async (email, subject, template) => {
    const emailTemplate = template;

    try {

        const contenido = await transporter.sendMail({
            //Estructura del correo
            from: "e-commerce-Ulises",
            to: email,
            subject: subject,
            html: emailTemplate
        })

        return true;

    } catch (error) {
        console.log(error.message);

        return false;
    }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;