import {fileURLToPath} from 'url';
import {dirname} from 'path';

import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;

//genera el lugar de guardado
const storage = multer.diskStorage({
    destination : function (req,file,cb) { //cb = callback
        cb(null,`${__dirname}/public/images`);
    },
    filename : function (req,file,cb) {
        cb(null,`${Date.now()}-${file.originalname}`)
    }
})

export const uploader = multer({storage});