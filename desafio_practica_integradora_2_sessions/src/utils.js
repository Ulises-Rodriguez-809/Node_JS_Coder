import {fileURLToPath} from 'url';
import {dirname} from 'path';
// import multer from 'multer';
import bcrypt from 'bcrypt'

// 1- creamos la funcion q se encarga de hashear la contraseña --> para esto usamos hashSync de bcrytp
// luego como argumentos le pasamos la contraseña q el usuario escriba y el metodo genSaltSync para encriptar la contraseña
export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

// 2- creamos la fun q valida la contraseña, osea compara la contraseña q paso el usuario (por el form de login) y la compara con la contraseña hasheada
export const isValidPassword = (password,user) => bcrypt.compareSync(password,user.password);

// 3- tanto  como isValidPassword la vamos a usar en /config/passport.config.js
// createHash --> en la creacion del usuario en register (para su contraseña)
// isValidPassword --> en login para comparar la contraseña ingresada por el usuario con la hasheada guardada en la DB

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;

//genera el lugar de guardado
// const storage = multer.diskStorage({
//     destination : function (req,file,cb) { //cb = callback
//         cb(null,`${__dirname}/public/images`);
//     },
//     filename : function (req,file,cb) {
//         cb(null,`${Date.now()}-${file.originalname}`)
//     }
// })

// export const uploader = multer({storage});