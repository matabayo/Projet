import pool from "../config/database.js";



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