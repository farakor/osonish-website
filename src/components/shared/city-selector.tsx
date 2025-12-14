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
import { Input } from '@/components/ui/input';
import { useCity } from '@/contexts/city-context';

export function CitySelector() {
  const { currentCity, setCurrentCity, cities, requestGeolocation, isDetecting } = useCity();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Фильтруем города по поисковому запросу
  const filteredCities = cities.filter(city =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="text-gray-600 hover:text-gray-900 font-normal rounded-full gap-1"
        >
          <MapPin className="h-4 w-4" />
          {currentCity.name}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Выберите город</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          {/* Кнопка определения местоположения */}
          <Button
            onClick={handleDetectLocation}
            disabled={isDetecting}
            variant="outline"
            className="w-full mb-4 justify-start gap-2"
          >
            <Locate className="h-4 w-4" />
            {isDetecting ? 'Определяем...' : 'Определить мое местоположение'}
          </Button>

          {/* Поле поиска */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Поиск города..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Список городов */}
          <div className="max-h-[400px] overflow-y-auto space-y-1">
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
                    <span className="font-medium">{city.name}</span>
                  </div>
                </button>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                Город не найден
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

