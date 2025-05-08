// Main information about the company
// includes company's name, type of business and address

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
import { COMPANY_INFO } from "@/types/auth/legal";

const companyInfoSchema = z.object({
  companyName: z
    .string()
    .min(4, { message: "Укажите название вашей компании!" })
    .max(50),
  address: z
    .string()
    .min(4, { message: "Укажите адрес вашей компании!" })
    .max(50),
  ownershipForm: z
    .string()
    .regex(/(?:Государственная|Частная|Иностранная|Смешанная)/, {
      message: "Выберите тип выашей компании",
    }),
});
import { ICompanyInfoData } from "@/types/auth/legal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COMPANY_OWNERSHIP } from "@/types/auth/legal";

interface INextStep {
  setNext: React.Dispatch<React.SetStateAction<number>>;
  setCompanyInfoData: React.Dispatch<
    React.SetStateAction<ICompanyInfoData | undefined>
  >;
}

export default function CompanyInfo({
  setNext,
  setCompanyInfoData,
}: INextStep) {
  const form = useForm<z.infer<typeof companyInfoSchema>>({
    resolver: zodResolver(companyInfoSchema),
    defaultValues: {
      companyName: "",
      address: "",
      ownershipForm: "",
    },
  });

  const onSubmit = (values: z.infer<typeof companyInfoSchema>) => {
    setNext(2);
    setCompanyInfoData(values);
  };

  return (
    <>
      <div className="border-1 border-gray-200 px-4 py-4 rounded-xl shadow-xl">
        <h2 className="text-center font-semibold text-xl pb-8">
          Основная информация о компании
        </h2>
        <Form {...form}>
          <form
            className="space-y-4 h-auto w-full sm:w-1/2 md:w-100 flex flex-col justify-between"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            {COMPANY_INFO.map((inputField) => {
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
              name="ownershipForm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Форма собственности</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите форму собственности" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {COMPANY_OWNERSHIP.map((value, index) => {
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
    </>
  );
}
