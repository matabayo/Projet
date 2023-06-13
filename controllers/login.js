import pool from "../config/database.js";
import { v4 as uuidv4} from "uuid";
import bcrypt from "bcrypt";
import userSessionManagement from "../config/userSessionManagement.js";

export const Login = (req,res) => {
    res.render ('layout', {template: 'login_form'});
};

// vérification des données pour le login
export const loginSubmit = (req,res) => {
    // récupération des valeurs des inputs
    const {login, password} = req.body;

    // vérification que l'email est dans la base de données
    pool.query('SELECT * From user WHERE email = ? OR pseudo = ?', [login, login], function (error, result) {
    
        // si l'email n'est pas dans la base de données alors on renvoit une erreur 500 avec le message suivant 'erreur de base de données'
        if(error) {
            console.log(error);
            res.status(500).send('erreur de base de données');
        }        
        else {
            // autrement si il y a plus d'une correspondance on renvoit vers la page login
            if(result.length < 1) {
                res.redirect ('/login');
            }
            // autrement si tout est bon on vérifie que le password correspond parfaitement
            else{
                bcrypt.compare(password, result[0].password, function(error, isAllowed) {
                    // si il correspond alors on connecte l'utilisateur et on renvoit sur la page home
                    if(isAllowed) {
                        userSessionManagement(req);
                        res.redirect('/home');
                    }
                });
            }
        }
    });
};


export const Logout =(req,res) => {
    req.session.destroy(function(error) {
        if(error){
            console.log(error);
        }
        res.redirect('/');
    });
};