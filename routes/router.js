import express from "express";

const router = express.Router();



//appel des routers

import HomeController from "../controllers/home.js";  //page d'accueil
import {register, registerSubmit} from "../controllers/register.js";
import {login, loginSubmit, logout} from "../controllers/login.js";
import {User,addGame, createGame} from "../controllers/user.js";
import {Game} from "../controllers/game.js";

//liste des routes

//HOME PAGE
router.get('/', HomeController);

// PAGE D'ENREGISTREMENT
router.get('/register', register);

// ENVOIE DE L'ENREGISTREMENT
router.post('/register', registerSubmit);

// AFFICHAGE DE LA PAGE CONNEXION
router.get('/login', login);

// ROUTE D'ENVOI DE CONNEXION
router.post('/login', loginSubmit);

// DECONNEXION
router.get('/login', logout);

// PAGE USER
router.get ('/user', User);

// PAGE DE LA PARTIE
router.get('/game', Game);

router.get('/createGame', addGame);
// ENVOI CREATION DE PARTIE
router.post('/createGame', createGame);

export default router;