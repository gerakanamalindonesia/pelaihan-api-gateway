const express = require("express");
const PORT = 4001;
const app = express();

app.use(express.json());

app.get("/fakeapi", (req, res, next) => {
  res.send("Halo from fakepi server");
});

app.listen(PORT, () => {
  console.log(`Server fakeapi berjalan di port ${PORT}`);
});
