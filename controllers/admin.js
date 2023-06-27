import pool from "../config/database.js";



export const Admin = (req, res) => {
    // requête pour afficher la liste des parties avec leur nom et leur type de jeu par joueur
    let sql = `
    SELECT pseudo, id AS userId
    FROM user
    ORDER BY pseudo ASC;
`;
    pool.query(sql, async (error, listPlayer) => {

        if(error) {
            console.log(error)
            res.status(500).send({

                error : 'La requête ne retourne pas les bons éléments'
            });
            return;
        }

        let sqlListGame = `
            SELECT game.id AS idGame, game.name AS nameGame, gameType.name AS typeName
              FROM game
             INNER JOIN gameUser ON gameUser.idGame = game.id
             INNER JOIN gameType ON gameType.id = game.idGameType
             WHERE idUser = ?;`

        const listPlayerGamesPromises = listPlayer.map(function(player) {
            return new Promise((resolve, reject) => {
                pool.query(sqlListGame,[player.userId], (error, listGame) => {
                    
                    if(error) {
                        reject(error)
                    }
                    resolve(listGame);
                })
            })
        })
        
        try{
            const listGames = await Promise.all(listPlayerGamesPromises);
            res.render('layout', { template: 'admin', listPlayer, listGames});
        }
        catch(error) {
            console.log(error)
            res.status(500).send({
                error : 'La requête pour afficher les parties n\'est pas bonne'
            })
        }
    
        
    });
};


  
 