const db = require('../config/db');
const bcrypt = require('bcrypt');

class User {
  static async create(username, password, first_name, last_name, email, role = 'user') {
    const hashedPassword = await bcrypt.hash(password, 10);
    const queryText = 'INSERT INTO users(username, password, first_name, last_name, email, role) VALUES($1, $2, $3, $4, $5, $6) RETURNING *';
    return db.query(queryText, [username, hashedPassword, first_name, last_name, email, role]);
  }

  static async validatePassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  }

  static async getAll() {
    const queryText = 'SELECT * FROM posts';
    const result = await db.query(queryText);
    return result.rows;
  }

  static async getById(id) {
    const queryText = 'SELECT * FROM posts WHERE id = $1';
    const result = await db.query(queryText, [id]);
    return result.rows[0];
  }

  static async getByUsername(username) {
    const queryText = 'SELECT * FROM users WHERE username = $1';
    const result = await db.query(queryText, [username]);
    return result.rows[0];
  }

  static update(id, username, password, first_name, last_name, email, role) {
    const queryText = 'UPDATE users SET username = $1, password = $2, first_name = $3, last_name = $4, email = $5, role = $6 WHERE id = $7 RETURNING *';
    return db.query(queryText, [username, password, first_name, last_name, email, role, id]);
  }

  static delete(id) {
    const queryText = 'DELETE FROM users WHERE id = $1 RETURNING *';
    return db.query(queryText, [id]);
  }
}

module.exports = User;