import Form from '@/components/Forms/register/register';

export default function Register() {
  return (
    <div className="bg-card rounded-4xl flex justify-between w-full h-full">
      <Form />
      <div className="w-1/2 bg-primary m-10 rounded-4xl"></div>
    </div>
  );
}
