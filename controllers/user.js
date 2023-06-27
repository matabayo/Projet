import pool from "../config/database.js";
import { v4 as uuidv4 } from "uuid";
import xss from "xss";
// import {connexion} from "../config/userSession.js";


// fonction affichant les parties du joueur connecté (MJ or player)
export const User = (req, res) => {
    // requête pour afficher le nom des parties associés à un joueur
    let sql = `SELECT name, game.id FROM game INNER JOIN gameUser on gameUser.idGame = game.id WHERE idUser = ?`;
    pool.query(sql, [req.session.userId], (error, games) => {

        if(error) {
            console.log(error)
            res.status(500).send({

                error : 'games is not defined'
            });
            return;
        }

        res.render('layout', { template: 'user', games });
    });
};

export const DeleteUser = (req, res) => {

    let id = req.params.id;
// verification de conformité d'id
    console.log(req.session)
    console.log(id)
    if(!(id === req.session.userId || req.session.role === "admin")) {
        res.status(403).send('Pas autorisé a supprimer les autres comptes')
        return;
    }

// SELECTION DES PARTIES D'UN UTILISATEUR DANS LESQUELLES IL A LE ROLE MJ
    let sql1 = `
    DELETE game
    FROM game
    INNER JOIN gameUser ON game.id = gameUser.idGame
    WHERE gameUser.idUser = ? AND gameUser.role = 'MJ'`

    pool.query(sql1, [id], function(error, result) {
        if (error) {
            console.log(error)
            res.status(500).send({
                error: 'Error when delete game to user deleted'
            });
        }
        else {
            let sql2 = `
            DELETE FROM user WHERE id = ?`;
            pool.query(sql2, [id], function(error, result) {
                if(error) {
                    console.log(error)
                    res.status(500).send ({
                        error : 'Error when delete user'
                    });
                    
                }
                res.status(204).send();
            })
        }
    })
};
