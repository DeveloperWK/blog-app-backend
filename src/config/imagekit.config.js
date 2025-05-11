import { configDotenv } from "dotenv";
import ImageKit from "imagekit";
configDotenv();
const imageKit = new ImageKit({
  publicKey: process.env._IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env._IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env._IMAGEKIT_URL_ENDPOINT,
});
export default imageKit;
