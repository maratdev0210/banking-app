"use client";

import { z } from "zod";
import { login } from "@/lib/login";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { phoneNumberSchema } from "@/lib/mobileValidation";
import { CLIENT_TYPE } from "@/types/auth/login";

export default function Login() {
  const formSchema = z.object({
    phone: phoneNumberSchema,
    password: z
      .string()
      .min(8, {
        message: "Ошибка входа!",
      })
      .refine((pwd) => /\d/.test(pwd), {
        message: "Ошибка входа!",
      }),
    clientType: z
      .string()
      .regex(/(?:Физическое|Юридическое)/, { message: "Укажите вид лица!" }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: "",
      password: "",
      clientType: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const result = await login(values);
    if (result) {
      toast("Вы вошли успешно!");
    }
  }

  return (
    <div className="relative flex justify-center items-center h-lvh">
      <div className="w-110 border-1 border-gray-200 px-4 py-4 rounded-xl shadow-xl">
        <div>
          <h2 className="text-center text-lg font-semibold pb-4">Войти</h2>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 h-auto flex flex-col justify-between w-full sm:w-1/2 md:w-100"
          >
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Телефон</FormLabel>
                  <FormControl>
                    <Input placeholder="+7" {...field} type="tel" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Пароль</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="clientType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Вид Лица</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите вид лица" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CLIENT_TYPE.map((value, index) => {
                        return (
                          <SelectItem key={index} value={value}>
                            {value}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <div className="w-full flex justify-end">
              <Button className="cursor-pointer" type="submit">
                Далее
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
