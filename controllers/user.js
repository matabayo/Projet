import pool from "../config/database.js";
import { v4 as uuidv4 } from "uuid";
import xss from "xss";

export const User = (req, res) => {
    let sql = 'SELECT name FROM game INNER JOIN gameUser on gameUser.idGame = game.id INNER JOIN user on user.id = gameUser.idUser';
    pool.query(sql, (error, posts, fields) => {

        res.render('layout', { template: 'user', posts: posts });
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

        // Récupérer l'ID de la partie insérée
        const gameId = newGame.id;
        const gameUserId = uuidv4();

        // Insérer l'association entre l'utilisateur et la partie en tant que MJ dans la table "gameUser"
        const insertGameUser = 'INSERT INTO gameUser (idGame, idUser, id) VALUES (?, ?, ?)';
        pool.query(insertGameUser, [gameId, req.session.userId, gameUserId], (error, result) => {
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
