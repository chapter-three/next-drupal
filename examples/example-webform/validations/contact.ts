import * as yup from "yup"

export const contactFormSchema = yup.object({
  name: yup.string().required(),
  email: yup.string().email().required(),
  team: yup.string().required(),
  subject: yup.string().required(),
  message: yup.string().required(),
})
