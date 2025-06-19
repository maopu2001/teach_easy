import * as Minio from "minio";
import { config } from "./config";
import { Readable } from "stream";

const minioClient = new Minio.Client({
  endPoint: config.s3.endPoint,
  port: config.s3.port,
  useSSL: config.s3.useSSL,
  accessKey: config.s3.accessKey,
  secretKey: config.s3.secretKey,
});

const { bucket } = config.s3;

async function ensureBucket(): Promise<boolean> {
  try {
    const bucketExists = await minioClient.bucketExists(bucket);

    if (!bucketExists) {
      await minioClient.makeBucket(bucket, config.s3.region);
      await minioClient.setBucketPolicy(
        bucket,
        JSON.stringify({
          Version: "2012-10-17",
          Statement: [
            {
              Effect: "Allow",
              Principal: "*",
              Action: ["s3:GetObject"],
              Resource: [`arn:aws:s3:::${bucket}/*`],
            },
          ],
        })
      );
    }
    return true;
  } catch (error) {
    console.error("Error ensuring bucket exists:", error);
    return false;
  }
}

export async function uploadFile(
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string,
  objectPath: string = ""
): Promise<string> {
  if (!fileBuffer || !fileName)
    throw new Error("File buffer and file name are required");

  await ensureBucket();

  try {
    const objectName = `${objectPath}/${fileName}`;

    await minioClient.putObject(
      bucket,
      objectName,
      Readable.from(fileBuffer),
      fileBuffer.length,
      { "Content-Type": mimeType }
    );

    return `${bucket}/${objectName}`;
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw error;
  }
}

export async function deleteFile(fileUrl: string): Promise<boolean> {
  if (!fileUrl) {
    console.error("No file URL provided for deletion");
    return false;
  }

  try {
    await ensureBucket();

    let objectName = fileUrl;

    if (fileUrl.startsWith(`${bucket}/`))
      objectName = fileUrl.substring(bucket.length + 1);

    await minioClient.removeObject(bucket, objectName);
    return true;
  } catch (error) {
    console.error("Error deleting from S3:", error);
    return false;
  }
}

export async function updateFile(
  updatefileUrl = "",
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string,
  objectPath: string = ""
): Promise<string> {
  const isDeleted = await deleteFile(updatefileUrl);
  if (!isDeleted)
    throw new Error("Failed to delete the existing file before update");

  return await uploadFile(fileBuffer, fileName, mimeType, objectPath);
}

const s3Services = {
  uploadFile,
  deleteFile,
  updateFile,
};

export default s3Services;
