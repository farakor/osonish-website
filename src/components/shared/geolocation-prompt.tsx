'use client';

import { useState, useEffect } from 'react';
import { MapPin, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCity } from '@/hooks/use-city';

export function GeolocationPrompt() {
  const { requestGeolocation, isDetecting } = useCity();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Проверяем, был ли уже запрошен город
    const wasDetected = localStorage.getItem('osonish_city_detected');
    const wasDismissed = localStorage.getItem('osonish_geolocation_dismissed');
    
    // Показываем промпт только если еще не определяли город и не отклоняли
    if (!wasDetected && !wasDismissed) {
      // Показываем через 2 секунды после загрузки страницы
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAllow = async () => {
    setIsVisible(false);
    await requestGeolocation();
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem('osonish_geolocation_dismissed', 'true');
  };

  if (!isVisible || isDismissed) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md animate-in slide-in-from-bottom-4">
      <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-5">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <MapPin className="h-5 w-5 text-blue-600" />
          </div>
          
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">
              Определить ваш город?
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Разрешите доступ к геолокации, чтобы мы могли автоматически определить ваш город и показывать релевантные вакансии и заказы.
            </p>
            
            <div className="flex gap-2">
              <Button
                onClick={handleAllow}
                disabled={isDetecting}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                {isDetecting ? 'Определяем...' : 'Разрешить'}
              </Button>
              <Button
                onClick={handleDismiss}
                variant="outline"
                className="flex-1"
              >
                Нет, спасибо
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}













































