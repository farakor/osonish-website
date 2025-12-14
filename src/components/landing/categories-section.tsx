import Link from "next/link";
import {
  Hammer,
  Wrench,
  Sparkles,
  Truck,
  Home,
  Zap,
  Droplets,
  MoreHorizontal,
  Calendar,
  HardHat,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Container } from "../shared/container";

const categories = [
  {
    name: "Работа на 1 день",
    icon: Calendar,
    color: "text-red-500",
    bgColor: "bg-red-50",
    href: "/orders?category=one_day_job",
  },
  {
    name: "Ремонт и строительство",
    icon: HardHat,
    color: "text-orange-500",
    bgColor: "bg-orange-50",
    href: "/orders?category=repair_construction",
  },
  {
    name: "Сантехника",
    icon: Droplets,
    color: "text-cyan-500",
    bgColor: "bg-cyan-50",
    href: "/orders?category=plumbing",
  },
  {
    name: "Электрика",
    icon: Zap,
    color: "text-yellow-500",
    bgColor: "bg-yellow-50",
    href: "/orders?category=electrical",
  },
  {
    name: "Строительство",
    icon: Hammer,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
    href: "/orders?category=construction",
  },
  {
    name: "Уборка",
    icon: Sparkles,
    color: "text-purple-500",
    bgColor: "bg-purple-50",
    href: "/orders?category=cleaning",
  },
  {
    name: "Переезд",
    icon: Home,
    color: "text-indigo-500",
    bgColor: "bg-indigo-50",
    href: "/orders?category=moving",
  },
  {
    name: "Другое",
    icon: MoreHorizontal,
    color: "text-gray-500",
    bgColor: "bg-gray-50",
    href: "/orders",
  },
];

export function CategoriesSection() {
  return (
    <section className="pt-8 pb-8 md:pt-10 md:pb-10">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Популярные категории
          </h2>
          <p className="text-lg text-muted-foreground">
            Найдите нужные услуги или специалистов
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link key={category.name} href={category.href}>
                <Card className="border border-[#DAE3EC] hover:border-blue-300 transition-all cursor-pointer h-full">
                  <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                    <div
                      className={`w-16 h-16 rounded-full ${category.bgColor} flex items-center justify-center mb-4`}
                    >
                      <Icon className={`h-8 w-8 ${category.color}`} />
                    </div>
                    <h3 className="font-semibold">{category.name}</h3>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

