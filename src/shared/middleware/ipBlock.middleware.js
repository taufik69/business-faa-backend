const { BlockedIp } = require("@/modules/security/security.model");
const ApiResponse = require("@/shared/utils/apiResponse.utils");
const { HTTP_STATUS } = require("@/shared/config/constant.config");

const checkBlockedIp = async (req, res, next) => {
  try {
    const clientIp = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    
    // Check if IP is in our blocked list
    const isBlocked = await BlockedIp.findOne({ 
      ipAddress: clientIp, 
      status: "blocked" 
    });

    if (isBlocked) {
      return ApiResponse.error(
        res, 
        HTTP_STATUS.FORBIDDEN, 
        "Your IP has been blocked due to suspicious activity."
      );
    }

    next();
  } catch (error) {
    console.error("IP Block Middleware Error:", error);
    next(); // Continue even if check fails to avoid site downtime
  }
};

module.exports = checkBlockedIp;
