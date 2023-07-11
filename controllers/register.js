// importation des modules nécessaires

// importation pour la connexion à la base de données
import pool from "../config/database.js";

// module npm pour la génération d'uuid
import {v4 as uuidv4} from 'uuid';

// module npm pour la protection contre les failles XSS
import xss from 'xss';

// module npm pour crypter les mots de passe
import bcrypt from "bcrypt"; 

// importation du middleware connexion pour gérer les connexions des utilisateurs
import {connexion} from "../config/userSession.js";

// fin d'importation des modules

export const register = (req, res) => {
    
    // appel de la page register avec l'appel de errorMessage vide
    res.render('layout', {template: 'register', errorMessage:""});
};

export const registerSubmit =  (req, res) => {

    // recuperation des données du formulaire dans req.body
    const {pseudo, email, password, confirmPassword} = req.body;

    // regex pour l'email (format valide) et pour le pseudo (pas de caractères spéciaux)
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,3}$/;
    const inputRegex = /^[a-zA-Z0-9\s]+$/;

    // protection contre les failles XSS (cross-site scripting)
    const safePseudo = xss(pseudo);
    const safeEmail = xss(email);
    const safePassword = xss(password);
    const safeConfirmPassword = xss(confirmPassword);

    // vérification des données du formulaire si les données ne sont pas valides, on renvoie un message d'erreur
    if (!emailRegex.test(safeEmail)) {
        return res.status(400).send('L\'e-mail n\'est pas valide');
    }
    if (safePseudo.length < 3 || !inputRegex.test(safePseudo)) {
        return res.status(400).send('Le pseudo doit contenir au moins 3 caractères et ne doit pas contenir de caractères spéciaux');
    }
    if (safePassword.length < 8) {
        return res.status(400).send('Le mot de passe doit contenir au moins 8 caractères');
    }
    if (safeConfirmPassword !== safePassword ) {
        return res.status(400).send('Mot de passe non identique');
    }

    // vérification en bdd que le pseudo ou l'email ne sont pas déjà utilisé
    pool.query('SELECT * FROM user WHERE email = ? OR pseudo = ?', [safeEmail, safePseudo], (error, result) => {
        if (error) {
            console.error(error);
            return res.status(500).send('Erreur de base de données');
        }

        if (result.length > 0) {
            
            let errorMessage ='';
            if (result[0].email === safeEmail) {
                errorMessage = 'L\'adresse e-mail est déjà utilisée';
              } 
            else if (result[0].pseudo === safePseudo) {
                errorMessage = 'Le pseudo est déjà utilisé';
            }
                    
        // Si une correspondance est trouvée, cela signifie que l'e-mail ou le pseudo est déjà utilisé
        //  return res.status(400).send('L\'adresse e-mail ou le pseudo est déjà utilisé');
         res.render('layout',  {template : 'register', errorMessage : errorMessage});
        }
        
        else {
            
    
                // cryptage du mot de passe avec bcrypt
                bcrypt.hash(safePassword, 10, function (error, hash) {
                    if (error) {
                        console.log(error);
                    } else {
            
                        /* recuperation des données du formulaire dans un objet newUsers composé par id pseudo email password*/
                        const newUsers = {
                            id: uuidv4(), // on génère un id unique avec uuid
                            pseudo: safePseudo,
                            email: safeEmail,
                            password: hash, // le mot de passe crypté
                            role: "player" // par défaut, le role est "player"
                        };
            
                        // requète SQL pour insérer les données du formulaire dans la table users
                        let query = "INSERT INTO user SET ?";
            
                        // execution de la requète SQL avec les données de l'objet newUsers
                        pool.query(query, [newUsers], function (error, result) {
                            if (error) {
                                console.error(error);
                                res.status(500).send('Erreur de base de données');
                            } else {
            
                                // si l'inscription est réussie, on redirige vers la page d'accueil et on connecte l'utilisateur
                                connexion(req, newUsers); // on stocke l'id de l'utilisateur dans la session
                                res.redirect(`/user`);
                            }
                        });
                    }
                });
            }
         });
    };
 
