import express from "express";

const router = express.Router();



//appel des routers

import HomeController from "../controllers/home.js";  //page d'accueil
import {register, registerSubmit} from "../controllers/register.js";
import {login, loginSubmit} from "../controllers/login.js";
import {User} from "../controllers/user.js";
import {Game} from "../controllers/game.js";

//liste des routes

//HOME PAGE
router.get('/', HomeController);
// PAGE D'ENREGISTREMENT
router.get('/register', register);
router.post('/register', registerSubmit);
router.get('/login', login);
router.post('/login', loginSubmit);
router.get ('/user', User);
router.get('/game', Game);

export default router;