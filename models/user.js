const db = require('../config/db');
const bcrypt = require('bcrypt');

class User {
  static async create(username, password, first_name, last_name, email, role = 'user') {
    if (!this.isValidEmail(email)) {
      throw new Error('Invalid email format');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const queryText = 'INSERT INTO users(username, password, first_name, last_name, email, role) VALUES($1, $2, $3, $4, $5, $6) RETURNING *';
    return db.query(queryText, [username, hashedPassword, first_name, last_name, email, role]);
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

  static update(id, username, first_name, last_name, email) {
    if (!this.isValidEmail(email)) {
      throw new Error('Invalid email format');
    }
    const queryText = 'UPDATE users SET username = $1, first_name = $2, last_name = $3, email = $4 WHERE id = $5 RETURNING *';
    return db.query(queryText, [username, first_name, last_name, email, id]);
  }

  static delete(id) {
    const queryText = 'DELETE FROM users WHERE id = $1 RETURNING *';
    return db.query(queryText, [id]);
  }

  static async validatePassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  }

  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

module.exports = User;