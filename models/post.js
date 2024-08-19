const db = require('../config/db');

class Post {
  static create(user_id, title, content) {
    const queryText = 'INSERT INTO posts(user_id, title, content) VALUES($1, $2, $3) RETURNING *';
    return db.query(queryText, [user_id, title, content]);
  }

  static async getAll() {
    const queryText = 'SELECT * FROM posts';
    const result = await db.query(queryText);
    return result.rows; // return all posts
  }

  static async getById(id) {
    const queryText = 'SELECT * FROM posts WHERE id = $1';
    const result = await db.query(queryText, [id]);
    return result.rows[0]; // return the post data
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