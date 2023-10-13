const { UserModel } = require("../models/User");
const findUserById = async (id) => {
  const foundUser = await UserModel
    .findOne({ _id: id})
    .lean()

  return foundUser
};

module.exports = {
  findUserById,
};
