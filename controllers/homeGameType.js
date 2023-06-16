import pool from "../config/database.js";

export const listGameType = (req, res) => {
    let sql = 'SELECT * FROM gameType';
    pool.query(sql, (error, lists) =>{
        res.render('home', {lists : lists});
    });
};

export const listGameByType = (req, res) => {
    let idGameType = req.params.id;
    let sql2 = 'SELECT id, name FROM game WHERE idGameType = ?';
    pool.query(sql2, [idGameType], (error, games) =>{
        res.render('layout', {template : 'gameType', games : games});
    });
};