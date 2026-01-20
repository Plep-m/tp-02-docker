class User {
  constructor(id, username, password) {
    this.id = id;
    this.username = username;
    this.password = password;
  }

  static fromRow(row) {
    return new User(row.id, row.username, row.password);
  }

  toJSON() {
    return {
      id: this.id,
      username: this.username,
      password: this.password
    };
  }
}

module.exports = User;
