import pool from "../config/database.js";



export const Admin = (req, res) => {
    // requête pour afficher la liste des parties avec leur nom et leur type de jeu par joueur
    let sql = `
    SELECT u.pseudo, g.name, gt.name AS game_type
      FROM user u
     INNER JOIN gameUser gu ON u.id = gu.idUser
     INNER JOIN game g ON gu.idGame = g.id
     INNER JOIN gameType gt ON g.idGameType = gt.id
       ORDER BY u.pseudo ASC;


`;
    pool.query(sql, (error, listGame) => {

        if(error) {
            console.log(error)
            res.status(500).send({

                error : 'La requêtene retourne pas les bons éléments'
            });
            return;
        }

        res.render('layout', { template: 'admin', listGame });
    });
};
