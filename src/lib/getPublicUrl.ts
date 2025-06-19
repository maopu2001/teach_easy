import config from "./config";

export default function getPublicUrl(url: any) {
  if (!url || url === "") return null;
  if (url.startsWith(config.s3.bucket)) {
    return config.s3.useSSL
      ? `https://${config.s3.endPoint}/${url}`
      : `http://${config.s3.endPoint}/${url}`;
  }
  return url;
}
