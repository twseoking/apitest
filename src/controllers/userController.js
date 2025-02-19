export class UserController {
  constructor() {
    this.users = [];
  }

  getUsers = (req, res) => {
    res.json(this.users);
  }

  getUserById = (req, res) => {
    const user = this.users.find(u => u.id === parseInt(req.params.id));
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  }

  createUser = (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    const newUser = {
      id: this.users.length + 1,
      name,
      email
    };

    this.users.push(newUser);
    res.status(201).json(newUser);
  }

  updateUser = (req, res) => {
    const { name, email } = req.body;
    const userIndex = this.users.findIndex(u => u.id === parseInt(req.params.id));

    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found' });
    }

    this.users[userIndex] = {
      ...this.users[userIndex],
      name: name || this.users[userIndex].name,
      email: email || this.users[userIndex].email
    };

    res.json(this.users[userIndex]);
  }

  deleteUser = (req, res) => {
    const userIndex = this.users.findIndex(u => u.id === parseInt(req.params.id));
    
    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found' });
    }

    this.users.splice(userIndex, 1);
    res.status(204).send();
  }
}
