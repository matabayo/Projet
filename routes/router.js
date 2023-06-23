import express from "express";

const router = express.Router();



//appel des routers

import {listGameType, listGameByType} from "../controllers/homeGameType.js";  //page d'accueil
import {register, registerSubmit} from "../controllers/register.js";
import {login, loginSubmit} from "../controllers/login.js";
import {User, DeleteUser} from "../controllers/user.js";
import {Game, addGame, createGame, DeleteGame} from "../controllers/game.js";
import {logout} from "../controllers/logout.js";
import {Admin} from "../controllers/admin.js";

//liste des routes

// HOME PAGE
router.get('/', listGameType);

// PAGE D'ENREGISTREMENT
router.get('/register', register);

// ENVOI DE L'ENREGISTREMENT
router.post('/register', registerSubmit);

// AFFICHAGE DE LA PAGE CONNEXION
router.get('/login', login);

// ROUTE D'ENVOI DE CONNEXION
router.post('/login', loginSubmit);

// DECONNEXION
router.get('/logout', logout);

// PAGE USER
router.get ('/user', User);

// SUPPRESSION USER
router.delete('/user/:id', DeleteUser);

// AFFICHAGE DES PARTIES SELON LE TYPE DE JEU
router.get('/gameType/:id', listGameByType);

// PAGE DE LA PARTIE
router.get('/game/:id', Game);

// PAGE CREATION DE PARTIE
router.get('/createGame', addGame);

// ENVOI CREATION DE PARTIE
router.post('/createGame', createGame);

// SUPPRESSION PARTIE
router.delete('/game/:id', DeleteGame);

// PAGE ADMIN 
router.get('/admin', Admin);

router.delete('/admin/:id', DeleteUser);
export default router;