const userRepo = require("../repositories/user.repository");

const getUsers = async () => {
  return await userRepo.getAllUsers();
};

module.exports = {
  getUsers,
};