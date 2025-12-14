import { StepByStepRegistrationForm } from '@/components/auth/step-by-step-registration-form';

export default async function CompleteRegistrationPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const phone = typeof params.phone === 'string' ? params.phone : '';
  const email = typeof params.email === 'string' ? params.email : '';
  const redirectTo = typeof params.redirect === 'string' ? params.redirect : '/dashboard';

  if (!phone && !email) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Ошибка</h1>
          <p className="text-muted-foreground">Номер телефона или email не указан</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-24 pb-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Завершите регистрацию</h1>
        <p className="text-muted-foreground">
          Расскажите нам немного о себе
        </p>
      </div>
      
      <StepByStepRegistrationForm 
        phone={phone} 
        email={email}
        redirectTo={redirectTo}
      />
    </div>
  );
}
