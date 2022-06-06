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

  if (apiAlreadyExists(registryInfo)) {
    // memeriksa apakah api yang diregister sudah ada atau belum
    // Return already exist
    res.send(
      "Configuration already exist for '" +
        registryInfo.apiName +
        "' at '" +
        registryInfo.url +
        "'"
    );
  } else {
    registry.services[registryInfo.apiName].push({ ...registryInfo });

    fs.writeFile(
      "./routes/registry.json",
      JSON.stringify(registry),
      (error) => {
        if (error) {
          res.send("Api gateway gagal didaftarkan");
        } else {
          res.send("Api gateway berhasil didaftarkan");
        }
      }
    );
  }
});

router.post("/unregister", (req, res) => {
  const registrationInfo = req.body;

  if (apiAlreadyExists(registrationInfo)) {
    const index = registry.services[registrationInfo.apiName].findIndex(
      (instance) => {
        return registrationInfo.url === instance.url;
      }
    );

    registry.services[registrationInfo.apiName].splice(index, 1);

    fs.writeFile(
      "./routes/registry.json",
      JSON.stringify(registry),
      (error) => {
        if (error) {
          res.send("Api gateway gagal dihapus");
        } else {
          res.send("Api gateway berhasil dihapus");
        }
      }
    );
  } else {
    res.send(
      "Configuration does not exist for '" +
        registrationInfo.apiName +
        "' at '" +
        registrationInfo.url +
        "'"
    );
  }
});

const apiAlreadyExists = (registryInfo) => {
  let exists = false;

  registry.services[registryInfo.apiName].forEach((instance) => {
    if (instance.url === registryInfo.url) {
      exists = true;
      return;
    }
  });

  return exists;
};

module.exports = router;
