const { selectUser, selectAllUsers } = require("../models/users-model");

exports.getAllUsers = (req, res, next) => {
  selectAllUsers()
    .then(users => {
      res.status(200).send({ users });
    })
    .catch(next);
};

exports.getUser = (req, res, next) => {
  const { username } = req.params;
  selectUser(username)
    .then(user => {
      res.status(200).send({ user });
    })
    .catch(next);
};
