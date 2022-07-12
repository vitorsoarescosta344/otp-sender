import { object, string, ref } from "yup";

export const sendOTPEmailSchema = object({
  body: object({
    type: string().required("type is required"),
    email: string().required("email is required"),
  }),
});
