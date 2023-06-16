import pool from "../config/database.js";

export const Game = (req,res) => {
    res.render('layout', {template: 'game'});
};

