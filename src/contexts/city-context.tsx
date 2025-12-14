'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UZBEKISTAN_CITIES } from '@/constants/registration';
import { detectCityByGeolocation, detectCityByIP } from '@/lib/services/cityDetectionService';

export type City = {
  id: string;
  name: string;
};

type CityContextType = {
  currentCity: City;
  setCurrentCity: (city: City) => void;
  cities: typeof UZBEKISTAN_CITIES;
  isDetecting: boolean;
  requestGeolocation: () => Promise<void>;
};

const CityContext = createContext<CityContextType | undefined>(undefined);

const CITY_STORAGE_KEY = 'osonish_selected_city';
const CITY_DETECTED_KEY = 'osonish_city_detected';

// Город по умолчанию
const DEFAULT_CITY: City = {
  id: 'tashkent',
  name: 'Ташкент'
};

export function CityProvider({ children }: { children: React.ReactNode }) {
  const [currentCity, setCurrentCityState] = useState<City>(DEFAULT_CITY);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);

  // Функция для запроса геолокации
  const requestGeolocation = async () => {
    setIsDetecting(true);
    try {
      const detectedCity = await detectCityByGeolocation();
      if (detectedCity) {
        setCurrentCityState(detectedCity);
        localStorage.setItem(CITY_STORAGE_KEY, JSON.stringify(detectedCity));
        console.log('✅ Город определен по геолокации:', detectedCity.name);
      } else {
        console.warn('⚠️ Не удалось определить город по геолокации, пробуем IP...');
        // Если геолокация не сработала, пробуем IP
        const cityByIP = await detectCityByIP();
        if (cityByIP) {
          setCurrentCityState(cityByIP);
          localStorage.setItem(CITY_STORAGE_KEY, JSON.stringify(cityByIP));
        }
      }
    } catch (error) {
      console.error('Ошибка при определении города:', error);
    } finally {
      localStorage.setItem(CITY_DETECTED_KEY, 'true');
      setIsDetecting(false);
    }
  };

  // Загрузка сохраненного города из localStorage при монтировании
  useEffect(() => {
    const initializeCity = async () => {
      const savedCity = localStorage.getItem(CITY_STORAGE_KEY);
      const wasDetected = localStorage.getItem(CITY_DETECTED_KEY);

      if (savedCity) {
        try {
          const city = JSON.parse(savedCity);
          setCurrentCityState(city);
          console.log('📍 Загружен сохраненный город:', city.name);
        } catch (error) {
          console.error('Ошибка при загрузке сохраненного города:', error);
        }
      } else if (!wasDetected) {
        // Если город не был сохранен и мы еще не пытались определить его автоматически
        console.log('🔍 Запускаем автоопределение города...');
        await requestGeolocation();
      }

      setIsInitialized(true);
    };

    initializeCity();
  }, []);

  // Функция для изменения города с сохранением в localStorage
  const setCurrentCity = (city: City) => {
    setCurrentCityState(city);
    localStorage.setItem(CITY_STORAGE_KEY, JSON.stringify(city));
    console.log('💾 Город сохранен:', city.name);
  };

  // Не рендерим детей до инициализации, чтобы избежать мигания
  if (!isInitialized) {
    return null;
  }

  return (
    <CityContext.Provider 
      value={{ 
        currentCity, 
        setCurrentCity, 
        cities: UZBEKISTAN_CITIES,
        isDetecting,
        requestGeolocation
      }}
    >
      {children}
    </CityContext.Provider>
  );
}

export function useCity() {
  const context = useContext(CityContext);
  if (context === undefined) {
    throw new Error('useCity должен использоваться внутри CityProvider');
  }
  return context;
}

