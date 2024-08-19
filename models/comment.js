const db = require('../config/db');

class Comment {
  static create(user_id, postId, content) {
    const queryText = 'INSERT INTO comments(user_id, post_id, content) VALUES($1, $2, $3) RETURNING *';
    return db.query(queryText, [user_id, postId, content]);
  }

  static async getAll() {
    const queryText = 'SELECT * FROM comments';
    const result = await db.query(queryText);
    return result.rows;
  }

  static async getById(id) {
    const queryText = 'SELECT * FROM comments WHERE id = $1';
    const result = await db.query(queryText, [id]);
    return result.rows[0];
  }

  static async getByPostId(postId) {
  const queryText = 'SELECT * FROM comments WHERE post_id = $1';
  const result = await db.query(queryText, [postId]);
  return result.rows;
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