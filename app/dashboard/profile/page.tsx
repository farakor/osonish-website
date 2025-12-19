import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Container } from '@/components/shared/container';
import { ProfileForm } from '@/components/profile/profile-form';
import { getTranslations } from 'next-intl/server';

export const metadata = {
  title: 'Мой профиль - Osonish',
  description: 'Управление профилем',
};

export default async function ProfilePage() {
  const user = await getCurrentUser();
  const t = await getTranslations('profile');
  
  if (!user) {
    redirect('/auth/login');
  }

  return (
    <div className="pt-24 pb-8">
      <Container>
        <h1 className="text-3xl font-bold mb-8">{t('title')}</h1>
        <ProfileForm user={user} />
      </Container>
    </div>
  );
}

