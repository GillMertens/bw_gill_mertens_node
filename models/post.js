// models/post.js
const db = require('../config/db');

class Post {
  static create(title, content) {
    const queryText = 'INSERT INTO posts(title, content) VALUES($1, $2) RETURNING *';
    return db.query(queryText, [title, content]);
  }

  static getAll() {
    const queryText = 'SELECT * FROM posts';
    return db.query(queryText);
  }

  static getById(id) {
    const queryText = 'SELECT * FROM posts WHERE id = $1';
    return db.query(queryText, [id]);
  }

  static update(id, title, content) {
    const queryText = 'UPDATE posts SET title = $1, content = $2 WHERE id = $3 RETURNING *';
    return db.query(queryText, [title, content, id]);
  }

  static delete(id) {
    const queryText = 'DELETE FROM posts WHERE id = $1 RETURNING *';
    return db.query(queryText, [id]);
  }
}

module.exports = Post;