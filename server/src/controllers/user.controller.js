const userService = require("../services/user.service");

const getUsers = async (req, res) => {
  try {
    const data = await userService.getUsers();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getUsers,
};