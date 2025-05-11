// Management's personal information
// ceoName, accountantName, phone number

// Main information about the user
// Name, Surname, Fathername, and phone number
// this is the first step of creating a new account

"use client";

import { z } from "zod";
import { phoneNumberSchema } from "@/lib/mobileValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MANAGEMENT_INFO } from "@/types/auth/legal";
import { IManagementInfoData } from "@/types/auth/legal";

const formSchema = z.object({
  firstNameCeo: z
    .string()
    .min(2, { message: "Введите имя генерального директора!" })
    .max(50),
  lastNameCeo: z
    .string()
    .min(2, { message: "Введите фамилию генерального директора" })
    .max(50),
  middleNameCeo: z
    .string()
    .min(2, { message: "Введите отчество генерального директора!" })
    .max(50), // father name to be precise
  firstNameAccountant: z
    .string()
    .min(2, { message: "Введите имя бухгалтера!" })
    .max(50),
  lastNameAccountant: z
    .string()
    .min(2, { message: "Введите фамилию бухгалтера" })
    .max(50),
  middleNameAccountant: z
    .string()
    .min(2, { message: "Введите отчество бухгалтера!" })
    .max(50),
  phone: phoneNumberSchema,
});

interface INextStep {
  setNext: React.Dispatch<React.SetStateAction<number>>;
  setManagementInfoData: React.Dispatch<
    React.SetStateAction<IManagementInfoData | undefined>
  >;
  setIsRegistered: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ManagementInfo({
  setNext,
  setManagementInfoData,
  setIsRegistered,
}: INextStep) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstNameCeo: "",
      lastNameCeo: "",
      middleNameCeo: "",
      firstNameAccountant: "",
      lastNameAccountant: "",
      middleNameAccountant: "",
      phone: "+7",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setNext(2);
    setManagementInfoData(values);
    setIsRegistered(true);
  };

  return (
    <>
      <div className="border-1 border-gray-200 px-4 py-4 rounded-xl shadow-xl">
        <h2 className="text-center text-lg font-semibold pb-4">
          Информация о владецльцах компании
        </h2>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 h-auto flex flex-col justify-between w-full sm:w-1/2 md:w-100"
          >
            {MANAGEMENT_INFO.map((inputField) => {
              return Object.keys(inputField).map((fieldName, index) => {
                return (
                  <FormField
                    key={index}
                    control={form.control}
                    name={fieldName}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{inputField[fieldName]}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={inputField[fieldName]}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  ></FormField>
                );
              });
            })}
            <div className="w-full flex justify-end">
              <Button className="cursor-pointer" type="submit">
                Отправить
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}
