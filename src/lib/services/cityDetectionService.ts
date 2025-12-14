import { City } from '@/contexts/city-context';
import { UZBEKISTAN_CITIES } from '@/constants/registration';

// Маппинг координат городов Узбекистана (приблизительно центр города)
const CITY_COORDINATES: Record<string, { lat: number; lon: number; radius: number }> = {
  'tashkent': { lat: 41.2995, lon: 69.2401, radius: 50 },
  'samarkand': { lat: 39.6542, lon: 66.9597, radius: 40 },
  'bukhara': { lat: 39.7747, lon: 64.4286, radius: 35 },
  'andijan': { lat: 40.7821, lon: 72.3442, radius: 30 },
  'jizzakh': { lat: 40.1158, lon: 67.8422, radius: 25 },
  'karshi': { lat: 38.8606, lon: 65.7975, radius: 30 },
  'navoi': { lat: 40.0844, lon: 65.3792, radius: 25 },
  'namangan': { lat: 40.9983, lon: 71.6726, radius: 30 },
  'termez': { lat: 37.2242, lon: 67.2783, radius: 25 },
  'sirdarya': { lat: 40.3867, lon: 68.7158, radius: 20 },
  'chirchik': { lat: 41.4686, lon: 69.5828, radius: 15 },
  'fergana': { lat: 40.3864, lon: 71.7864, radius: 35 },
  'urgench': { lat: 41.5500, lon: 60.6333, radius: 25 },
  'nukus': { lat: 42.4531, lon: 59.6103, radius: 30 },
};

/**
 * Вычисляет расстояние между двумя точками в километрах
 * Использует формулу гаверсинусов
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Радиус Земли в км
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Определяет ближайший город по координатам
 */
function findNearestCity(latitude: number, longitude: number): City | null {
  let nearestCity: City | null = null;
  let minDistance = Infinity;

  for (const [cityId, coords] of Object.entries(CITY_COORDINATES)) {
    const distance = calculateDistance(latitude, longitude, coords.lat, coords.lon);
    
    // Если находимся в радиусе города
    if (distance <= coords.radius && distance < minDistance) {
      minDistance = distance;
      const city = UZBEKISTAN_CITIES.find(c => c.id === cityId);
      if (city) {
        nearestCity = { id: city.id, name: city.name };
      }
    }
  }

  // Если не нашли город в радиусе, берем самый близкий
  if (!nearestCity) {
    for (const [cityId, coords] of Object.entries(CITY_COORDINATES)) {
      const distance = calculateDistance(latitude, longitude, coords.lat, coords.lon);
      if (distance < minDistance) {
        minDistance = distance;
        const city = UZBEKISTAN_CITIES.find(c => c.id === cityId);
        if (city) {
          nearestCity = { id: city.id, name: city.name };
        }
      }
    }
  }

  return nearestCity;
}

/**
 * Определяет город по геолокации браузера (наиболее точный метод)
 */
export function detectCityByGeolocation(): Promise<City | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      console.warn('Геолокация не поддерживается браузером');
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log('📍 Координаты:', latitude, longitude);
        
        const city = findNearestCity(latitude, longitude);
        if (city) {
          console.log('✅ Определен город по геолокации:', city.name);
        } else {
          console.warn('⚠️ Не удалось определить город по координатам');
        }
        resolve(city);
      },
      (error) => {
        console.warn('❌ Ошибка геолокации:', error.message);
        resolve(null);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 минут
      }
    );
  });
}

/**
 * Определяет город пользователя по IP адресу (запасной метод)
 * Использует бесплатный сервис ipapi.co
 */
export async function detectCityByIP(): Promise<City | null> {
  try {
    const response = await fetch('https://ipapi.co/json/', {
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('Ошибка при определении города по IP');
      return null;
    }

    const data = await response.json();
    console.log('🌐 Данные IP:', data.city, data.country_name);
    
    // Получаем название города из API
    const detectedCity = data.city?.toLowerCase();
    
    if (!detectedCity) {
      return null;
    }

    // Маппинг названий городов на разных языках
    const cityMapping: Record<string, string> = {
      'tashkent': 'tashkent',
      'ташкент': 'tashkent',
      'samarkand': 'samarkand',
      'самарканд': 'samarkand',
      'samarqand': 'samarkand',
      'bukhara': 'bukhara',
      'бухара': 'bukhara',
      'andijan': 'andijan',
      'андижан': 'andijan',
      'andijon': 'andijan',
      'jizzakh': 'jizzakh',
      'джизак': 'jizzakh',
      'jizzax': 'jizzakh',
      'karshi': 'karshi',
      'карши': 'karshi',
      'qarshi': 'karshi',
      'navoi': 'navoi',
      'навои': 'navoi',
      'navoiy': 'navoi',
      'namangan': 'namangan',
      'наманган': 'namangan',
      'termez': 'termez',
      'термез': 'termez',
      'termiz': 'termez',
      'sirdarya': 'sirdarya',
      'сырдарья': 'sirdarya',
      'chirchik': 'chirchik',
      'чирчик': 'chirchik',
      'chirchiq': 'chirchik',
      'fergana': 'fergana',
      'фергана': 'fergana',
      'farghona': 'fergana',
      'urgench': 'urgench',
      'ургенч': 'urgench',
      'urganch': 'urgench',
      'nukus': 'nukus',
      'нукус': 'nukus',
      'no\'kis': 'nukus',
    };

    const cityId = cityMapping[detectedCity];
    
    if (cityId) {
      const city = UZBEKISTAN_CITIES.find(c => c.id === cityId);
      if (city) {
        console.log('✅ Определен город по IP:', city.name);
        return { id: city.id, name: city.name };
      }
    }

    console.warn('⚠️ Город не найден в маппинге:', detectedCity);
    return null;
  } catch (error) {
    console.error('Ошибка при определении города по IP:', error);
    return null;
  }
}

