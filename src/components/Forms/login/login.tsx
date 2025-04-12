'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

import { loginSchema } from './schema';

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    console.log('Login data:', data);
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
