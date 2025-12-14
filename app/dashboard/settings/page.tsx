import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Container } from '@/components/shared/container';
import { SettingsForm } from '@/components/settings/settings-form';

export const metadata = {
  title: 'Настройки - Osonish',
  description: 'Настройки аккаунта',
};

export default async function SettingsPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/auth/login');
  }

  return (
    <div className="pt-24 pb-8">
      <Container>
        <h1 className="text-3xl font-bold mb-8">Настройки</h1>
        <SettingsForm user={user} />
      </Container>
    </div>
  );
}

