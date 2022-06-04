const express = require("express");
const router = express.Router();
const axios = require("axios");
const registry = require("./registry.json");
const fs = require("fs");

router.all("/:apiName/:path", (req, res) => {
  console.log(req.params.apiName);
  if (registry.services[req.params.apiName]) {
    axios({
      method: req.method,
      url: registry.services[req.params.apiName].url + req.params.path,
      headers: req.headers,
      data: req.body,
    }).then((response) => {
      res.send(response.data);
    });
  } else {
    res.send("Api name tidak ditemukan");
  }
});

router.post("/register", (req, res) => {
  const registryInfo = req.body;

  registryInfo.url = `${registryInfo.protocol}://${registryInfo.host}:${registryInfo.port}/`;
  registry.services[registryInfo.apiName] = { ...registryInfo };

  fs.writeFile("./routes/registry.json", JSON.stringify(registry), (error) => {
    if (error) {
      res.send("Api gateway gagal didaftarkan");
    } else {
      res.send("Api gateway berhasil didaftarkan");
    }
  });
});

module.exports = router;
