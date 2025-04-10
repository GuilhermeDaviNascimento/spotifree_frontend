import Form from '@/components/Forms/login/login';

export default function Login() {
  return (
    <div className="bg-card rounded-4xl flex justify-between w-full h-full">
      <div className="w-1/2 bg-primary m-10 rounded-4xl"></div>
      <Form />
    </div>
  );
}
