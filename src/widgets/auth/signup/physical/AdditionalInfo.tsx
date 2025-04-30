// form containing the fields regarding the client's gender,
// birth date, address, and his debtor status

"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import React from "react";
import { cn } from "@/lib/utils";

interface INextStep {
  setNext: React.Dispatch<React.SetStateAction<number>>;
}

const formSchema2 = z.object({
  //   birthDate: z.date({ required_error: "Укажите Вашу дату рождения!" }),
  address: z.string().min(2, { message: "Укажите Ваш адрес" }),
  gender: z.string().regex(/(?:Мужской|Женский)/, { message: "Выберите пол!" }),
  isDebtor: z.boolean(),
});

export default function AdditionalInfo({ setNext }: INextStep) {
  const form = useForm<z.infer<typeof formSchema2>>({
    resolver: zodResolver(formSchema2),
    defaultValues: {
      //   birthDate: new Date(),
      address: "",
      gender: "",
      isDebtor: false,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema2>) => {
    setNext(2);
    console.log(values);
  };

  return (
    <>
      <div>
        <Form {...form}>
          <form
            className="space-y-4 h-100 w-full sm:w-1/2 md:w-100"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Адрес проживания</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="г.Москва, улица Моховая, 5"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormField
              control={form.control}
              name="birthDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date of birth</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                      <Calendar
                        selected={field.value}
                        onSelect={field.onChange}
                        onDayClick={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

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
