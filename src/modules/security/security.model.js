const mongoose = require("mongoose");

const securitySchema = new mongoose.Schema(
  {
    ipAddress: {
      type: String,
      required: true,
      unique: true,
    },
    reason: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["blocked", "unblocked"],
      default: "blocked",
    },
  },
  {
    timestamps: true,
  }
);

const BlockedIp = mongoose.model("BlockedIp", securitySchema);

module.exports = { BlockedIp };
