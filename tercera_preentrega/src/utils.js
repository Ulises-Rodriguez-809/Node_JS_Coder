import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';
import { transporter } from './config/gmail.js';

export const createHash = async (password) => {
    const salts = await bcrypt.genSalt(10);

    return bcrypt.hash(password, salts);
}

export const isValidPassword = async (password, user) => await bcrypt.compare(password, user.password);

export const emailSender = async (full_name,email) => {
    console.log(full_name);
    console.log(email);

    const emailTemplate = `<div>
        <h1>Bienvenido ${full_name}!!</h1>
        <img src="https://www.ceupe.com/images/easyblog_articles/3625/b2ap3_large_que-es-un-tienda-online.png" style="width:250px; height : 250px"/>
        <p>Ya puedes empezar a usar nuestros servicios</p>
        <a href="http://localhost:8080/">Ir a la pagina</a>
        </div>`;

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