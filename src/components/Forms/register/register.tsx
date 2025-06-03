'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { signUpSchema } from './schema';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase'; // Firebase configurado

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUpForm() {
  const [step, setStep] = useState(1);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const cep = watch('cep');
  const logradouro = watch('logradouro');
  const bairro = watch('bairro');
  const municipio = watch('municipio');
  const uf = watch('uf');

  useEffect(() => {
    const fetchAddress = async () => {
      const cleanedCep = cep?.replace(/\D/g, '');
      if (cleanedCep?.length === 8) {
        try {
          const response = await fetch(`https://viacep.com.br/ws/${cleanedCep}/json/`);
          const data = await response.json();
          if (!data.erro) {
            setValue('logradouro', data.logradouro);
            setValue('bairro', data.bairro);
            setValue('municipio', data.localidade);
            setValue('uf', data.uf);
          }
        } catch (error) {
          console.error('Erro ao buscar endereço:', error);
        }
      }
    };

    if (step === 2) {
      fetchAddress();
    }
  }, [cep, setValue, step]);

  const onSubmit = async (data: SignUpFormData) => {
    setErrorMessage('');
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      // Atualiza nome do usuário no Firebase
      await updateProfile(userCredential.user, {
        displayName: data.name,
      });

      console.log('Usuário registrado com sucesso:', userCredential.user);
      router.push('/login');
    } catch (error: any) {
      console.error('Erro ao registrar:', error);
      const msg = error.message || 'Erro inesperado.';
      if (msg.includes('email-already-in-use')) {
        setErrorMessage('Este e-mail já está em uso.');
      } else {
        setErrorMessage(msg);
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-5 w-1/2 px-32 h-full justify-center"
    >
      <div className="flex justify-between items-center">
        <p className="text-lg font-semibold">Logo</p>
        <div className="flex gap-1 text-sm">
          <p>Already a member?</p>
          <Link href="./login" className="text-emphasis cursor-pointer font-medium">
            Sign in
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold">Sign Up</h1>
        <p className="text-base text-muted-foreground">
          Create your account to get started with us today.
        </p>
      </div>

      {errorMessage && (
        <p className="text-sm text-red-500 font-medium text-center">{errorMessage}</p>
      )}

      <div className="flex flex-col gap-5">
        {step === 1 && (
          <>
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="John Doe" {...register('name')} />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" placeholder="john_doe@gmail.com" {...register('email')} />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="**********"
                {...register('password')}
              />
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="**********"
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div>
              <Button type="button" onClick={() => setStep(2)} className="w-40">
                Next
              </Button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div>
              <Label htmlFor="cep">CEP</Label>
              <Input
                id="cep"
                maxLength={8}
                placeholder="00000000"
                {...register('cep')}
                onInput={(e) => {
                  const target = e.target as HTMLInputElement;
                  target.value = target.value.replace(/\D/g, '');
                }}
              />
              {errors.cep && <p className="text-sm text-red-500">{errors.cep.message}</p>}
            </div>

            <div className="flex justify-between gap-5">
              <div className="w-full">
                <Label htmlFor="logradouro">Street</Label>
                <Input
                  id="logradouro"
                  placeholder="Street"
                  value={logradouro}
                  disabled
                  {...register('logradouro')}
                />
                {errors.logradouro && (
                  <p className="text-sm text-red-500">{errors.logradouro.message}</p>
                )}
              </div>
              <div className="w-full">
                <Label htmlFor="numero">Number</Label>
                <Input id="numero" placeholder="Number" {...register('numero')} />
                {errors.numero && <p className="text-sm text-red-500">{errors.numero.message}</p>}
              </div>
            </div>

            <div className="flex gap-5">
              <div className="w-full">
                <Label htmlFor="complemento">Complement</Label>
                <Input
                  id="complemento"
                  placeholder="Complement (optional)"
                  {...register('complemento')}
                />
              </div>
              <div className="w-full">
                <Label htmlFor="bairro">Neighborhood</Label>
                <Input
                  id="bairro"
                  placeholder="Neighborhood"
                  value={bairro}
                  disabled
                  {...register('bairro')}
                />
                {errors.bairro && <p className="text-sm text-red-500">{errors.bairro.message}</p>}
              </div>
            </div>

            <div className="flex gap-5">
              <div className="w-full">
                <Label htmlFor="municipio">City</Label>
                <Input
                  id="municipio"
                  placeholder="City"
                  value={municipio}
                  disabled
                  {...register('municipio')}
                />
                {errors.municipio && (
                  <p className="text-sm text-red-500">{errors.municipio.message}</p>
                )}
              </div>
              <div className="w-full">
                <Label htmlFor="uf">State</Label>
                <Input id="uf" placeholder="State" value={uf} disabled {...register('uf')} />
                {errors.uf && <p className="text-sm text-red-500">{errors.uf.message}</p>}
              </div>
            </div>

            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button type="submit">Sign Up</Button>
            </div>
         
