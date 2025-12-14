'use client';

import { CityProvider } from '@/contexts/city-context';
import { ToastProvider } from '@/hooks/use-toast';
import { GeolocationPrompt } from '@/components/shared/geolocation-prompt';
import { ReactNode } from 'react';

type ClientProvidersProps = {
  children: ReactNode;
};

export function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <CityProvider>
      <ToastProvider>
        {children}
        <GeolocationPrompt />
      </ToastProvider>
    </CityProvider>
  );
}

