const express = require("express");
const helmet = require("helmet");
const app = express();
const PORT = 4000;
const routes = require("./routes");
const registry = require("./routes/registry.json");

app.use(helmet());
app.use(express.json());

const auth = (req, res, next) => {
  const url = req.protocol + "://" + req.host + PORT + req.path;
  const authString = Buffer.from(req.headers.authorization, "base64").toString(
    "utf8"
  ); // bentuknya akan menjadi "username:password" yang didapat dari instance api (kalau di sini adalah fakeapi)
  console.log("base64 ====>", authString);
  const authParts = authString.split(":");
  const username = authParts[0];
  const password = authParts[1];
  console.log(username + " | " + password);
  const user = registry.auth.users[username];

  if (user) {
    if (user.username === username && user.password === password) {
      next();
    } else {
      res.send({
        authenticated: false,
        path: url,
        message: "Authentication Unsuccessful : password incorrect",
      });
    }
  } else {
    res.send({
      authenticated: false,
      path: url,
      message:
        "Authentication Unsuccessful : username " +
        username +
        " does not exist.",
    });
  }
};

app.use(auth);
app.use("/", routes);

app.listen(PORT, () => {
  console.log(`Server gateway berjalan di port ${PORT}`);
});
