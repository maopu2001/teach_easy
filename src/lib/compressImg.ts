import sharp from "sharp";

export async function compressImage(
  buffer: Buffer,
  mimeType: string,
  size = 1024
): Promise<Buffer> {
  if (
    mimeType === "image/jpeg" ||
    mimeType === "image/jpg" ||
    mimeType === "image/png"
  )
    return await sharp(buffer)
      .resize({ width: size, withoutEnlargement: true })
      .webp()
      .toBuffer();
  else if (mimeType === "image/svg+xml") return buffer;
  else throw new Error("Unsupported image type");
}
