const express = require("express");
const app = express();
const PORT = 4000;
const routes = require("./routes");

app.use("/", routes);

app.listen(PORT, () => {
  console.log(`Server gateway berjalan di port ${PORT}`);
});
