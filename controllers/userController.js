const userModel = require("../models/userModel");

// logn controls
const loginController = async (req, res) => {
  try {
    const { userId, password } = req.body;
    console.log(userId, password , typeof userId, typeof password)
    const user = await userModel.findOne({ userId, password, verified: true });
  console.log(user)
    if (user) {
      res.status(200).send(user);
    } else {
      res.status(400).send({
        message: "login fail",
        user,
      });
    }
  } catch (error) {
    console.log(error);
  }
};
// Register Controls
const registerController = async (req, res) => {
  try {
    const newUser = new userModel({ ...req.body, verified: true });
    await newUser.save();
    res.status(201).send("New User added Successfully!");
  } catch (error) {
    res.status(400).send("error", error);
    console.log(error);
  }
};

module.exports = { loginController, registerController };
