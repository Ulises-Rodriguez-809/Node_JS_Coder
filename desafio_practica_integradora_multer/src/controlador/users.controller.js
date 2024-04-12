import jwt from 'jsonwebtoken';
import { userService } from '../respository/index.repository.js';
import {options} from '../config/config.js'

class UsersControllers{
    static premiumUser = async (req, res) => {
        try {
            const { rol } = req.body;

            const tokenInfo = req.cookies["jwt-cookie"];
            const decodedToken = jwt.decode(tokenInfo);

            const user = await userService.getWhitoutFilter(decodedToken);

            user.rol = rol;

            const updateUser = await userService.update(user.id, user);

            res.clearCookie(options.COOKIE_WORD);

            res.send({
                status: "success",
                payload: "Rol cambiado de USER a PREMIUM con exito"
            })

        } catch (error) {
            req.logger.error("No se logro cambiar el rol del usuario de : user a premium");

            res.status(400).send({
                status: "error",
                payload: "Error al intentar modificar el rol del usuario"
            })
        }
    }
}



export {UsersControllers};