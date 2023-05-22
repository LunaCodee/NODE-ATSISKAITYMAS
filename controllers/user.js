const uniqid = require("uniqid");
const UserModel = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


module.exports.INSERT_USER = async (req, res) => {
  try {
    const name = req.body.name;
    const capitalizedFirstName = name.charAt(0).toUpperCase() + name.slice(1);


    if (!req.body.email.includes("@")) {
      return res.status(400).json({ response: "Invalid email format" });
    }

    const password = req.body.password;
    console.log("Password:", password);
    console.log("Length:", password.length);
    console.log("Contains digit:", /\d/.test(password));

    if (password.length < 6 || !/\d/.test(password)) {
      return res.status(400).json({
        response: "Password should be at least 6 characters long and contain at least one number",
      });
    }

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, async (err, hash) => {
        const user = new UserModel({
          id: uniqid(),
          name: capitalizedFirstName,
          email: req.body.email,
          password: hash,
          bought_tickets: req.body.bought_tickets,
          money_balance: req.body.money_balance,
        });

        await user.save();
      });
    });

    res.status(200).json({ response: "User was saved successfully" });
  } catch (err) {
    res.status(400).json({ response: "Validation was not successful" });
  }
};

module.exports.LOGIN = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({ response: "Bad email or password" });
    }

    bcrypt.compare(req.body.password, user.password, (err, isPasswordMatch) => {
      if (isPasswordMatch) {
        const token = jwt.sign(
          {
            email: user.email,
            userId: user.id,
          },
          process.env.JWT_SECRET,
          { expiresIn: "2h" },
          {
            algorithm: "RS256",
          }
        );
        const refreshToken = jwt.sign(
          {
            email: user.email,
            userId: user.id,
          },
          process.env.JWT_REFRESH_SECRET,
          { expiresIn: "1d" }
        );
        return res.status(200).json({
          response: "You logged in successfully",
          jwt: token,
          refreshToken: refreshToken,
        });
      } else {
        return res.status(404).json({ response: "Bad email or password" });
      }
    });
  } catch (err) {
    console.log("ERR", err);
    res.status(404).json({ response: "ERROR, please try later" });
  }
};

module.exports.GET_ALL_USERS = async (req, res) => {
  try {
    const users = await UserModel.find().sort({ name: 1 });;
    res.status(200).json({ users: users });
  } catch (err) {
    console.log("ERR", err);
    res.status(500).json({ response: "ERROR, please try later" });
  }
};

module.exports.GET_USER_BY_ID = async (req, res) => {
  try {
    const user = await UserModel.findOne({ id: req.params.id });
    res.status(200).json({ user: user });
  } catch (err) {
    console.log("ERR", err);
    res.status(404).json({ response: "ERROR, such user not found" });
  }
};


module.exports.DELETE_USER_BY_ID = async (req, res) => {
  try {
    const user = await UserModel.deleteOne({ id: req.params.id });
    res.status(200).json({ user: user });
  } catch (err) {
    console.log("ERR", err);
    res.status(500).json({ response: "ERROR, please try later" });
  }
};

module.exports.GET_NEW_TOKEN = async (req, res) => {
  try {
    const refreshToken = req.headers.authorization;

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
      if (err) {
        return res.status(400).json({ response: "You have to sign in again" });
      }
      const userId = decoded.userId;
      const newToken = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1d" });

      return res.status(200).json({ newToken, refreshToken });
    });
  } catch (err) {
    console.log("ERR", err);
    res.status(500).json({ response: "ERROR, please try again later" });
  }
};