const axios = require("axios");
const HOST = "localhost";
const PORT = 4002;

exports.apiRegiter = () => {
  const authString = "johndoe:password";
  const encodedAuthString = Buffer.from(authString, "utf8").toString("base64");
  console.log("encoded auth string :", encodedAuthString);

  axios({
    method: "POST",
    url: "http://localhost:4000/register",
    headers: {
      authorization: encodedAuthString,
      "Content-Type": "application/json",
    },
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
