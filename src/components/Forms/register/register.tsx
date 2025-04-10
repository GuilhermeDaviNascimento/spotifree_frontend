import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Form() {
  return (
    <form className="flex flex-col gap-5 w-1/2 px-32 h-full justify-center">
      <div className="flex justify-between items-center">
        <p className="text-lg font-semibold">Logo</p>
        <div className="flex gap-1 text-sm">
          <p>Already a member?</p>
          <p className="text-emphasis cursor-pointer font-medium">Sign in</p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold">Sign Up</h1>
        <p className="text-base text-muted-foreground">
          Create your account to get started with us today.
        </p>
      </div>

      <div className="flex flex-col gap-5">
        <Input type="text" placeholder="John Doe" />

        <Input type="email" placeholder="john_doe@gmail.com" />

        <Input type="password" placeholder="**********" />

        <div className="flex flex-col gap-1 text-sm">
          <p>At least 8 characters</p>
          <p className="text-emphasis">At least one uppercase letter</p>
          <p className="text-emphasis">At least one lowercase letter</p>
          <p className="text-emphasis">At least one special character (e.g. !@#$%)</p>
        </div>

        <Input type="password" placeholder="**********" />

        <div>
          <Button className="w-40">Sign Up</Button>
        </div>
      </div>
    </form>
  );
}
