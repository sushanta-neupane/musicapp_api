import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

/**
 * Function to upload an image to Cloudinary using a buffer
 * @param {Buffer} fileBuffer - File buffer to upload
 * @param {string} folder - Folder in Cloudinary to store the image
 * @returns {Promise<object>} - Resolves with the upload response object
 */
export const imageUploader = async (fileBuffer: Buffer, folder: string) => {
  try {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder }, // Set folder for organization
        (error, result) => {
          if (error) {
            return reject(error);
          }
          resolve(result as UploadApiResponse); // Return upload result
        }
      );
      uploadStream.end(fileBuffer); // Pass the file buffer to the stream
    });
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw error;
  }
};

export const deleteImage = async (publicId: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) {
        console.error('Error deleting image from Cloudinary:', error);
        return reject(error);
      }
      console.log('Image deleted:', result);
      resolve();
    });
  });
};
