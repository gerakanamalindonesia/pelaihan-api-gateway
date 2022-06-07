const express = require("express");
const router = express.Router();
const axios = require("axios");
const registry = require("./registry.json");
const fs = require("fs");
const loadbalancer = require("../util/loadbalancer");

router.post("/enable/:apiName", (req, res) => {
  const apiName = req.params.apiName;
  const requestBody = req.body;
  const instances = registry.services[apiName].instances;
  const index = instances.findIndex((srv) => {
    // membandingkan apakah ada apiName di gateway atau tidak
    return srv.url === requestBody.url;
  });

  if (index == -1) {
    // jika apiName tidak ada
    res.send({
      status: "error",
      message:
        "Could not find ['" +
        requestBody.url +
        "'] for service " +
        apiName +
        "'",
    });
  } else {
    instances[index].enabled = requestBody.enabled;
    fs.writeFile(
      "./routes/registry.json",
      JSON.stringify(registry),
      (error) => {
        if (error) {
          res.send("Could not enable/disable :", error);
        } else {
          res.send("Success enable / disable");
        }
      }
    );
  }
});

router.all("/:apiName/:path", (req, res) => {
  const service = registry.services[req.params.apiName];

  if (!service.loadBalanceStrategy) {
    service.loadBalanceStrategy = "ROUND_ROBIN";
    fs.writeFile(
      "./routes/registry.json",
      JSON.stringify(registry),
      (error) => {
        if (error) {
          res.send("Could not write load balance strategy :", error);
        } else {
          res.send("Success write load balance strategy");
        }
      }
    );
  }

  if (service) {
    const newIndex = loadbalancer[service.loadBalanceStrategy](service);
    const url = service.instances[newIndex].url;
    console.log(url);
    axios({
      method: req.method,
      url: url + req.params.path,
      headers: req.headers,
      data: req.body,
    })
      .then((response) => {
        res.send(response.data);
      })
      .catch((error) => {
        res.status(400).send("");
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
    registry.services[registryInfo.apiName].instances.push({ ...registryInfo });

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
    const index = registry.services[
      registrationInfo.apiName
    ].instances.findIndex((instance) => {
      return registrationInfo.url === instance.url;
    });

    registry.services[registrationInfo.apiName].instances.splice(index, 1);

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

  registry.services[registryInfo.apiName].instances.forEach((instance) => {
    if (instance.url === registryInfo.url) {
      exists = true;
      return;
    }
  });

  return exists;
};

module.exports = router;
