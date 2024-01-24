import passport from 'passport';
import local from 'passport-local';
import GitHubStrategy from 'passport-github2';

import userModel from '../dao/models/userModel.js';
import { createHash, isValidPassword } from '../utils.js';
import Users from '../dao/manager/userManager.js';

const userManager = new Users;

const LocalStrategy = local.Strategy;

const inicializePassport = () => {
    passport.use("register", new LocalStrategy(
        { passReqToCallback: true, usernameField: "email", session: false },
        async (req, username, password, done) => {
            try {
                const { first_name, last_name, email, age } = req.body;

                if (!first_name || !last_name || !username || !age || !password) {
                    return done(null, false, { message: "valores inclompletos" });
                }

                const user = await userManager.getUser({ email: username })
                // const user2 = await userModel.findOne({ email: username }).lean().populate("carts");

                if (user) {
                    console.log(`El usuario con el email : ${username} ya se encuentra registrado`);

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

                const result = await userManager.saveUser(newUser);
                // const result = await userModel.create(newUser);

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
                const user = await userManager.getUser({ email: username });
                console.log("user info passport config");
                console.log(user);
                console.log(" ");
                console.log(" ");
                console.log(" ");
                // const user = await userModel.findOne({ email: username }).lean().populate("carts");

                if (!user) {
                    return done(null, false, { message: "Usuario no encontrado" });
                }

                if (!isValidPassword(password, user)) {
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
        let user = await userManager.getUser({ _id: id });

        done(null, user);
    })

    // 16- github token
    passport.use("github", new GitHubStrategy(
        {
            clientID: "Iv1.353d92dfec58dbfd",
            clientSecret: "8d45985ce161d455cd42631c71b687870634579f",
            callbackURL: "http://localhost:8080/api/sessions/githubcallback"
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                console.log(profile);

                const userName = profile._json.name.split(" ");

                let userEmail = !profile._json.email ? profile.username : profile._json.email;

                const user = await userManager.getUser({ email: userEmail });

                if (user) {
                    // console.log(`Usuario ya registrado con el mail: ${userEmail}`);

                    return done(null, user); //FIJATE Q ACA EN DISTINTO A CON REGISTER YA Q SI EXISTE EL USUARIO LOS DEJAS PASAR XQ SE ESTA LOGUEANDO
                }

                const newUser = {
                    first_name: userName[0],
                    last_name: userName[1],
                    email: userEmail,
                    age: 18,
                    password: ""
                }

                const result = await userManager.saveUser(newUser);

                return done(null, result);

            } catch (error) {
                done(error);
            }
        }
    ))
}


export default inicializePassport;