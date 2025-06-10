// app/login/page.tsx
'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

import { loginSchema } from './schema';

import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase'; // importa firebase configurado
import { useState } from 'react';

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');

  const onSubmit = async (data: LoginFormData) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      // Opcional: Obtenha o token JWT do usuário
      // const token = await user.getIdToken();
      // localStorage.setItem('token', token);

      console.log('Login bem-sucedido:', user);
      router.push('/'); // Redireciona para a página inicial
    } catch (error: any) {
      console.error('Erro ao fazer login:', error.message);
      if (error.code === 'auth/user-not-found') {
        setErrorMessage('Usuário não encontrado.');
      } else if (error.code === 'auth/wrong-password') {
        setErrorMessage('Senha incorreta.');
      } else if (error.code === 'auth/invalid-email') {
        setErrorMessage('Email inválido.');
      }
       else {
        setErrorMessage('Ocorreu um erro inesperado. Tente novamente.');
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
          <p>New here?</p>
          <Link href="/register" className="text-emphasis cursor-pointer font-medium">
            Create an account
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold">Sign In</h1>
        <p className="text-base text-muted-foreground">
          Welcome back! Please log in to your account.
        </p>
      </div>

      {errorMessage && (
        <p className="text-sm text-red-500 font-medium text-center">{errorMessage}</p>
      )}

      <div className="flex flex-col gap-5">
        <div>
          <Input type="email" placeholder="john_doe@gmail.com" {...register('email')} />
          {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
        </div>

        <div>
          <Input type="password" placeholder="**********" {...register('password')} />
          {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
        </div>

        <div className="text-sm text-right text-emphasis cursor-pointer">Forgot your password?</div>

        <div>
          <Button className="w-40" type="submit">
            Sign In
          </Button>
        </div>
      </div>
    </form>
  );
}
