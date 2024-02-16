import { Router } from 'express';
import passport from 'passport';

import {SessionControler} from '../controlador/sessions.controllers.js'

const router = Router();

router.post("/register", passport.authenticate("register", { passReqToCallback: true, failureRedirect: "/api/sessions/failregister", session: false }), SessionControler.register)

router.get('/failregister', SessionControler.failregister)

router.post("/login", passport.authenticate("login", { failureRedirect: "/api/sessions/faillogin", session: false }), SessionControler.login)

router.get('/faillogin', SessionControler.faillogin)

router.get("/github", passport.authenticate("github", { scope: ["user:email"], session: false }));

router.get("/githubcallback", passport.authenticate("github", { failureRedirect: "/", session: false }), SessionControler.githubcallback)

router.get('/logout', SessionControler.logout)

router.get("/current", passport.authenticate("current", { session: false, failureRedirect: "/api/sessions/failcurret" }), SessionControler.current)

router.get('/failcurret', SessionControler.failcurret)


export default router;