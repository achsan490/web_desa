import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadToCloudinary(
  file: Buffer,
  folder: string = "desa-sukamaju"
): Promise<{ url: string; publicId: string }> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type: "auto",
          transformation: [{ quality: "auto", fetch_format: "auto" }],
        },
        (error, result) => {
          if (error) reject(error);
          else
            resolve({
              url: result!.secure_url,
              publicId: result!.public_id,
            });
        }
      )
      .end(file);
  });
}

export async function deleteFromCloudinary(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}

export default cloudinary;
