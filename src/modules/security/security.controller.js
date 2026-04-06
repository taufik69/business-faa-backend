const { BlockedIp } = require("./security.model");
const ApiResponse = require("@/shared/utils/apiResponse.utils");
const { HTTP_STATUS } = require("@/shared/config/constant.config");

// Add a new IP to block list
exports.blockIp = async (req, res) => {
  try {
    const { ipAddress, reason } = req.body;
    if (!ipAddress) {
      return ApiResponse.error(res, HTTP_STATUS.BAD_REQUEST, "IP address is required");
    }

    let ipRecord = await BlockedIp.findOne({ ipAddress });
    if (ipRecord) {
      ipRecord.status = "blocked";
      ipRecord.reason = reason || ipRecord.reason;
      await ipRecord.save();
    } else {
      ipRecord = await BlockedIp.create({ ipAddress, reason });
    }

    return ApiResponse.success(res, HTTP_STATUS.OK, "IP blocked successfully", ipRecord);
  } catch (error) {
    return ApiResponse.error(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, "Failed to block IP", error.message);
  }
};

// Get all blocked IPs
exports.getBlockedIps = async (req, res) => {
  try {
    const ips = await BlockedIp.find({ status: "blocked" }).sort({ createdAt: -1 });
    return ApiResponse.success(res, HTTP_STATUS.OK, "Blocked IPs retrieved successfully", ips);
  } catch (error) {
    return ApiResponse.error(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, "Failed to retrieve blocked IPs", error.message);
  }
};

// Unblock an IP
exports.unblockIp = async (req, res) => {
  try {
    const { id } = req.params;
    const ipRecord = await BlockedIp.findById(id);
    
    if (!ipRecord) {
      return ApiResponse.error(res, HTTP_STATUS.NOT_FOUND, "IP not found");
    }

    ipRecord.status = "unblocked";
    await ipRecord.save();

    return ApiResponse.success(res, HTTP_STATUS.OK, "IP unblocked successfully", ipRecord);
  } catch (error) {
    return ApiResponse.error(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, "Failed to unblock IP", error.message);
  }
};
