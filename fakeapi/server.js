const express = require("express");
const { apiRegiter } = require("./apiRegister");
const PORT = 4002;
const app = express();

app.use(express.json());

app.get("/fakeapi", (req, res, next) => {
  res.send("Halo from fakepi server");
});

app.post("/mantabapi", (req, res, next) => {
  res.send("Response dari mantab!!");
});

app.listen(PORT, () => {
  apiRegiter();
  console.log(`Server fakeapi berjalan di port ${PORT}`);
});
