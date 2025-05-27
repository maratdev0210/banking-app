// Signup page for employees of the bank

"use client";

import { z } from "zod";
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
import { createCashier } from "@/lib/signup";
import { ICashierData, CASHIER_INFO } from "@/types/auth/cashier";
import Link from "next/link";

const formSchema = z.object({
  firstName: z.string().min(2, { message: "Введите Ваше имя!" }).max(50),
  lastName: z.string().min(2, { message: "Введите Вашу фамилию" }).max(50),
  middleName: z.string().min(2, { message: "Введите Ваше отчество" }).max(50), // father name to be precise
  username: z.string().min(2, { message: "Придумайте логин!" }).max(20),
  password: z
    .string()
    .min(8, {
      message: "Пароль должен содержать минимум 8 символов",
    })
    .refine((pwd) => /\d/.test(pwd), {
      message: "Пароль должен содержать хотя бы одну цифру",
    }),
});

export default function Signup() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      middleName: "",
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch("/api/cashiers/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.error);
        return;
      }

      console.log("Кассир создан:", result);
    } catch (error) {
      console.error("Ошибка при регистрации кассира:", error);
    }
  };

  return (
    <>
      <div className="relative flex justify-center items-center h-lvh">
        <div className="w-110">
          <div className="border-1 border-gray-200 px-4 py-4 rounded-xl shadow-xl">
            <h2 className="text-center text-lg font-semibold pb-4">
              Основная информация
            </h2>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 h-auto flex flex-col justify-between w-full sm:w-1/2 md:w-100"
              >
                {CASHIER_INFO.map((inputField) => {
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
                        <Input
                          placeholder="Пароль"
                          {...field}
                          type="password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                ></FormField>
                <div className="w-full flex justify-end gap-4">
                  <Button className="cursor-pointer" type="submit">
                    Зарегистрироваться
                  </Button>
                  <Button className="cursor-pointer">
                    <Link href="/employee/login">Войти в аккаунт</Link>
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}
