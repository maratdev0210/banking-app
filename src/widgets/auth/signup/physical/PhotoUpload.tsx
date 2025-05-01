// Last step of authorization
// asking the client to upload his photo

"use client";

import { imageSchema } from "@/lib/imageValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function PhotoUpload() {
  const form = useForm<z.infer<typeof imageSchema>>({
    resolver: zodResolver(imageSchema),
  });

  const onSubmit = (data: z.infer<typeof imageSchema>) => {
    console.log(data);
  };

  return (
    <div className="border-1 border-gray-200 px-4 py-4 rounded-xl shadow-xl">
      <h2 className="text-center font-semibold text-lg pb-4">
        Загрузите Вашу фотографию
      </h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 h-auto flex flex-col justify-between w-full sm:w-1/2 md:w-100"
        >
          <FormField
            control={form.control}
            name="image"
            render={({ field: { value, onChange, ...fieldProps } }) => (
              <FormItem>
                <FormLabel>Фотография</FormLabel>
                <FormControl>
                  <Input
                    {...fieldProps}
                    placeholder="Фотография"
                    type="file"
                    accept="image/*, application/pdf"
                    onChange={(event) =>
                      onChange(event.target.files && event.target.files[0])
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="w-full flex justify-end">
            <Button className="cursor-pointer" type="submit">
              Отправить
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
