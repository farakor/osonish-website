import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Container } from '@/components/shared/container';
import { SettingsForm } from '@/components/settings/settings-form';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata() {
  const t = await getTranslations('settings');
  return {
    title: `${t('title')} - Osonish`,
    description: t('mainSettings.description'),
  };
}

export default async function SettingsPage() {
  const user = await getCurrentUser();
  const t = await getTranslations('settings');
  
  if (!user) {
    redirect('/auth/login');
  }

  return (
    <div className="pt-24 pb-8">
      <Container>
        <h1 className="text-3xl font-bold mb-8">{t('title')}</h1>
        <SettingsForm user={user} />
      </Container>
    </div>
  );
}

