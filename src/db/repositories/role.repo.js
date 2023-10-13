const { RoleModel } = require("../models/Role");
const findRoleById = async(id) => {
  const foundRole = await RoleModel
    .findOne({ _id: id})
    .lean()

  return foundRole
};

module.exports = {
  findRoleById,
};
