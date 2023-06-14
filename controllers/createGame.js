import pool from "../config/database.js";
import { v4 as uuidv4} from "uuid";
import xss from "xss";

export const createGame = (req, res) => {
    // Vérifier si l'utilisateur est connecté et a un ID valide
    if (!req.user || !req.user.id) {
      res.status(401).json({ error: 'Utilisateur non authentifié.' });
      return;
    }
  
    const { name } = req.body;
    const safeName = xss(name);
  
    // Récupérer l'ID de l'utilisateur actuel
    const userId = req.user.id;
  
    // Effectuer la requête pour créer la partie et associer l'utilisateur en tant que MJ
    const newGame = {
      id: uuidv4(),
      name: safeName
    };
  
    // Insérer les données de la nouvelle partie dans la table "game"
    const insertGameQuery = 'INSERT INTO game (id, name) VALUES (?, ?)';
    pool.query(insertGameQuery, [newGame.id, newGame.name], (error, result) => {
      if (error) {
        console.error('Erreur lors de la création de la partie :', error);
        res.status(500).json({ error: 'Erreur lors de la création de la partie.' });
        return;
      }
  
      // Insérer l'association entre l'utilisateur et la partie en tant que MJ dans la table "gameUser"
      const insertGameUserQuery = 'INSERT INTO gameUser (idGame, idUser, role) VALUES (?, ?, ?)';
      pool.query(insertGameUserQuery, [newGame.id, userId, 'MJ'], (error, result) => {
        if (error) {
          console.error('Erreur lors de l\'association de l\'utilisateur à la partie :', error);
          res.status(500).json({ error: 'Erreur lors de l\'association de l\'utilisateur à la partie.' });
          return;
        }
  
        // Mettre à jour le rôle de l'utilisateur dans la table "user" pour cette partie
        const updateUserRoleQuery = 'UPDATE user SET role = ? WHERE id = ?';
        pool.query(updateUserRoleQuery, ['MJ', userId], (error, result) => {
          if (error) {
            console.error('Erreur lors de la mise à jour du rôle de l\'utilisateur :', error);
            res.status(500).json({ error: 'Erreur lors de la mise à jour du rôle de l\'utilisateur.' });
            return;
          }
  
          res.render('layout', { template: 'createGame' });
        });
      });
    });
  };

  export const createGame2 = (req, res) => {
    // Vérifier si l'utilisateur est connecté et a un ID valide
    if (!req.user || !req.user.id) {
      res.status(401).json({ error: 'Utilisateur non authentifié.' });
      return;
    }
  
    const { name } = req.body;
    const safeName = xss(name);
  
    // Récupérer l'ID de l'utilisateur actuel
    const userId = req.user.id;
  
    // Effectuer la requête pour créer la partie et associer l'utilisateur en tant que MJ
    const newGame = {
      id: uuidv4(),
      name: safeName
    };
  
    // Insérer les données de la nouvelle partie dans la table "game"
    const insertGameQuery = 'INSERT INTO game (id, name) VALUES (?, ?)';
    pool.query(insertGameQuery, [newGame.id, newGame.name], (error, result) => {
      if (error) {
        console.error('Erreur lors de la création de la partie :', error);
        res.status(500).json({ error: 'Erreur lors de la création de la partie.' });
        return;
      }
  
      // Insérer l'association entre l'utilisateur et la partie en tant que MJ dans la table "gameUser"
      const insertGameUserQuery = 'INSERT INTO gameUser (idGame, idUser, role) VALUES (?, ?, ?)';
      pool.query(insertGameUserQuery, [newGame.id, userId, 'MJ'], (error, result) => {
        if (error) {
          console.error('Erreur lors de l\'association de l\'utilisateur à la partie :', error);
          res.status(500).json({ error: 'Erreur lors de l\'association de l\'utilisateur à la partie.' });
          return;
        }
  
        res.render('layout', { template: 'createGame' });
      });
    });
  };
  
  export const createGame3 = (req, res) => {
    // Vérifier si l'utilisateur est connecté et a un ID valide
    if (!req.user || !req.user.id) {
      res.status(401).json({ error: 'Utilisateur non authentifié.' });
      return;
    }
  
    const { name, gameType } = req.body;
    const safeName = xss(name);
  
    // Récupérer l'ID de l'utilisateur actuel
    const userId = req.user.id;
  
    // Effectuer la requête pour créer la partie et associer l'utilisateur en tant que MJ
    const newGame = {
      id: uuidv4(),
      name: safeName
    };
  
    // Insérer les données de la nouvelle partie dans la table "game"
    const insertGameQuery = 'INSERT INTO game (id, name) VALUES (?, ?)';
    pool.query(insertGameQuery, [newGame.id, newGame.name], (error, result) => {
      if (error) {
        console.error('Erreur lors de la création de la partie :', error);
        res.status(500).json({ error: 'Erreur lors de la création de la partie.' });
        return;
      }
  
      // Récupérer l'ID de la partie insérée
      const gameId = result.insertId;
  
      // Insérer l'association entre l'utilisateur et la partie en tant que MJ dans la table "gameUser"
      const insertGameUserQuery = 'INSERT INTO gameUser (idGame, idUser, role) VALUES (?, ?, ?)';
      pool.query(insertGameUserQuery, [gameId, userId, 'MJ'], (error, result) => {
        if (error) {
          console.error('Erreur lors de l\'association de l\'utilisateur à la partie :', error);
          res.status(500).json({ error: 'Erreur lors de l\'association de l\'utilisateur à la partie.' });
          return;
        }
  
        // Insérer l'association entre le type de partie et l'ID de la partie dans la table "gameTypeMapping"
        const insertGameTypeMappingQuery = 'INSERT INTO gameTypeMapping (gameId, typeId) VALUES (?, ?)';
        pool.query(insertGameTypeMappingQuery, [gameId, gameType], (error, result) => {
          if (error) {
            console.error('Erreur lors de l\'association du type de partie à la partie :', error);
            res.status(500).json({ error: 'Erreur lors de l\'association du type de partie à la partie.' });
            return;
          }
  
          res.render('layout', { template: 'createGame' });
        });
      });
    });
  };
  