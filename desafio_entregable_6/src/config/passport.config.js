// 4- importamos passport para la autenticacion 
import passport from 'passport';
import local from 'passport-local';
import GitHubStrategy from 'passport-github2';

import userModel from '../dao/models/user.model.js';
// 5- importamos la creacion y validacion de contraseñas con bcrypt
import { createHash, isValidPassword } from '../utils.js';

// 6- asignamos el local.Strategy a una variable (esto para no repetir a lo loco local.Strategy)
const LocalStrategy = local.Strategy;

// 7- creamos la funcion para inicializar el passport
const inicializePassport = () => {
    // 8- fijate q passport usa sus propios middlewares
    // fijate q el middleware solo lo estamos aplicacndo a la ruta regiter, de esta manera este solo se va a ejecutar en el register
    passport.use("register", new LocalStrategy(
        { passReqToCallback: true, usernameField: "email" },
        async (req, username, password, done) => {

            
            // DATOS: 
            //passReqToCallback para poder acceder a la info del req 
            // usernameField --> para indicar con cual campo queremos autenticar
            // done o (cb en la doc) es la callback de resolucion de passport (el primer argumento es el error, el segundo para el usuario)

            const { first_name, last_name, email, age } = req.body;

            try {
                const user = await userModel.findOne({ email: username });

                if (user) {
                    console.log(`El usuario con el email : ${username} ya se encuentra registrado`);
                    // Si la credencial no pertenece a un usuario conocido o no es válida llama a la devolución de llamada false para indicar un error de autenticación
                    return done(null, false) //RECORDA Q DONE (O CB EN LA DOC) NECESITA Q LE PASES COMO PRIMER ARGUMENTO EL ERROR, SI NO HAY ERROR LE PASAS NULL
                }

                const newUser = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: createHash(password) //usamos la fun de util.js para hashear la contraseña
                }

                const result = await userModel.create(newUser);

                // Si los datos pasados son validos --> esa credencial es válida, llama a la devolución de llamada con el usuario autenticado
                return done(null, result);

            } catch (error) {
                return done(error);
            }

        }
    ))

    passport.use("login", new LocalStrategy(
        { usernameField: "email" },
        // si te preguntas xq username y password es xq passport necesita los 2 (esto por las estrategias te autenticacion q vimos)
        // si no entuentra alguna de las 2 passport no te va a andar
        async (username, password, done) => {
            try {
                const user = await userModel.findOne({ email: username })

                if (!user) {
                    return done(null, false);
                }

                if (!isValidPassword(password, user)) {
                    return done(null, false);
                }

                return done(null, user);

            } catch (error) {
                done(error);
            }
        }
    ))

    // 9- para poder restaurar el estado de autenticacion passport necesita serializar y deserializar usuarios, esto xq puede pasar q si como en JS no limpias las variables, cache, etc puede pasar q se te pise un usuario con otro.
    // esto se hace para q en cada solicitud no tenga las credenciales del usuario anterior

    passport.serializeUser((user, done) => {
        // en el caso de serializar pasamos el id del user
        done(null, user._id);
    })

    passport.deserializeUser(async (id, done) => {
        // en caso deserializar buscamos al usuario en la DB
        let user = await userModel.findOne({ id });

        done(null, user);
    })

    // FALTA CON GITHUB
}


export default inicializePassport;