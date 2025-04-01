import category from "src/utils/category";
import { isValidObjectId } from "mongoose";
import * as yup from "yup";
import { parseISO } from "date-fns";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex =
  /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]+$/;

yup.addMethod(yup.string, "email", function validateEmail(message) {
  return this.matches(emailRegex, {
    message,
    name: "email",
    excludeEmptyString: true,
  });
});

const password = {
  password: yup
    .string()
    .required("password is required")
    .min(6, "Password must be at least 6 characters long.")
    .matches(
      passwordRegex,
      "Password must include: A-Z, a-z, 0-9, and special character (!@#$%^&*)."
    ),
};

export const newUserSchema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  ...password,
});

const tokenAndId = {
  id: yup.string().test({
    name: "valid-id",
    message: "Invalid user id",
    test: (value) => {
      return isValidObjectId(value);
    },
  }),
  token: yup.string().required("Token is required"),
};

export const verifyTokenSchema = yup.object({
  ...tokenAndId,
});

export const resetPasswordSchema = yup.object({
  ...tokenAndId,
  ...password,
});

export const newProductSchema = yup.object({
  name: yup.string().required("Name is required"),
  description: yup.string().required("Description is required"),
  category: yup
    .string()
    .oneOf(category, "Invalid category!")
    .required("category is required"),
  price: yup
    .string()
    .transform((value) => {
      if (isNaN(+value)) return "";

      return +value;
    })
    .required("Price is required"),
  purchasingDate: yup
    .string()
    // .matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/)
    .transform((value) => {
      try {
        return parseISO(value);
      } catch (error) {
        return "";
      }
    })
    .required("Purchasing date is required"),
});
