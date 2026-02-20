const jwt = require("jsonwebtoken");

exports.login = (req, res) => {
  const fakeUser = { id: "123", username: "ragul" };

  const token = jwt.sign(fakeUser, "secretkey", { expiresIn: "1h" });

  res.json({
    message: "Login successful",
    token
  });
};

exports.dashboard = (req, res) => {
  res.json({
    message: "Welcome to dashboard"
  });
};