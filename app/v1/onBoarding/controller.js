const { UserModel } = require("../../../databaseModels/users");
const { hashPassword, comparePassword } = require("../../../helper/bcrypt");
const { generateToken } = require("../../../helper/jwt");
const { RoleModel } = require("../../../databaseModels/role");
const { Roles } = require("../../../constants/roles");

module.exports = {
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;
      let lowerEmail = email.toLowerCase();
      const userExists = await UserModel.findOne({ email: lowerEmail });
      if (userExists) {
        return res
          .status(400)
          .send({ message: "User already exists with this email." });
      }

      const role = await RoleModel.findOne({ name: Roles.User.name });
      if (!role) {
        return res.status(400).send({ message: "User role not found." });
      }

      const user = await UserModel.create({
        name,
        email: lowerEmail,
        password: await hashPassword(password),
        roleId: role._id,
      });

      const userResponse = await UserModel.findById(user._id)
        .select("-password")
        .populate("roleId");

      return res.status(201).send({
        message: "User registered successfully.",
        data: userResponse,
      });
    } catch (err) {
      console.log("register err", err?.message || err);
      return res
        .status(500)
        .send({ message: err?.message || "Internal server error." });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      let lowerEmail = email.toLowerCase();
      const user = await UserModel.findOne({
        email: lowerEmail,
      }).populate("roleId");
      if (!user) {
        return res.status(400).send({ message: "User not found." });
      }
      const isPasswordValid = await comparePassword(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).send({ message: "Invalid password." });
      }
      const roleName = user.roleId?.name || Roles.User.name;
      const token = generateToken({ id: user._id, role: roleName });
      if (!token) {
        return res.status(500).send({ message: 'Failed to generate authentication token.' });
      }
      const userResponse = user.toObject();
      delete userResponse.password;
      userResponse.roleName = roleName;
      return res.status(200).send({
        message: "User logged in successfully.",
        data: {
          token,
          user: userResponse,
        },
      });
    } catch (err) {
      console.log("login err", err?.message || err);
      return res
        .status(500)
        .send({ message: err?.message || "Internal server error." });
    }
  },
};
