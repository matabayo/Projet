import pool from "../config/database.js"; // importation pour la connexion à la base de données
import {v4 as uuidv4} from 'uuid'; // module npm pour la génération d'uuid
import xss from 'xss'; // module npm pour la protection contre les failles XSS
import bcrypt from "bcrypt"; // module npm pour crypter les mots de passe
import {connexion} from "../config/userSession.js";


export const Game = (req,res) => {
    res.render('layout', {template: 'game'});
};


// fonction d'appel du template createGame
export const addGame = (req, res) => {
    let sql2 = 'SELECT * FROM gameType';
    pool.query(sql2, (error, types) => {
        if(error) {
            console.error('Erreur lors de la création de la partie :', error);
            res.status(500).send({ error: 'Erreur lors de la création de la partie.' });
        }

        res.render('layout', { template: 'createGame', types : types });
    });
};

// fonction de création de partie 
export const createGame = (req, res) => {

    // initialisation du joueur créant la partie au rôle de MJ
    const MASTER_GAME = "MJ";

    // Vérifier si l'utilisateur est connecté et a un ID valide
    if (!req.session.userId) {
        res.status(401).send({ error: 'Utilisateur non authentifié.' });
        return;
    }

    // objet récupérant le nom renseigné ainsi que le jeu
    const { name, gameType } = req.body;

    // protection du nom de la partie
    const safeName = xss(name);

    // Effectuer la requête pour créer la partie et associer l'utilisateur en tant que MJ
    const newGame = {
        id: uuidv4(),
        name: safeName,
        idGameType: gameType
    };

    // Insérer les données de la nouvelle partie dans la table "game"
    const insertGame = 'INSERT INTO game (id, name, idGameType) VALUES (?, ?, ?)';
    pool.query(insertGame, [newGame.id, newGame.name, newGame.idGameType], (error, result) => {
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

// TODO LATER MODIFICATION PROFIL


// TODO DELETE A FAIRE



export const DeleteGame = (req,res) => {
    let id2 = req.session.userId;
    let idGame = req.params.id;
    let sql3 = `
    DELETE game
    FROM game
    INNER JOIN gameUser ON game.id = gameUser.idGame
    WHERE game.id = ? AND gameUser.idUser = ? AND gameUser.role = 'MJ'`

    pool.query(sql3,[idGame, id2], (error,result) => {
        if (error) {
            console.log(error)
            res.status(500).send ({
                error : 'Error when delete game to user'
            });
            return;
        }
        res.status(204).send();

    })
}