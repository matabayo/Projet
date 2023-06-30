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


// MIDDLEWARE DE CONTROLE D'ACCES

const adminMiddleware = (roles) => (req, res, next) => {
    if(roles.includes(req.session.role)) {
        next();
    }
    else {
        res.redirect('/');
    }
}

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
router.get ('/user/:id',adminMiddleware(['admin', 'player']), User);

// SUPPRESSION USER
router.delete('/user/:id',adminMiddleware(['admin', 'player']), DeleteUser);

// AFFICHAGE DES PARTIES SELON LE TYPE DE JEU
router.get('/gameType/:id',adminMiddleware(['admin', 'player']), listGameByType);

// PAGE DE LA PARTIE
router.get('/game/:id',adminMiddleware(['admin', 'player']), Game);

// PAGE CREATION DE PARTIE
router.get('/createGame',adminMiddleware(['admin', 'player']), addGame);

// ENVOI CREATION DE PARTIE
router.post('/createGame',adminMiddleware(['admin', 'player']), createGame);

// SUPPRESSION PARTIE
router.delete('/game/:id',adminMiddleware(['admin', 'player']), DeleteGame);

// PAGE ADMIN 
router.get('/admin',adminMiddleware(['admin']), Admin);

// SUPPRESSION DE JOUEURS PAR L'ADMIN
router.delete('/admin/:id',adminMiddleware(['admin']), DeleteUser);

router.all("/*", (req,res) =>{res.status(404).render('NOT_FOUND')})

export default router;