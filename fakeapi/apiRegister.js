const axios = require("axios");
const HOST = "localhost";
const PORT = 4001;

exports.apiRegiter = () => {
  axios({
    method: "POST",
    url: "http://localhost:4000/register",
    headers: { "Content-Type": "application/json" },
    data: {
      apiName: "registryTest",
      protocol: "http",
      host: HOST,
      port: PORT,
    },
  }).then((response) => {
    console.log(response.data);
  });
};
