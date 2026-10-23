const { app } = require("../../api/index.js");
const serverless = require("serverless-http");

exports.handler = serverless(app);
