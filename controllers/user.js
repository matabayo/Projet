import pool from "../config/database.js";
import { v4 as uuidv4 } from "uuid";

export const User = (req, res) => {
    let sql = 'SELECT name FROM game INNER JOIN gameUser on gameUser.idGame = game.id INNER JOIN user on user.id = gameUser.idUser';
    pool.query(sql, (error, posts, fields) => {

        res.render('layout', { template: 'user', posts: posts });
    });
};

export const createGame = (req,res) => {
    res.render ('layout', {template : 'createGame'})
}