const parseUserAgent = (userAgent) => {
  let browser, os;
  switch (userAgent) {
    case userAgent.includes("Chrome") && !userAgent.includes("Edg"):
      browser = "Chrome";
      break;
    case userAgent.includes("Safari") && !userAgent.includes("Chrome"):
      browser = "Safari";
      break;
    case userAgent.includes("Firefox"):
      browser = "Firefox";
      break;
    case userAgent.includes("Edg"):
      browser = "Microsoft Edge";
      break;
    default:
      browser = "Unknown";
  }

  switch (userAgent) {
    case userAgent.includes("Windows NT"):
      os = "Windows";
      break;
    case userAgent.includes("Macintosh"):
      os = "Mac";
      break;
    case userAgent.includes("Mac OS X"):
      os = "Mac";
      break;
    case userAgent.includes("Linux"):
      os = "Linux";
      break;
    case userAgent.includes("Android"):
      os = "Android";
      break;
    case userAgent.includes("iPhone") || userAgent.includes("iPad"):
      os = "iOS";
      break;
    default:
      os = "Unknown";
  }
  return { browser, os };
};
export default parseUserAgent;
