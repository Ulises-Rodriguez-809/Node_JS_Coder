import passport from 'passport';
import local from 'passport-local';
import GitHubStrategy from 'passport-github2';
import jwt from 'passport-jwt';
import {options} from './config.js';


import { createHash, isValidPassword } from '../utils.js';
import {Users} from '../dao/managersDB/userManager.js';

const User = new Users();

const LocalStrategy = local.Strategy;

// creamos la estrategia para jwt
const JWTStrategy = jwt.Strategy;
//  el JWT se analiza a partir de la solicitud mediante una devolución de llamada proporcionada por el usuario y pasada como parámetro jwtFromRequest. Esta devolución de llamada, a partir de ahora denominada extractor, acepta un objeto de solicitud como argumento y devuelve la cadena JWT codificada o nulo
// En Passport-jwt.ExtractJwt se proporcionan varias funciones de fábrica de extractores. Estas funciones de fábrica devuelven un nuevo extractor configurado con los parámetros dados
// fromHeader(header_name)crea un nuevo extractor que busca el JWT en el encabezado http dado
// fromBodyField(field_name)crea un nuevo extractor que busca el JWT en el campo del cuerpo dado. Debe tener un analizador de cuerpo configurado para poder utilizar este método.
// fromUrlQueryParameter(param_name)crea un nuevo extractor que busca el JWT en el parámetro de consulta de URL dado.
// fromAuthHeaderWithScheme(auth_scheme)crea un nuevo extractor que busca el JWT en el encabezado de autorización, esperando que el esquema coincida con auth_scheme.
// fromAuthHeaderAsBearerToken()crea un nuevo extractor que busca el JWT en el encabezado de autorización con el esquema 'portador'
// fromExtractors([array of extractor functions])crea un nuevo extractor utilizando una serie de extractores proporcionados. Cada extractor se intenta en orden hasta que uno devuelve una ficha.
const ExtractJWT = jwt.ExtractJwt;

// extractor de cookies
const cookieExtractor = req=>{
    let token = null;

    if (req && req.cookies) {
        token = req.cookies["jwt-cookie"] //este jwt-cookie es la misma key q esta en el login
    }

    return token;
}

const inicializePassport = () => {
    passport.use("register", new LocalStrategy(
        { passReqToCallback: true, usernameField: "email", session: false },
        async (req, username, password, done) => {
            try {
                const { first_name, last_name, email, age } = req.body;

                if (!first_name || !last_name || !username || !age || !password) {
                    return done(null, false, { message: "valores inclompletos" });
                }

                const user = await User.getUser({ email: username })

                if (user) {
                    req.logger.warn(`El usuario con el email : ${username} ya se encuentra registrado`);

                    return done(null, false, { message: "Usuario ya registrado" });
                }

                const hashPassword = await createHash(password);

                const newUser = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: hashPassword
                }

                const result = await User.saveUser(newUser);

                return done(null, result);

            } catch (error) {
                return done(error);
            }

        }
    ))

    passport.use("login", new LocalStrategy(
        { usernameField: "email", session: false },
        // si te preguntas xq username y password es xq passport necesita los 2 (esto por las estrategias te autenticacion q vimos)
        // si no entuentra alguna de las 2 passport no te va a andar
        async (username, password, done) => {
            try {
                let user = {};

                if (username === options.ADMIN_EMAIL && password === options.ADMIN_PASSWORD) {
                    
                    user = {
                        first_name: "Coder",
                        last_name : "House",
                        age: 10,
                        email: username,
                        password,
                    }

                } else {
                    user = await User.getUser({ email: username });
                }

                if (!user) {
                    req.logger.warn("Usuario no encontrado");

                    return done(null, false, { message: "Usuario no encontrado" });
                }

                if (!isValidPassword(password, user)) {
                    req.logger.warn("Contraseña incorrecta");

                    return done(null, false, { message: "Contraseña invalida" });
                }

                return done(null, user);

            } catch (error) {
                done(error);
            }
        }
    ))

    passport.serializeUser((user, done) => {
        // en el caso de serializar pasamos el id del user
        done(null, user._id);
    })

    passport.deserializeUser(async (id, done) => {
        // en caso deserializar buscamos al usuario en la DB
        let user = await User.getUser({ _id: id });

        done(null, user);
    })

    passport.use("github", new GitHubStrategy(
        {
            clientID: options.CLIENT_ID,
            clientSecret: options.CLIENT_SECRET,
            callbackURL: options.CALLBACK_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // console.log(profile);

                const userName = profile._json.name.split(" ");

                let userEmail = !profile._json.email ? profile.username : profile._json.email;

                const user = await User.getUser({ email: userEmail });

                if (user) {
                    return done(null, user); //FIJATE Q ACA EN DISTINTO A CON REGISTER YA Q SI EXISTE EL USUARIO LOS DEJAS PASAR XQ SE ESTA LOGUEANDO
                }

                const newUser = {
                    first_name: userName[0],
                    last_name: userName[1],
                    email: userEmail,
                    age: 18,
                    password: ""
                }

                const result = await User.saveUser(newUser);

                return done(null, result);

            } catch (error) {
                done(error);
            }
        }
    ))

    passport.use("current", new JWTStrategy(
        { 
            // jwtFromRequest (REQUIRED) Function that accepts a request as the only parameter and returns either the JWT as a string or null.
            // fromExtractors([array of extractor functions])crea un nuevo extractor utilizando una serie de extractores proporcionados. Cada extractor se intenta en orden hasta que uno devuelve una ficha
            jwtFromRequest : ExtractJWT.fromExtractors([cookieExtractor]),
            secretOrKey : "desafio_jwt_secret" //el mismo q ponemos para jwt.sing() --> jwt.sign function takes the payload, secret and options as its arguments
        },
        async (jwt_payload, done) => {
            try {
                // console.log("PASSPORT CONFING PAYLOAD");
                
                // console.log(jwt_payload);
    
                done(null, jwt_payload) //devuelve el web token
            } catch (error) {
                done(error);
            }
        }
    ))
}


export default inicializePassport;