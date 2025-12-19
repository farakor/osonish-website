'use client';

import { useState, FormEvent } from 'react';
import { Send } from 'lucide-react';

export function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      subject: formData.get('subject') as string,
      message: formData.get('message') as string,
    };

    // Клиентская валидация
    if (!data.name || !data.phone || !data.subject || !data.message) {
      setError('Пожалуйста, заполните все поля');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Произошла ошибка при отправке');
      }

      setSuccess(true);
      // Очищаем форму
      (e.target as HTMLFormElement).reset();
      
      // Скрываем сообщение об успехе через 5 секунд
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка при отправке');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="mb-6 text-3xl font-bold text-gray-900">
        Напишите нам
      </h2>
      <p className="mb-8 text-gray-600">
        Заполните форму ниже, и мы свяжемся с вами в ближайшее время.
      </p>

      {success && (
        <div className="mb-6 rounded-lg bg-green-50 border border-green-200 p-4 text-green-800">
          ✅ Сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4 text-red-800">
          ❌ {error}
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Ваше имя
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            disabled={loading}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="Введите ваше имя"
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Телефон
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            disabled={loading}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="+998 90 123 45 67"
          />
        </div>

        <div>
          <label
            htmlFor="subject"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Тема обращения
          </label>
          <select
            id="subject"
            name="subject"
            required
            disabled={loading}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">Выберите тему</option>
            <option value="Общий вопрос">Общий вопрос</option>
            <option value="Техническая поддержка">Техническая поддержка</option>
            <option value="Корпоративные решения">Корпоративные решения</option>
            <option value="Партнерство">Партнерство</option>
            <option value="Другое">Другое</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="message"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Сообщение
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            required
            disabled={loading}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="Опишите ваш вопрос или предложение..."
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-all hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
        >
          <Send className="h-5 w-5" />
          {loading ? 'Отправка...' : 'Отправить сообщение'}
        </button>
      </form>
    </div>
  );
}

