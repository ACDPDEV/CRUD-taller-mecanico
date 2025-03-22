'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { messages } from '@/constants/messages';

const FormSchema = z.object({
  plate: z
    .string()
    .regex(/^[a-zA-Z][0-9][a-zA-Z][0-9]{3}$/, {
      message: messages.validation.plateFormat,
    })
    .toUpperCase()
    .min(6, {
      message: messages.validation.minChars,
    }),
  owner: z.string().min(2, {
    message: messages.validation.minChars,
  }),
  mark: z.string().min(2, {
    message: messages.validation.minChars,
  }),
  model: z.string().min(2, {
    message: messages.validation.minChars,
  }),
  ruc: z.string().regex(/^\d{9}$|^\d{0}$/, {
    message: messages.validation.rucFormat,
  }),
});

export function Register() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      plate: '',
      owner: '',
      mark: '',
      model: '',
      ruc: '',
    },
  });

  // Cargar datos guardados al iniciar
  useEffect(() => {
    const savedFormData = localStorage.getItem('registerFormData');
    if (savedFormData) {
      const parsedData = JSON.parse(savedFormData);
      Object.keys(parsedData).forEach((key) => {
        form.setValue(key as keyof z.infer<typeof FormSchema>, parsedData[key]);
      });
    }
  }, []);

  // Guardar datos del formulario cuando cambien
  useEffect(() => {
    const subscription = form.watch((value) => {
      localStorage.setItem('registerFormData', JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [form]);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    // Aquí iría la lógica para guardar en la base de datos
    
    toast(messages.operations.submittedValues, {
      description: (
        <pre className="mt-2 w-[325px] rounded-md bg-slate-950 p-4 overflow-scroll">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
    
    // Limpiar el formulario después de enviar
    form.reset();
    
    // Limpiar datos guardados en localStorage
    localStorage.removeItem('registerFormData');
  }
  const [plate, setPlate] = useState('');
  useEffect(() => {
    setPlate(plate.toUpperCase());
  }, [plate]);

  return (
    <div className="flex flex-col gap-12 w-full h-fit justify-center items-center">
      <h1 className="text-4xl font-bold">{messages.labels.carRegistration}</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-3/4 space-y-6"
        >
          <FormField
            control={form.control}
            name="plate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{messages.labels.plate}</FormLabel>
                <FormControl>
                  <InputOTP
                    maxLength={6}
                    pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                    value={field.value}
                    onChange={(value) => field.onChange(value.toUpperCase())}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormDescription>
                  {messages.descriptions.uniquePlate}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="owner"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{messages.labels.ownerName}</FormLabel>
                <FormControl>
                  <Input placeholder={messages.placeholders.enterName} {...field} />
                </FormControl>
                <FormDescription>
                  {messages.descriptions.ownerName}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="mark"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{messages.labels.brand}</FormLabel>
                  <FormControl>
                    <Input placeholder={messages.placeholders.enterBrand} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{messages.labels.model}</FormLabel>
                  <FormControl>
                    <Input placeholder={messages.placeholders.enterModel} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="ruc"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{messages.labels.ruc}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={messages.placeholders.enterRuc}
                    {...field}
                    className="appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </FormControl>
                <FormDescription>
                  {messages.descriptions.rucOptional}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">{messages.labels.save}</Button>
        </form>
      </Form>
    </div>
  );
}
