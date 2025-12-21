'use client';

import { useState, FormEvent } from 'react';
import { Send } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function ContactForm() {
  const t = useTranslations('contact');
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
      setError(t('errorAllFields'));
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
        throw new Error(result.error || t('errorSending'));
      }

      setSuccess(true);
      // Очищаем форму
      (e.target as HTMLFormElement).reset();
      
      // Скрываем сообщение об успехе через 5 секунд
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errorSending'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="mb-6 text-3xl font-bold text-gray-900">
        {t('writeToUs')}
      </h2>
      <p className="mb-8 text-gray-600">
        {t('writeToUsDesc')}
      </p>

      {success && (
        <div className="mb-6 rounded-lg bg-green-50 border border-green-200 p-4 text-green-800">
          {t('successMessage')}
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
            {t('yourName')}
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            disabled={loading}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder={t('yourNamePlaceholder')}
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            {t('phone')}
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            disabled={loading}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder={t('phonePlaceholder')}
          />
        </div>

        <div>
          <label
            htmlFor="subject"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            {t('subjectLabel')}
          </label>
          <select
            id="subject"
            name="subject"
            required
            disabled={loading}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">{t('selectSubject')}</option>
            <option value="Общий вопрос">{t('subjectGeneral')}</option>
            <option value="Техническая поддержка">{t('subjectTechnical')}</option>
            <option value="Корпоративные решения">{t('subjectCorporate')}</option>
            <option value="Партнерство">{t('subjectPartnership')}</option>
            <option value="Другое">{t('subjectOther')}</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="message"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            {t('messageLabel')}
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            required
            disabled={loading}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder={t('messagePlaceholder')}
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-all hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
        >
          <Send className="h-5 w-5" />
          {loading ? t('sending') : t('sendButton')}
        </button>
      </form>
    </div>
  );
}

