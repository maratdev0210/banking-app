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
import { IMainInfoData, MAIN_INFO } from "@/types/auth/physical";
import React from "react";

const formSchema = z.object({
  firstName: z.string().min(2, { message: "Введите Ваше имя!" }).max(50),
  lastName: z.string().min(2, { message: "Введите Вашу фамилию" }).max(50),
  middleName: z.string().min(2, { message: "Введите Ваше отчество" }).max(50), // father name to be precise
  phone: phoneNumberSchema,
  password: z
    .string()
    .min(8, {
      message: "Пароль должен содержать минимум 8 символов",
    })
    .refine((pwd) => /\d/.test(pwd), {
      message: "Пароль должен содержать хотя бы одну цифру",
    }),
});

interface INextStep {
  setNext: React.Dispatch<React.SetStateAction<number>>;
  setMainInfoData: React.Dispatch<
    React.SetStateAction<IMainInfoData | undefined>
  >;
}

export default function MainInfo({ setNext, setMainInfoData }: INextStep) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      middleName: "",
      phone: "+7",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setNext(2); // go to the next step of a form
    setMainInfoData(values);
  };

  return (
    <>
      <div className="border-1 border-gray-200 px-4 py-4 rounded-xl shadow-xl">
        <h2 className="text-center text-lg font-semibold pb-4">
          Основная информация
        </h2>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 h-auto flex flex-col justify-between w-full sm:w-1/2 md:w-100"
          >
            {MAIN_INFO.map((inputField) => {
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
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Придумайте пароль</FormLabel>
                  <FormControl>
                    <Input placeholder="Пароль" {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            <div className="w-full flex justify-end">
              <Button className="cursor-pointer" type="submit">
                Далее
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}
