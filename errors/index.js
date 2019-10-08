exports.handleCustomErrors = (err, req, res, next) => {
  // console.log(err, "<<= error");
  if (err.status) res.status(err.status).send({ msg: err.msg });
  else next(err);
};

exports.handle400PsqlErrors = (err, req, res, next) => {
  // console.log(err.code);
  const codes = ["22P02", "42703"];
  if (codes.includes(err.code)) {
    res.status(400).send({ msg: "Bad Request" });
  } else {
    next(err);
  }
};

exports.handle404PsqlErrors = (err, req, res, next) => {
  // console.log(err.code);
  const codes = ["22003", "22P02", "42703"];
  if (codes.includes(err.code)) {
    res.status(404).send({ msg: "Page not found" });
  } else {
    next(err);
  }
};

exports.handleServerErrors = (req, res) => {
  res.status(500).send({ msg: "Internal Server Error!" });
};
