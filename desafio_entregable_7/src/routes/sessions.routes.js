import { Router } from 'express';
import passport from 'passport';

import {SessionControler} from '../controlador/sessions.controllers.js'

const router = Router();

router.post("/register", passport.authenticate("register", { passReqToCallback: true, failureRedirect: "/api/sessions/failregister", session: false }), SessionControler.register)

router.get('/failregister', SessionControler.failregister)

router.post("/login", passport.authenticate("login", { failureRedirect: "/api/sessions/faillogin", session: false }), SessionControler.login)

router.get('/faillogin', SessionControler.faillogin)

// 17- creamos la ruta para loguearse con github
//DATO: https://docs.github.com/es/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps#scopes --> aca esta de donde sale el scope
// router.get("/github", passport...., async (req, res) => { }); fijate q aca no tiene sentido q declares una callback (req,res) => {} ya q esta vacio
router.get("/github", passport.authenticate("github", { scope: ["user:email"], session: false }));

router.get("/githubcallback", passport.authenticate("github", { failureRedirect: "/", session: false }), SessionControler.githubcallback)

// ruta q se encarga de destruir la cookie y redirigir al login
router.get('/logout', SessionControler.logout)

// ruta la cual utilizará el modelo de sesión que estés utilizando, para poder devolver en una respuesta el usuario actual
router.get("/current", passport.authenticate("current", { session: false, failureRedirect: "/api/sessions/failcurret" }), SessionControler.current)

router.get('/failcurret', SessionControler.failcurret)


export default router;