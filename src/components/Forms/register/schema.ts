import { z } from 'zod';

export const signUpSchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    cep: z
      .string()
      .min(8, 'CEP must be exactly 8 characters')
      .max(8, 'CEP must be exactly 8 characters')
      .regex(/^\d+$/, 'CEP must contain only numbers'), // Verifica se o CEP contém apenas números
    logradouro: z.string().min(1, 'Street is required'),
    numero: z.string().min(1, 'Number is required'),
    complemento: z.string().optional(),
    bairro: z.string().min(1, 'Neighborhood is required'),
    municipio: z.string().min(1, 'City is required'),
    uf: z.string().min(1, 'State is required'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Must contain at least one lowercase letter')
      .regex(/[^a-zA-Z0-9]/, 'Must contain at least one special character'),
    confirmPassword: z.string().min(1, 'Confirm password is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
