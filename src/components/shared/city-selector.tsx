'use client';

import { useState } from 'react';
import { MapPin, ChevronDown, Search, Locate } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { useCity } from '@/contexts/city-context';
import { useTranslations, useLocale } from 'next-intl';
import { getCityName } from '@/constants/registration';
import { useMediaQuery } from '@/hooks/use-media-query';

export function CitySelector() {
  const t = useTranslations('citySelector');
  const locale = useLocale();
  const { currentCity, setCurrentCity, cities, requestGeolocation, isDetecting } = useCity();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Фильтруем города по поисковому запросу (ищем по локализованным названиям)
  const filteredCities = cities.filter(city => {
    const localizedName = getCityName(city.id, locale);
    return localizedName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleCitySelect = (city: typeof cities[number]) => {
    setCurrentCity({ id: city.id, name: city.name });
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleDetectLocation = async () => {
    await requestGeolocation();
    setIsOpen(false);
    setSearchQuery('');
  };

  const CityList = () => (
    <div className="mt-4">
      {/* Кнопка определения местоположения */}
      <Button
        onClick={handleDetectLocation}
        disabled={isDetecting}
        variant="outline"
        className="w-full mb-4 justify-start gap-2"
      >
        <Locate className="h-4 w-4" />
        {isDetecting ? t('detecting') : t('detectLocation')}
      </Button>

      {/* Поле поиска */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder={t('searchPlaceholder')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Список городов */}
      <div className="max-h-[60vh] overflow-y-auto space-y-1">
        {filteredCities.length > 0 ? (
          filteredCities.map((city) => (
            <button
              key={city.id}
              onClick={() => handleCitySelect(city)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                currentCity.id === city.id
                  ? 'bg-primary text-white'
                  : 'hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span className="font-medium">{getCityName(city.id, locale)}</span>
              </div>
            </button>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            {t('notFound')}
          </div>
        )}
      </div>
    </div>
  );

  // Мобильная версия с Sheet (выдвижная панель снизу)
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-gray-600 hover:text-gray-900 font-normal rounded-full gap-1 w-full justify-start"
          >
            {getCityName(currentCity.id, locale)}
            <ChevronDown className="h-4 w-4 ml-auto" />
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl">
          <SheetHeader>
            <SheetTitle>{t('title')}</SheetTitle>
          </SheetHeader>
          <CityList />
        </SheetContent>
      </Sheet>
    );
  }

  // Десктопная версия с Dialog
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="text-gray-600 hover:text-gray-900 font-normal rounded-full gap-1"
        >
          {getCityName(currentCity.id, locale)}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
        </DialogHeader>
        <CityList />
      </DialogContent>
    </Dialog>
  );
}
