import {fileURLToPath} from 'url';
import { dirname } from 'path';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//esto es una configuracion no la funcinalidad
const storage = multer.diskStorage({
    destination: function(req,file,cb) {
        cb(null,`${__dirname}/public/img`);
    },
    filename : function(req,file,cb){
        console.log(file);

        cb(null,`${Date.now()}-${file.originalname}`);
    }
})

//esta es la funcinalidad
export const uploader = multer({storage});

export default __dirname;