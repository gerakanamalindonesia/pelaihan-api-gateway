const express = require("express");
const helmet = require("helmet");
const app = express();
const PORT = 4000;
const routes = require("./routes");

app.use(helmet());
app.use(express.json());

app.use("/", routes);

app.listen(PORT, () => {
  console.log(`Server gateway berjalan di port ${PORT}`);
});
