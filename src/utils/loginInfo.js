import parseUserAgent from "./parseUserAgent.js";

const loginInfo = async (req) => {
    const userAgent = req.headers['user-agent'];
    const ip = req.ip || req.connection.remoteAddress;
    const parsedUserAgent = parseUserAgent(userAgent)
    return {
        parsedUserAgent,
        ip,
    }
}
export default loginInfo;