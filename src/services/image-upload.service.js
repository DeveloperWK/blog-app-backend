import imageKit from "../config/imagekit.config.js";

const imageUploadService =async (file)=> {
    const uploadResponse = await  imageKit.upload({
        file:file.buffer,
        fileName:file.originalname,
        useUniqueFileName:true,
    })
    return uploadResponse.url
}
export default imageUploadService;