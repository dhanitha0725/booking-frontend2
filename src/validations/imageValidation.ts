import * as z from "zod";

// Constants for validation
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_FILE_TYPES = ["image/jpeg", "image/jpg", "image/png"];
export const MAX_IMAGES = 10;
export const MIN_IMAGES = 1;

// Create a FileSchema to validate individual files
const FileSchema = z.instanceof(File).refine(
  (file) => file.size <= MAX_FILE_SIZE,
  (file) => ({ message: `File "${file.name}" exceeds the 5MB size limit.` })
).refine(
  (file) => ALLOWED_FILE_TYPES.includes(file.type),
  (file) => ({ message: `File "${file.name}" is not a supported image format. Please use JPG, JPEG or PNG.` })
);

// Create a schema to validate an array of files
export const imageFilesSchema = z.array(FileSchema)
  .min(MIN_IMAGES, `At least ${MIN_IMAGES} image is required.`)
  .max(MAX_IMAGES, `You can only upload up to ${MAX_IMAGES} images.`);

// Function to validate image files
export const validateImageFiles = (files: File[]): z.SafeParseReturnType<File[], File[]> => {
  return imageFilesSchema.safeParse(files);
};