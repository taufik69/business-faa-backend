const express = require("express");
const _ = express.Router();
const controller = require("./security.controller");

_.post("/block", controller.blockIp);
_.get("/blocked-ips", controller.getBlockedIps);
_.put("/unblock/:id", controller.unblockIp);

module.exports = _;
