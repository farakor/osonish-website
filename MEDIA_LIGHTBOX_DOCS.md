# MediaLightbox Component

## Описание
Компонент для просмотра изображений и видео в полноэкранном режиме с расширенным функционалом.

## Расположение
`/osonish-website/src/components/shared/media-lightbox.tsx`

## Возможности
- ✅ Просмотр изображений в полном размере
- ✅ Воспроизведение видео
- ✅ Навигация между медиафайлами
- ✅ Зум изображений (1x - 3x)
- ✅ Скачивание файлов
- ✅ Миниатюры для быстрой навигации
- ✅ Клавиатурное управление
- ✅ Адаптивный дизайн

## Использование

```typescript
import { MediaLightbox } from "@/components/shared/media-lightbox";
import { useState } from "react";

function MyComponent() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  
  const mediaFiles = [
    "https://example.com/image1.jpg",
    "https://example.com/video.mp4",
    "https://example.com/image2.jpg"
  ];

  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        {mediaFiles.map((media, index) => (
          <img
            key={index}
            src={media}
            alt={`Media ${index + 1}`}
            className="cursor-pointer"
            onClick={() => {
              setLightboxIndex(index);
              setLightboxOpen(true);
            }}
          />
        ))}
      </div>

      <MediaLightbox
        media={mediaFiles}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </>
  );
}
```

## Props

| Prop | Тип | Обязательный | Описание |
|------|-----|--------------|----------|
| `media` | `string[]` | Да | Массив URL изображений и видео |
| `initialIndex` | `number` | Да | Индекс медиафайла, с которого начать показ |
| `isOpen` | `boolean` | Да | Открыт ли lightbox |
| `onClose` | `() => void` | Да | Колбэк, вызываемый при закрытии |

## Управление

### Клавиатура
- `Esc` - закрыть lightbox
- `←` (Left Arrow) - предыдущий файл
- `→` (Right Arrow) - следующий файл

### Мышь/Тач
- Клик вне контента - закрыть
- Клик на стрелках - навигация
- Клик на миниатюре - переход к файлу
- Клик на Zoom In/Out - увеличить/уменьшить (только для изображений)
- Клик на Download - скачать текущий файл

## Определение типа медиа

Компонент автоматически определяет тип файла (видео или изображение) по:
- Расширению файла (.mp4, .mov, .webm и т.д.)
- Наличию слова "video" в URL

```typescript
const isVideo = /\.(mp4|mov|avi|mkv|webm|m4v|3gp|flv|wmv)(\?|$)/i.test(url) ||
  url.includes('video') ||
  url.includes('/video/') ||
  url.includes('_video_');
```

## Особенности

### Блокировка скролла
При открытии lightbox автоматически блокируется скролл основной страницы:
```typescript
document.body.style.overflow = "hidden";
```

### Автовоспроизведение видео
Видео автоматически начинают воспроизведение при открытии lightbox благодаря атрибуту `autoPlay`.

### Зум изображений
- Минимальный зум: 1x (100%)
- Максимальный зум: 3x (300%)
- Шаг: 0.25x (25%)
- Только для изображений (видео не зумятся)

### Миниатюры
- Отображаются внизу lightbox
- Активная миниатюра подсвечивается
- При клике происходит переход к соответствующему файлу
- Для видео показывается иконка play

## Стилизация

Компонент использует Tailwind CSS классы и может быть легко кастомизирован.

### Основные цвета
- Фон: `bg-black/95` (черный с 95% прозрачностью)
- Элементы управления: `text-white` на полупрозрачном черном фоне
- Hover эффекты: `hover:bg-white/10`

### Анимации
- Transitions на hover состояниях
- Scale эффект при hover на изображениях
- Плавное появление/скрытие элементов

## Адаптивность

- **Desktop**: Полный функционал с клавиатурной навигацией
- **Mobile**: Touch-friendly интерфейс, адаптивные размеры кнопок
- **Tablet**: Гибридный режим с поддержкой touch и клавиатуры

## Совместимость с Next.js

Компонент использует:
- `next/image` для оптимизации изображений
- `"use client"` директиву для client-side рендеринга
- React hooks (useState, useEffect)

## Производительность

- Изображения загружаются с `priority` флагом в lightbox
- Видео используют `preload="metadata"` для быстрой загрузки
- Миниатюры оптимизированы с `sizes="64px"`

## Пример интеграции с API

```typescript
function OrderDetail({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    fetch(`/api/orders/${orderId}`)
      .then(res => res.json())
      .then(data => setOrder(data.order));
  }, [orderId]);

  if (!order) return <div>Loading...</div>;

  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        {order.photos?.map((photo, index) => (
          <img
            key={index}
            src={photo}
            alt={`Photo ${index + 1}`}
            onClick={() => {
              setLightboxIndex(index);
              setLightboxOpen(true);
            }}
          />
        ))}
      </div>

      {order.photos && (
        <MediaLightbox
          media={order.photos}
          initialIndex={lightboxIndex}
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  );
}
```

## Troubleshooting

### Видео не воспроизводятся
- Проверьте CORS настройки сервера медиа
- Убедитесь, что формат видео поддерживается браузером
- Проверьте URL видео на валидность

### Изображения не загружаются
- Проверьте Next.js конфигурацию для внешних изображений
- Добавьте домены в `next.config.js`:
```javascript
images: {
  domains: ['your-domain.com'],
}
```

### Скролл не блокируется
- Убедитесь, что нет других стилей, переопределяющих `overflow`
- Проверьте z-index компонента (должен быть 50)

## Дата создания
21 декабря 2025 года

