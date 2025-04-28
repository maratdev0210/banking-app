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
import { MAIN_INFO } from "@/types/auth/physical";

const formSchema = z.object({
  firstName: z.string().min(2, { message: "Введите Ваше имя!" }).max(50),
  lastName: z.string().min(2, { message: "Введите Вашу фамилию" }).max(50),
  middleName: z.string().min(2, { message: "Введите Ваше отчество" }).max(50), // father name to be precise
  phone: phoneNumberSchema,
});

export default function MainInfo() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      middleName: "",
      phone: "+7",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                      <Input placeholder={inputField[fieldName]} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
            );
          });
        })}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
