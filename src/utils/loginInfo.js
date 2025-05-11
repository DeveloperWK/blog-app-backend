const loginInfo = async (req) => {
  const userAgent = req.headers["user-agent"] || "Unknown";

  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket?.remoteAddress ||
    req.connection?.remoteAddress ||
    "Unknown";
  return {
    userAgent,
    ip,
  };
};
export default loginInfo;
