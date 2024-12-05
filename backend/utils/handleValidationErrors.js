import { validationResult } from "express-validator";

export default (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);

    return res
      .status(401)
      .json({ errors: errors.array(), message: "Validation Error" });
  }
  next();
};
