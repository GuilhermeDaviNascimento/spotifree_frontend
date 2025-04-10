import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Form() {
  return (
    <form className="flex flex-col gap-5 w-1/2 px-32 h-full justify-center">
      <div className="flex justify-between items-center">
        <p className="text-lg font-semibold">Logo</p>
        <div className="flex gap-1 text-sm">
          <p>New here?</p>
          <p className="text-emphasis cursor-pointer font-medium">Create an account</p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold">Sign In</h1>
        <p className="text-base text-muted-foreground">
          Welcome back! Please log in to your account.
        </p>
      </div>

      <div className="flex flex-col gap-5">
        <Input type="email" placeholder="john_doe@gmail.com" />
        <Input type="password" placeholder="**********" />

        <div className="text-sm text-right text-emphasis cursor-pointer">Forgot your password?</div>

        <div>
          <Button className='w-40'>Sign In</Button>
        </div>
      </div>
    </form>
  );
}
