import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Send } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Image 
                src="/logo-osonish.svg" 
                alt="Osonish" 
                width={150} 
                height={32}
                className="h-8 w-auto"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Платформа для поиска работы и исполнителей в Узбекистане
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Send className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* For Customers */}
          <div>
            <h3 className="font-semibold mb-4">Для заказчиков</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/orders/create"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Создать заказ
                </Link>
              </li>
              <li>
                <Link
                  href="/workers"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Найти исполнителя
                </Link>
              </li>
              <li>
                <Link
                  href="/how-it-works"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Как это работает
                </Link>
              </li>
            </ul>
          </div>

          {/* For Workers */}
          <div>
            <h3 className="font-semibold mb-4">Для исполнителей</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/orders"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Найти работу
                </Link>
              </li>
              <li>
                <Link
                  href="/vacancies"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Вакансии
                </Link>
              </li>
              <li>
                <Link
                  href="/become-worker"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Стать исполнителем
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Поддержка</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  О нас
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Контакты
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Политика конфиденциальности
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Условия использования
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© 2026 Oson Ish. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}

