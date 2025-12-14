import type { Metadata } from "next";
import { 
  Users, 
  Briefcase, 
  FileText, 
  Building2, 
  TrendingUp, 
  Zap,
  MapPin,
  Phone,
  Mail,
  Globe
} from "lucide-react";

export const metadata: Metadata = {
  title: "О компании",
  description:
    "Osonish — платформа для поиска работы и исполнителей в Узбекистане. Быстро, надежно, удобно.",
};

const stats = [
  {
    icon: FileText,
    value: "10 тыс+",
    label: "откликов на заказы",
  },
  {
    icon: Briefcase,
    value: "5 тыс+",
    label: "активных заказов",
  },
  {
    icon: Users,
    value: "50 тыс+",
    label: "зарегистрированных пользователей",
  },
  {
    icon: Building2,
    value: "1000+",
    label: "проверенных исполнителей",
  },
  {
    icon: TrendingUp,
    value: "100 тыс+",
    label: "посетителей ежемесячно",
  },
  {
    icon: Zap,
    value: "15+",
    label: "категорий услуг",
  },
];

const offices = [
  {
    city: "Ташкент",
    address: "ул. Амира Темура, 107б, БЦ Poytaxt",
    phone: "+998 (71) 200-00-00",
    email: "info@osonish.uz",
  },
  {
    city: "Самарканд",
    address: "ул. Регистан, 15",
    phone: "+998 (66) 200-00-00",
    email: "samarkand@osonish.uz",
  },
  {
    city: "Бухара",
    address: "ул. Накшбанди, 20",
    phone: "+998 (65) 200-00-00",
    email: "bukhara@osonish.uz",
  },
  {
    city: "Фергана",
    address: "ул. Мустакиллик, 55",
    phone: "+998 (73) 200-00-00",
    email: "fergana@osonish.uz",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 pt-32 pb-16 text-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 text-4xl font-bold md:text-5xl">О компании</h1>
            <p className="text-lg leading-relaxed text-blue-50 md:text-xl">
              <strong>Osonish</strong> — ведущая платформа для поиска работы и
              исполнителей в Узбекистане. Мы создаем современные технологии для
              того, чтобы заказчики могли быстро найти профессионала, а
              исполнители — выгодные заказы и постоянную работу.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900">
              Osonish — это
            </h2>
          </div>
          <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="group rounded-2xl bg-white p-8 border border-[#DAE3EC] transition-all hover:border-blue-300"
                >
                  <div className="mb-4 flex items-center justify-center">
                    <div className="rounded-full bg-blue-50 p-4 group-hover:bg-blue-100">
                      <Icon className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="mb-2 text-3xl font-bold text-gray-900">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">
              Наша миссия
            </h2>
            <div className="space-y-6 text-lg leading-relaxed text-gray-700">
              <p>
                Мы верим, что каждый человек заслуживает достойную работу, а
                каждый бизнес — квалифицированных специалистов. Наша цель —
                сделать процесс поиска работы и найма простым, быстрым и
                эффективным.
              </p>
              <p>
                Платформа Osonish объединяет тысячи заказчиков и исполнителей по
                всему Узбекистану. Мы постоянно совершенствуем наши технологии,
                чтобы предоставить лучший сервис для всех пользователей.
              </p>
              <div className="grid gap-6 pt-8 md:grid-cols-2">
                <div className="rounded-lg bg-blue-50 p-6">
                  <h3 className="mb-3 text-xl font-semibold text-blue-900">
                    Для заказчиков
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="mr-2">✓</span>
                      <span>Быстрый поиск проверенных исполнителей</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">✓</span>
                      <span>Удобное управление заказами</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">✓</span>
                      <span>Система отзывов и рейтингов</span>
                    </li>
                  </ul>
                </div>
                <div className="rounded-lg bg-green-50 p-6">
                  <h3 className="mb-3 text-xl font-semibold text-green-900">
                    Для исполнителей
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="mr-2">✓</span>
                      <span>Доступ к тысячам заказов</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">✓</span>
                      <span>Создание профессионального портфолио</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">✓</span>
                      <span>Рост репутации и доходов</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contacts Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
              Наши офисы
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {offices.map((office, index) => (
                <div
                  key={index}
                  className="rounded-xl bg-white p-8 border border-[#DAE3EC] transition-all hover:border-blue-300"
                >
                  <div className="mb-4 flex items-center">
                    <MapPin className="mr-3 h-6 w-6 text-blue-600" />
                    <h3 className="text-2xl font-bold text-gray-900">
                      {office.city}
                    </h3>
                  </div>
                  <div className="space-y-3 text-gray-600">
                    <div className="flex items-start">
                      <Building2 className="mr-3 mt-1 h-5 w-5 flex-shrink-0 text-gray-400" />
                      <span>{office.address}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400" />
                      <a
                        href={`tel:${office.phone.replace(/\s/g, "")}`}
                        className="hover:text-blue-600"
                      >
                        {office.phone}
                      </a>
                    </div>
                    <div className="flex items-center">
                      <Mail className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400" />
                      <a
                        href={`mailto:${office.email}`}
                        className="hover:text-blue-600"
                      >
                        {office.email}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Main Contact */}
            <div className="mt-12 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-center text-white">
              <h3 className="mb-4 text-2xl font-bold">
                Единый телефон поддержки
              </h3>
              <a
                href="tel:+998712000000"
                className="mb-4 inline-block text-4xl font-bold hover:text-blue-100"
              >
                +998 (71) 200-00-00
              </a>
              <p className="text-blue-100">
                Звонок по Узбекистану бесплатный
              </p>
              <div className="mt-6 flex items-center justify-center gap-6">
                <a
                  href="mailto:info@osonish.uz"
                  className="flex items-center hover:text-blue-100"
                >
                  <Mail className="mr-2 h-5 w-5" />
                  info@osonish.uz
                </a>
                <a
                  href="https://osonish.uz"
                  className="flex items-center hover:text-blue-100"
                >
                  <Globe className="mr-2 h-5 w-5" />
                  osonish.uz
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-8 text-3xl font-bold text-gray-900">
              Мы сотрудничаем с
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-lg bg-gray-50 p-6">
                <Building2 className="mx-auto mb-4 h-12 w-12 text-blue-600" />
                <h3 className="mb-2 font-semibold text-gray-900">
                  Торгово-промышленная палата Узбекистана
                </h3>
              </div>
              <div className="rounded-lg bg-gray-50 p-6">
                <Users className="mx-auto mb-4 h-12 w-12 text-blue-600" />
                <h3 className="mb-2 font-semibold text-gray-900">
                  Ассоциация предпринимателей
                </h3>
              </div>
              <div className="rounded-lg bg-gray-50 p-6">
                <Globe className="mx-auto mb-4 h-12 w-12 text-blue-600" />
                <h3 className="mb-2 font-semibold text-gray-900">
                  IT Park Uzbekistan
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
              Наши ценности
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                  <Zap className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-gray-900">
                  Скорость
                </h3>
                <p className="text-gray-600">
                  Мгновенный поиск и быстрые отклики на заказы
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-gray-900">
                  Надежность
                </h3>
                <p className="text-gray-600">
                  Проверенные исполнители и безопасные сделки
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-gray-900">
                  Рост
                </h3>
                <p className="text-gray-600">
                  Постоянное развитие платформы и возможностей
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold">
            Присоединяйтесь к Osonish сегодня!
          </h2>
          <p className="mb-8 text-xl text-blue-100">
            Найдите работу мечты или наймите лучших специалистов
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/auth/register"
              className="rounded-lg bg-white px-8 py-3 font-semibold text-blue-600 transition-all hover:bg-blue-50"
            >
              Начать работу
            </a>
            <a
              href="/orders"
              className="rounded-lg border-2 border-white px-8 py-3 font-semibold text-white transition-all hover:bg-white hover:text-blue-600"
            >
              Посмотреть заказы
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

