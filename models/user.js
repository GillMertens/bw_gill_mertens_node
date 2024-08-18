// models/user.js
const db = require('../config/db');

class User {
  static create(username, password) {
    const queryText = 'INSERT INTO users(username, password) VALUES($1, $2) RETURNING *';
    return db.query(queryText, [username, password]);
  }

  static getAll() {
    const queryText = 'SELECT * FROM users';
    return db.query(queryText);
  }

  static getById(id) {
    const queryText = 'SELECT * FROM users WHERE id = $1';
    return db.query(queryText, [id]);
  }

  static update(id, username, password) {
    const queryText = 'UPDATE users SET username = $1, password = $2 WHERE id = $3 RETURNING *';
    return db.query(queryText, [username, password, id]);
  }

  static delete(id) {
    const queryText = 'DELETE FROM users WHERE id = $1 RETURNING *';
    return db.query(queryText, [id]);
  }
}

module.exports = User;