// importation des modules nécessaires

// importation pour la connexion à la base de données
import pool from '../config/database.js';

// module npm pour la génération d'uuid
import bcrypt from 'bcrypt';

// importation du middleware connexion pour gérer les connexions des utilisateurs
import {connexion} from "../config/userSession.js";

// fin d'importation des modules

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
                        if (result[0].role === 'admin') {
                          res.redirect('/admin');
                        } else {
                          res.redirect(`/user/${result[0].id}`);
                        }
                      } else {
                        res.redirect('/');
                      }
                });
            }
        }
    });
};
