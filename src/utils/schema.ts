import * as yup from "yup";

export const closureSchema = yup.object({
  closureDate: yup.date().required(),
  finalClosureDate: yup
    .date()
    .required()
    .when(
      "closureDate",
      (closureDate, schema) =>
        closureDate &&
        schema.min(
          closureDate,
          "Final closure date must be greater than closure date."
        )
    ),
  isActive: yup.boolean().notRequired(),
});

export const userSchema = yup.object({
  name: yup.string().required().trim(),
  email: yup.string().email().required().trim(),
  password: yup
    .string()
    .required()
    .min(8, "Password must be at least 8 characters")
    .trim(),
  department: yup.string().required(),
  role: yup.string().required(),
});

export const editUserSchema = yup.object({
  name: yup.string().required().trim(),
  email: yup.string().email().required().trim(),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .trim(),
  department: yup.string().required(),
  role: yup.string().required(),
});
