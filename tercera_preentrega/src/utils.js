import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';
import { transporter } from './config/gmail.js';

export const createHash = async (password) => {
    const salts = await bcrypt.genSalt(10);

    return bcrypt.hash(password, salts);
}

export const isValidPassword = async (password, user) => await bcrypt.compare(password, user.password);

export const emailSender = async (full_name = "nuevo usuario",email, template) => {
    console.log(full_name);
    console.log(email);

    const emailTemplate = template;

    try {

        const contenido = await transporter.sendMail({
            //Estructura del correo
            from: "e-commerce-Ulises",
            to: email,
            subject: "Registro exitoso",
            html: emailTemplate
        })
        
        console.log("Contenido", contenido);

        return true;

    } catch (error) {
        console.log(error.message);

        return false;
    }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;