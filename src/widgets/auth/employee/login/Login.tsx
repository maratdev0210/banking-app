"use client";

import { z } from "zod";
import { login } from "@/lib/login";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
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

export default function Login() {
  const formSchema = z.object({
    username: z.string().min(2, { message: "Придумайте логин!" }).max(20),
    password: z
      .string()
      .min(8, {
        message: "Ошибка входа!",
      })
      .refine((pwd) => /\d/.test(pwd), {
        message: "Ошибка входа!",
      }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      username: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch("/api/cashiers/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          login: values.username,
          password: values.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.error);
        return;
      }

      console.log("Кассир вошел в систему:", result);
    } catch (error) {
      console.error("Ошибка при входе в систему:", error);
    }
  };
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
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Логин</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="w-full flex justify-end gap-2 mt-4">
              <Button className="cursor-pointer" type="submit">
                Войти
              </Button>
              <Button className="cursor-pointer">
                <Link href="/employee/signup">Создать новый аккаунт</Link>
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
