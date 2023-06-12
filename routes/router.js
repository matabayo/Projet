import express from "express";

const router = express.Router();



//appel des routers

import HomeController from "../controllers/home.js";  //page d'accueil
import {register, registerSubmit} from "../controllers/register.js";

//liste des routes

//HOME PAGE
router.get('/', HomeController);
router.get('/register', register);
// router.post('/register', RegisterSubmit);


export default router;