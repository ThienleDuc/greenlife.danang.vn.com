const keHoachRepo = require("../repositories/kehoach.repository");

const getAllKeHoach = async (limit, offset) => {
  return await keHoachRepo.getAllKeHoach(limit, offset);
};

const searchKeHoach = async (filters) => {
  return await keHoachRepo.searchKeHoach(filters);
};

module.exports = {
  getAllKeHoach,
  searchKeHoach
};
