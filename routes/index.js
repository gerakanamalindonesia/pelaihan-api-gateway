const express = require("express");
const router = express.Router();
const axios = require("axios");
const registry = require("./registry.json");

router.all("/:apiName/:path", (req, res) => {
  console.log(req.params.apiName);
  if (registry.services[req.params.apiName]) {
    axios
      .get(registry.services[req.params.apiName].url + req.params.path)
      .then((response) => {
        res.send(response.data);
      });
  } else {
    res.send("Api name tidak ditemukan");
  }
});

module.exports = router;
