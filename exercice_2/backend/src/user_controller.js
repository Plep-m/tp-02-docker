const UserService = require('./user_service');

const getAllUsers = async (req, res) => {
  const userService = new UserService(req.app.locals.db);
  
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getUserById = async (req, res) => {
  const userService = new UserService(req.app.locals.db);
  const id = req.params.id;
  
  try {
    const user = await userService.getUserById(id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createUser = async (req, res) => {
  const userService = new UserService(req.app.locals.db);
  const { username, password } = req.body;
  
  try {
    const user = await userService.createUser(username, password);
    res.status(201).json(user);
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateUser = async (req, res) => {
  const userService = new UserService(req.app.locals.db);
  const id = req.params.id;
  const { username, password } = req.body;
  
  try {
    const user = await userService.updateUser(id, username, password);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteUser = async (req, res) => {
  const userService = new UserService(req.app.locals.db);
  const id = req.params.id;
  
  try {
    const deleted = await userService.deleteUser(id);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};
