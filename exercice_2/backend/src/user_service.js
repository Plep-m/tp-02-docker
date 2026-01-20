const User = require('./user_domain');

class UserService {
  constructor(db) {
    this.db = db;
  }

  getAllUsers() {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM users', [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          const users = rows.map(row => User.fromRow(row));
          resolve(users);
        }
      });
    });
  }

  getUserById(id) {
    return new Promise((resolve, reject) => {
      this.db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
        if (err) {
          reject(err);
        } else if (!row) {
          resolve(null);
        } else {
          resolve(User.fromRow(row));
        }
      });
    });
  }

  createUser(username, password) {
    return new Promise((resolve, reject) => {
      this.db.run(
        'INSERT INTO users (username, password) VALUES (?, ?)',
        [username, password],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve(new User(this.lastID, username, password));
          }
        }
      );
    });
  }

  updateUser(id, username, password) {
    return new Promise((resolve, reject) => {
      this.db.run(
        'UPDATE users SET username = ?, password = ? WHERE id = ?',
        [username, password, id],
        function(err) {
          if (err) {
            reject(err);
          } else if (this.changes === 0) {
            resolve(null);
          } else {
            resolve(new User(id, username, password));
          }
        }
      );
    });
  }

  deleteUser(id) {
    return new Promise((resolve, reject) => {
      this.db.run('DELETE FROM users WHERE id = ?', [id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes > 0);
        }
      });
    });
  }
}

module.exports = UserService;
