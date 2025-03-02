import {
  S3Client,
  ListBucketsCommand,
  ListObjectsV2Command,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const ACCOUNT_ID = process.env.CF_Account_ID!
const ACCESS_KEY_ID = process.env.CF_Access_Key_ID!
const SECRET_ACCESS_KEY = process.env.CF_Secret_Access_Key!

const region = "auto"; // rainyun
const S3 = new S3Client({
    region,
    endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: ACCESS_KEY_ID,
        secretAccessKey: SECRET_ACCESS_KEY,
    },
})

if (require.main === module) {
  // bun tests/oss/server.ts
  // console.log(await S3.send(new ListBucketsCommand({})));
}
