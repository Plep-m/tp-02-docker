const User = require('./user_domain');

class UserService {
  constructor(pool) {
    this.pool = pool;
  }

  async getAllUsers() {
    const result = await this.pool.query('SELECT * FROM users');
    return result.rows.map(row => User.fromRow(row));
  }

  async getUserById(id) {
    const result = await this.pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows.length > 0 ? User.fromRow(result.rows[0]) : null;
  }

  async createUser(username, password) {
    const result = await this.pool.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
      [username, password]
    );
    return User.fromRow(result.rows[0]);
  }

  async updateUser(id, username, password) {
    const result = await this.pool.query(
      'UPDATE users SET username = $1, password = $2 WHERE id = $3 RETURNING *',
      [username, password, id]
    );
    return result.rows.length > 0 ? User.fromRow(result.rows[0]) : null;
  }

  async deleteUser(id) {
    const result = await this.pool.query('DELETE FROM users WHERE id = $1', [id]);
    return result.rowCount > 0;
  }
}

module.exports = UserService;
