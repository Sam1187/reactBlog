import { body } from "express-validator";

export const loginValidation = [
  body("password").isLength({ min: 6 }),
  body("username").isLength({ min: 3 }),
];

export const registerValidation = [
  body("password").isLength({ min: 6 }),
  body("username").isLength({ min: 3 }),
];

export const postCreateValidation = [
//   body("title").isLength({ min: 3 }).isString(),
//   body("text").isLength({ min: 10 }).isString(),
//   body("tags", "Неверный формат тэгов").optional().isString(),
//   body("imageUrl", "Неверная ссылка на изображение").optional().isString(),
];
