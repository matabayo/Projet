import pool from '../config/database.js';
import bcrypt from 'bcrypt';
import {connexion} from "../config/userSession.js";

// affichage du formulaire de connexion
export const login =  (req, res) => {
    res.render('layout', { template: 'login' });
};


export const loginSubmit = function (req, res) {
    const { login, password } = req.body;
    
    pool.query('SELECT * from user WHERE email = ? OR pseudo = ?', [login, login],  (error, result) => {
        if (error) {
            console.error(error);
            res.status(500).send('Erreur de base de données');
        } 
        else {
            if (result.length < 1) {
                res.redirect('/login');
            } 
            else {
                bcrypt.compare(password, result[0].password, (error, isAllowed) => {
                    if (isAllowed) {
                        connexion(req, result[0]);
                        res.redirect('/user');
                    }
                    else {
                        res.redirect('/home');
                    }
                });
            }
        }
    });
};

export const logout =  (req, res) => {
    req.session.destroy(function (error) {
        if (error) {
            console.error(error);
        }
        
        // Redirection sur page d'accueil
        res.redirect('/');
    });
};
