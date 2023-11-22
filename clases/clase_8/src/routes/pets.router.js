import {Router} from 'express';
import {uploader} from '../utlis.js'

const router = Router();

const pets = [];

router.get('/',(req,res)=>{
    res.send({pets});
});

//'file' es el nombre q le pusimos al input de index.html
router.post('/',uploader.single('file'),(req,res)=>{
    const filename = req.file.filename;

    if (!filename) {
        return res.send({
            status : "error",
            error : "no se pudo cargar la img"
        })
    }
    
    const pet = req.body;

    pet.file = `http://localhost:8080/img/${filename}`;

    pets.push(pet);

    res.send({
        status : "success",
        msg : pets
    });
});

export default petsRouter;