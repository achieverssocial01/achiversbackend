import  { S3Client,PutObjectCommand,DeleteObjectCommand,GetObjectCommand }from "@aws-sdk/client-s3";
import  { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// mynewbucketformedidek
// ap-south-1
// AKIAXDSGBYON2FQE5CUO
// SkSeInFVjHkA/M0NeDGzPYbEYm+UmHAolJzkkxQw
const bucketName = "achieverbucket"
const region = "ap-south-1"
const accessKeyId = "AKIAYYFIKK6M35KBSC3Q"
const secretAccessKey = "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"

const s3Client = new S3Client({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey
    }
  })

const uploadFile =(fileBuffer, fileName, mimetype)=>{
    const uploadParams = {
        Bucket: bucketName,
        Body: fileBuffer,
        Key: fileName,
        ContentType: mimetype
      }
return s3Client.send(new PutObjectCommand(uploadParams));
}

const deleteFile =(fileName)=>{
    const deleteParams = {
        Bucket: bucketName,
        Key: fileName,
      }
return s3Client.send(new DeleteObjectCommand(deleteParams));
}


const getObjectSignedUrl =async(key)=>{
    const params = {
        Bucket: bucketName,
        Key: key
      }
      const command = new GetObjectCommand(params);
      const seconds = 200
      const url = await getSignedUrl(s3Client, command, { expiresIn: seconds });
      return url
}

export {uploadFile}