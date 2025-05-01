// Profile picture photo upload validation

import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1204; // photos no larger than 5MB
const MIN_DIMENTSIONS = { width: 200, height: 200 };
const MAX_DIMENSIONS = { width: 4096, height: 4096 };
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) {
    return "0 Bytes";
  }
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

export const imageSchema = z.object({
  image: z
    .instanceof(File, { message: "Выберите фотографию!" })
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: `Размер файла слишком большой. Выберите файл размером меньше чем ${formatBytes(MAX_FILE_SIZE)}!`,
    })
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: "Загрузите фото одного из форматов (JPEG, PNG, или WebP)",
    })
    .refine(
      (file) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
              const meetsDimentsions =
                img.width >= MIN_DIMENTSIONS.width &&
                img.height >= MIN_DIMENTSIONS.height &&
                img.width <= MAX_DIMENSIONS.width &&
                img.height <= MAX_DIMENSIONS.height;
              resolve(meetsDimentsions);
            };
            img.src = e.target?.result as string;
          };
          reader.readAsDataURL(file);
        }),
      {
        message: "Неправильный размер фотографии!",
      }
    ),
});
