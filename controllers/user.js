import pool from "../config/database.js";
import { v4 as uuidv4 } from "uuid";
import xss from "xss";
// import {connexion} from "../config/userSession.js";

export const User = (req, res) => {
    let sql = 'SELECT name FROM game INNER JOIN gameUser on gameUser.idGame = game.id WHERE idUser = ?' ;
    pool.query(sql, [req.session.userId], (error, posts, fields) => {

        res.render('layout', { template: 'user', posts : posts });
    });
};

// 
export const addGame = (req, res) => {
    let sql2 = 'SELECT * FROM gameType';
    pool.query(sql2, (error, types) => {
        
        res.render('layout', {template : 'createGame', types : types});
    });
};

export const createGame = (req, res) => {
    const MASTER_GAME = "MJ";
    // Vérifier si l'utilisateur est connecté et a un ID valide
    if (!req.session.userId) {
        res.status(401).send({ error : 'Utilisateur non authentifié.' });
        return;
    }
    
    
    const {name, gameType} = req.body;
    const safeName = xss(name);
    
    // Effectuer la requête pour créer la partie et associer l'utilisateur en tant que MJ
    const newGame = {
        id: uuidv4(),
        name: safeName,
        idGameType : gameType
    };

    // Insérer les données de la nouvelle partie dans la table "game"
    const insertGame = 'INSERT INTO game (id, name, idGameType) VALUES (?, ?, ?)';
    pool.query(insertGame, [newGame.id, newGame.name,newGame.idGameType], (error, result) => {
        if (error) {
            console.error('Erreur lors de la création de la partie :', error);
            res.status(500).send({ error: 'Erreur lors de la création de la partie.' });
            return;
        }

        // Récupérer l'ID de la partie insérée et de l'id utilisateur
        const gameId = newGame.id;
        const gameUserId = uuidv4();
        const userId = req.session.userId;


        // Insérer l'association entre l'utilisateur et la partie en tant que MJ dans la table "gameUser"
        const insertGameUser = 'INSERT INTO gameUser (idGame, idUser, id, role) VALUES (?, ?, ?, ?)';
        pool.query(insertGameUser, [gameId, userId, gameUserId, MASTER_GAME], (error, result) => {
            if (error) {
                console.error('Erreur lors de l\'association de l\'utilisateur à la partie :', error);
                res.status(500).send({ error: 'Erreur lors de l\'association de l\'utilisateur à la partie.' });
                return;
            }
// TODO PENSEZ A REDIRIGER VERS LA PAGE GAME
                res.redirect('/user');
        });
    });
};

// TODO DELETE A FAIRE

export const DeleteUser = (req, res) => 
{

    //on récupère l'id de l'article à supprimer, il a été passé en paramètre de l'url
    let id = req.session.userId;

    // requete de suppresion en BDD
    let sql1 = "DELETE FROM user WHERE id = ? ";
    let sql2 = 'DELETE FROM articles WHERE id = ?';

    // pool.query(sql1, [id], function (error, result, fields) 
    // {
    //     if(error) {console.log("error requête 1");}

        pool.query(sql2, [id], function (error, result) {
	    if (error) {
	        console.log(error)
	        res.status(500).send({
	            error: 'Error when delete user'
	        });
	    } else {
	        res.status(204).send();
        }

    });
};
