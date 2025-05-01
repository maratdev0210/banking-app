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
  FormDescription,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { IAdditionalInfoData } from "@/types/auth/physical";

interface INextStep {
  setNext: React.Dispatch<React.SetStateAction<number>>;
  setAdditionalInfoData: React.Dispatch<
    React.SetStateAction<IAdditionalInfoData | undefined>
  >;
}

const formSchema = z.object({
  birthDate: z.date({ required_error: "Укажите Вашу дату рождения!" }),
  address: z.string().min(2, { message: "Укажите Ваш адрес" }),
  gender: z.string().regex(/(?:Мужской|Женский)/, { message: "Выберите пол!" }),
  isDebtor: z.boolean(),
  isEmployee: z.boolean(),
});

export default function AdditionalInfo({
  setNext,
  setAdditionalInfoData,
}: INextStep) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      birthDate: new Date(),
      address: "",
      gender: "",
      isDebtor: false,
      isEmployee: false,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setNext(3);
    setAdditionalInfoData(values);
  };

  return (
    <>
      <div className="border-1 border-gray-200 px-4 py-4 rounded-xl shadow-xl">
        <h2 className="text-center font-semibold text-xl pb-8">
          Дополнительная информация
        </h2>
        <Form {...form}>
          <form
            className="space-y-4 h-auto w-full sm:w-1/2 md:w-100 flex flex-col justify-between"
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
            <div className="flex gap-4 justify-between">
              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem className="flex flex-1/2 flex-col">
                    <FormLabel>Дата рождения</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button variant={"outline"}>
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Выберите дату</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={
                            field.value ? new Date(field.value) : undefined
                          }
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Пол</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Укажите ваш пол" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Мужской">Мужской</SelectItem>
                        <SelectItem value="Женский">Женский</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="isDebtor"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Я не являюсь должником банка</FormLabel>
                    <FormDescription>
                      Если вы являетсь должником банка, сообщите об этом
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isEmployee"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Я не являюсь сотрудником банка</FormLabel>
                    <FormDescription>
                      Если вы являетсь сотрудником банка, укажите это
                    </FormDescription>
                  </div>
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
    </>
  );
}
