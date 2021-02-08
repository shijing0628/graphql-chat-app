const { Message, User } = require("../models");
const bcrypt = require("bcrypt");
const { UserInputError, AuthenticationError } = require("apollo-server");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/env.json");
const { Op } = require("sequelize");

// A map of functions which return data for the schema.
module.exports = {
  Query: {
    getUsers: async (_, __, { user }) => {
      try {
        if (!user) throw new AuthenticationError("unauthanticated");

        // get user but not our own (for chat app, we only see others, ne == not equal)
        const users = await User.findAll({
          where: { username: { [Op.ne]: user.username } },
        });

        return users;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    login: async (_, args) => {
      const { username, password } = args;
      let errors = {};
      try {
        if (username.trim() === "")
          errors.username = "username must not be empty";
        if (password === "") errors.password = "password must not be empty";

        if (Object.keys(errors).length > 0) {
          throw new UserInputError("bad input", { errors });
        }

        const user = await User.findOne({
          where: { username },
        });

        if (!user) {
          errors.username = "user not found";
          throw new UserInputError("user not found", { errors });
        }

        const correctPassword = await bcrypt.compare(password, user.password);

        if (!correctPassword) {
          errors.password = "password is incorrect";
          throw new AuthenticationError("password is incorrect", { errors });
        }

        // jwt
        const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1h" });
        // prettier create date
        return {
          ...user.toJSON(),
          createdAt: user.createdAt.toISOString(),
          token,
        };
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  },
  Mutation: {
    register: async (_, args) => {
      let { username, email, password, confirmPassword } = args;
      let errors = {};
      try {
        //validate input data
        if (email.trim() === "") errors.email = "email must not be empty";
        if (username.trim() === "")
          errors.username = "username must not be empty";
        if (password.trim() === "")
          errors.password = "password must not be empty";
        if (confirmPassword.trim() === "")
          errors.confirmPassword = "confirmPassword must not be empty";

        if (password !== confirmPassword)
          errors.confirmPassword = "Password must match";

        //check if username/ email exist
        const userByUsername = await User.findOne({ where: { username } });
        const userByEmail = await User.findOne({ where: { email } });
        if (userByUsername) errors.username = "Username is taken";
        if (userByEmail) errors.email = "Email is taken";

        if (Object.keys(errors).length > 0) {
          throw errors;
        }

        //hash password
        password = await bcrypt.hash(password, 6);
        //create user
        const user = await User.create({
          username,
          email,
          password,
        });

        //return user(json)
        return user;
      } catch (err) {
        console.log(err);
        // if (err.name === 'SequelizeUniqueConstraintError') {
        //  err.errors.forEach(e => (errors[e.path] = `${e.path} is already taken`))
        // }
        if (err.name === "SequelizeValidationError") {
          err.errors.forEach((e) => (errors[e.path] = e.message));
        }
        throw new UserInputError("bad input", { errors });
      }
    },
    sendMessage: async (parent, { to, content }, { user }) => {
      try {
        if (!user) throw new AuthenticationError("unauthanticated");

        const recipient = await User.findOne({ where: { username: to } });
        if (!recipient) {
          throw new UserInputError("user not found");
        }
        if (content.trim() === "") {
          throw new UserInputError("message is empty!");
        }

        const message = await Message.create({
          from: user.username,
          to,
          content,
        });
        return message;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  },
};
