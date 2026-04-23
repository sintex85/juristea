import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

let _r2: S3Client
function getR2() {
  if (!_r2) {
    _r2 = new S3Client({
      region: "auto",
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
      },
    })
  }
  return _r2
}

function getBucket() {
  return process.env.R2_BUCKET_NAME!
}

export async function getUploadUrl(key: string) {
  return getSignedUrl(
    getR2(),
    new PutObjectCommand({ Bucket: getBucket(), Key: key }),
    { expiresIn: 3600 }
  )
}

export async function getDownloadUrl(key: string) {
  return getSignedUrl(
    getR2(),
    new GetObjectCommand({ Bucket: getBucket(), Key: key }),
    { expiresIn: 3600 }
  )
}

export async function deleteFile(key: string) {
  return getR2().send(new DeleteObjectCommand({ Bucket: getBucket(), Key: key }))
}
