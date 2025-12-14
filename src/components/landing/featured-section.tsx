"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Container } from "../shared/container";
import { 
  ArrowRight,
  Search,
  SlidersHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { FEATURED_SPECIALIZATIONS, MORE_SPECIALIZATIONS } from "@/constants/specializations";
import Image from "next/image";

export function FeaturedSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showMore, setShowMore] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/vacancies?q=${encodeURIComponent(searchQuery)}`;
    } else {
      window.location.href = "/vacancies";
    }
  };

  // Разделяем на две части: первые 8 и остальные 4
  const firstEight = FEATURED_SPECIALIZATIONS.slice(0, 8);
  const nextFour = FEATURED_SPECIALIZATIONS.slice(8, 12);
  const displayedSpecializations = showMore 
    ? [...FEATURED_SPECIALIZATIONS, ...MORE_SPECIALIZATIONS]
    : FEATURED_SPECIALIZATIONS;

  return (
    <section className="pt-16 pb-8 md:pt-20 md:pb-10 bg-gradient-to-b from-gray-50 to-white">
      <Container>
        {/* Header with Search */}
        <div className="mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            Поиск работы
          </h2>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-4">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Профессия, должность или компания"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-14 pl-12 text-base bg-white border-gray-300"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="h-14 px-5 border-gray-300"
              >
                <SlidersHorizontal className="h-5 w-5" />
              </Button>
              <Button 
                type="submit"
                size="lg" 
                className="px-10 h-14 text-base font-medium shadow-lg text-white"
              >
                Найти
              </Button>
            </div>
          </form>

          {/* Link to Employee Search */}
          <Link 
            href="/auth/register?type=employer" 
            className="text-sm text-gray-600 hover:text-gray-900 underline inline-block"
          >
            Я ищу сотрудника
          </Link>
        </div>

        {/* First 8 Specializations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {firstEight.map((spec) => (
            <Link key={spec.id} href={spec.href}>
              <Card className="border border-[#DAE3EC] hover:border-blue-300 hover:scale-[1.02] transition-all duration-200 cursor-pointer h-full">
                <CardContent className="p-5">
                  <div className="flex flex-col gap-3">
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                      <Image
                        src={spec.icon}
                        alt={spec.name}
                        width={32}
                        height={32}
                        className="object-contain"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex flex-col gap-1">
                      <h3 className="font-semibold text-base text-gray-900">
                        {spec.name}
                      </h3>
                      {spec.salary && (
                        <p className="text-sm text-gray-700 font-medium">
                          {spec.salary}
                        </p>
                      )}
                    </div>

                    {/* Count */}
                    {spec.count && (
                      <p className="text-sm text-gray-500 mt-auto">
                        {spec.count}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Next 4 Specializations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {nextFour.map((spec) => (
            <Link key={spec.id} href={spec.href}>
              <Card className="border border-[#DAE3EC] hover:border-blue-300 hover:scale-[1.02] transition-all duration-200 cursor-pointer h-full">
                <CardContent className="p-5">
                  <div className="flex flex-col gap-3">
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                      <Image
                        src={spec.icon}
                        alt={spec.name}
                        width={32}
                        height={32}
                        className="object-contain"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex flex-col gap-1">
                      <h3 className="font-semibold text-base text-gray-900">
                        {spec.name}
                      </h3>
                      {spec.salary && (
                        <p className="text-sm text-gray-700 font-medium">
                          {spec.salary}
                        </p>
                      )}
                    </div>

                    {/* Count */}
                    {spec.count && (
                      <p className="text-sm text-gray-500 mt-auto">
                        {spec.count}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* More Specializations (if expanded) */}
        {showMore && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {MORE_SPECIALIZATIONS.map((spec) => (
              <Link key={spec.id} href={spec.href}>
                <Card className="border border-[#DAE3EC] hover:border-blue-300 hover:scale-[1.02] transition-all duration-200 cursor-pointer h-full">
                  <CardContent className="p-5">
                    <div className="flex flex-col gap-3">
                      {/* Icon */}
                      <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                        <Image
                          src={spec.icon}
                          alt={spec.name}
                          width={32}
                          height={32}
                          className="object-contain"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex flex-col gap-1">
                        <h3 className="font-semibold text-base text-gray-900">
                          {spec.name}
                        </h3>
                        {spec.salary && (
                          <p className="text-sm text-gray-700 font-medium">
                            {spec.salary}
                          </p>
                        )}
                      </div>

                      {/* Count */}
                      {spec.count && (
                        <p className="text-sm text-gray-500 mt-auto">
                          {spec.count}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Expand/Collapse Button */}
        <div className="flex justify-center">
          <Button 
            variant="ghost" 
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 gap-1"
            onClick={() => setShowMore(!showMore)}
          >
            <span>{showMore ? "Свернуть" : "Развернуть"}</span>
            <ArrowRight 
              className={`h-4 w-4 transition-transform ${showMore ? 'rotate-90' : ''}`} 
            />
          </Button>
        </div>
      </Container>
    </section>
  );
}
