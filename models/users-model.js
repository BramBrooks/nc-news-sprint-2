const connection = require("../db/connection");

exports.selectAllUsers = () => {
  return connection
    .select("*")
    .from("users")
    .then(usersArray => {
      console.log(usersArray);

      return usersArray;
    });
};

// exports.selectUser = username => {
//   return connection
//     .select("*")
//     .from("users")
//     .where("username", "=", username)
//     .then(userArray => {
//       if (userArray.length === 0) {
//         return Promise.reject({ status: 404, msg: "User not found" });
//       } else {
//         return userArray[0];
//       }
//     });
// };
