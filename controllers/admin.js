import pool from "../config/database.js";


// function pour afficher les joueurs avec la liste de leur partie par ordre alphabétique des pseudos
export const Admin = (req, res) => {
    // requête pour afficher les joueurs par pseudos
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

        // requête pour faire la liste des parties selon le joueur  
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
        
        // exécute la fonction listPlayerGamesPromises pour chaque joueur, le try sert à stopper l'exécution lors d'une erreur
        try{
            const listGames = await Promise.all(listPlayerGamesPromises);
            res.render('layout', { template: 'admin', listPlayer, listGames});
        }
        // le catch intervient lorsqu'il y a une erreur lors du try pour l'afficher dans la console et renvoyer une erreur au client
        catch(error) {
            console.log(error)
            res.status(500).send({
                error : 'La requête pour afficher les parties n\'est pas bonne'
            })
        }
    
        
    });
};


  
 