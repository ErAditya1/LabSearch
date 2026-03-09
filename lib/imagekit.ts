import ImageKit from "imagekit";

/**
 * ImageKit instance for server-side operations (upload, delete).
 */
export const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC!,
  privateKey: process.env.IMAGEKIT_PRIVATE!,
  urlEndpoint: process.env.IMAGEKIT_URL!,
});

/**
 * Upload a file buffer to ImageKit and return the file URL.
 */
export async function uploadToImageKit(
  buffer: Buffer,
  fileName: string,
  folder: string = "/labsearch"
): Promise<{ url: string; fileId: string }> {
  const response = await imagekit.upload({
    file: buffer,
    fileName,
    folder,
    useUniqueFileName: true,
  });

  return {
    url: response.url,
    fileId: response.fileId,
  };
}
