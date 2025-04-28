// Verify the phone number regex pattern
// works for all countries

import { z } from "zod";
import libphonenumber from "google-libphonenumber";

const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();

const phoneNumberSchema = z
  .string()
  .nonempty({ message: "Введите номер телефона!" })
  .refine(
    (number) => {
      try {
        const phoneNumber = phoneUtil.parse(number);
        return phoneUtil.isValidNumber(phoneNumber);
      } catch (error) {
        return false;
      }
    },
    {
      message: "Неправильный номер телефона!",
    }
  );

export { phoneNumberSchema };
