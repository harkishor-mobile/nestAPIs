import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary, UploadApiOptions } from 'cloudinary';

export const profileStorage = new CloudinaryStorage({
  cloudinary,
  // eslint-disable-next-line @typescript-eslint/require-await
  params: async (): Promise<UploadApiOptions> => ({
    folder: 'user_profile_images', //  valid in UploadApiOptions
    resource_type: 'image', // required for images
    // format: 'png' || 'jpg' || 'jpeg' || 'svg' || 'webp', // optional default format
  }),
});
