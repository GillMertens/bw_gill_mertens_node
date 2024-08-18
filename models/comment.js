const db = require('../config/db');

class Comment {
  static create(postId, content) {
    const queryText = 'INSERT INTO comments(post_id, content) VALUES($1, $2) RETURNING *';
    return db.query(queryText, [postId, content]);
  }

  static getAll() {
    const queryText = 'SELECT * FROM comments';
    return db.query(queryText);
  }

  static getById(id) {
    const queryText = 'SELECT * FROM comments WHERE id = $1';
    return db.query(queryText, [id]);
  }

  static update(id, content) {
    const queryText = 'UPDATE comments SET content = $1 WHERE id = $2 RETURNING *';
    return db.query(queryText, [content, id]);
  }

  static delete(id) {
    const queryText = 'DELETE FROM comments WHERE id = $1 RETURNING *';
    return db.query(queryText, [id]);
  }
}

module.exports = Comment;