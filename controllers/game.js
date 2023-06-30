import pool from "../config/database.js"; // importation pour la connexion à la base de données
import {v4 as uuidv4} from 'uuid'; // module npm pour la génération d'uuid
import xss from 'xss'; // module npm pour la protection contre les failles XSS
import bcrypt from "bcrypt"; // module npm pour crypter les mots de passe
import url from "url";
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
            // Générer l'URL complète de la partie en utilisant l'ID généré
            const baseUrl = req.protocol + '://' + req.get('host'); // Récupérer la base de l'URL
            const gameUrl = url.resolve(baseUrl, `/game/${gameId}`);

            // TODO PENSEZ A REDIRIGER VERS LA PAGE GAME
            res.redirect(`/user/${userId}`);
        });
    });
};

// TODO LATER MODIFICATION PROFIL

// fonction de suppression de partie si l'utilisateur en est le MJ
export const DeleteGame = (req,res) => {
    let id2 = req.session.userId;
    let idGame = req.params.id;
    let role = req.session.role;

    // Si le rôle est admin il peut supprimer la partie
    if(role === 'admin') { 

        let sqlAdmin = `
        DELETE game
        FROM game
        WHERE game.id = ?`

        pool.query(sqlAdmin, [idGame, role], (error, result)=> {
            if(error) {
                console.log(error)
                res.status(500).send({
                    error : 'You are not an admin !'
                });
                return;
            }
            res.status(204).send();
        })

        // autrement on vérifie si l'utilisateur connecté a bien le rôle MJ pour la partie, si oui il peut supprimer sinon il reçoit un message d'erreur
    } else {

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
}

