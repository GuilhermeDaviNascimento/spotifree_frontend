'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { signUpSchema } from './schema';
import Link from 'next/link';

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUpForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = (data: SignUpFormData) => {
    console.log('Validated form data:', data);
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

      <div className="flex flex-col gap-5">
        <div>
          <Input placeholder="John Doe" {...register('name')} />
          {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
        </div>

        <div>
          <Input placeholder="john_doe@gmail.com" {...register('email')} />
          {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
        </div>

        <div>
          <Input placeholder="**********" type="password" {...register('password')} />
          {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
        </div>

        {/* <div className="flex flex-col gap-1 text-sm">
          <p>At least 8 characters</p>
          <p className="text-emphasis">At least one uppercase letter</p>
          <p className="text-emphasis">At least one lowercase letter</p>
          <p className="text-emphasis">At least one special character (e.g. !@#$%)</p>
        </div> */}

        <div>
          <Input placeholder="**********" type="password" {...register('confirmPassword')} />
          {errors.confirmPassword && (
            <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
          )}
        </div>

        <div>
          <Button className="w-40" type="submit">
            Sign Up
          </Button>
        </div>
      </div>
    </form>
  );
}
