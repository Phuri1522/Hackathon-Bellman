import multer from "multer"
import { v2 as cloudinary } from "cloudinary"
import { Readable } from "stream"

export const upload = multer({ storage: multer.memoryStorage() })

export const uploadToCloudinary = (
  buffer: Buffer,
  folder: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, transformation: [{ width: 800, crop: "limit" }] },
      (error, result) => {
        if (error) reject(error)
        else resolve(result!.secure_url)
      }
    )
    Readable.from(buffer).pipe(stream)
  })
}