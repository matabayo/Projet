import express from "express";

const router = express.Router();



//appel des routers

import HomeController from "../controllers/home.js";  //page d'accueil


//liste des routes

//HOME PAGE
router.get('/', HomeController);



export default router;