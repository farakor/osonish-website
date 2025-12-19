import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { SPECIALIZATIONS, PARENT_CATEGORIES } from "@/constants/registration";

interface CategoryStats {
  id: string;
  name: string;
  icon: string;
  count: number;
  minSalary: number | null;
  maxSalary: number | null;
  href: string;
}

// Дефолтная иконка для специализаций без своей иконки
const DEFAULT_ICON = "/icons/specializations/work.svg";

// Создаём маппинг specialization_id -> название и иконка
function getSpecializationInfo(specId: string): { name: string; icon: string } {
  // Ищем в подкатегориях
  const spec = SPECIALIZATIONS.find(s => s.id === specId);
  if (spec) {
    return {
      name: spec.name,
      icon: spec.iconName ? `/icons/specializations/${spec.iconName}.svg` : DEFAULT_ICON
    };
  }

  // Ищем в родительских категориях
  const parent = PARENT_CATEGORIES.find(p => p.id === specId);
  if (parent) {
    return {
      name: parent.name,
      icon: parent.iconName ? `/icons/specializations/${parent.iconName}.svg` : DEFAULT_ICON
    };
  }

  // Если не нашли, возвращаем сам ID как название
  return {
    name: specId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    icon: DEFAULT_ICON
  };
}

export async function GET() {
  try {
    const supabase = await createClient();

    // Получаем общую статистику вакансий
    const { count: totalCount } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("type", "vacancy")
      .in("status", ["new", "response_received"]);

    // Вакансии дня (созданные сегодня)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const { data: dailyVacancies, count: dailyCount } = await supabase
      .from("orders")
      .select("salary_from, salary_to", { count: "exact" })
      .eq("type", "vacancy")
      .in("status", ["new", "response_received"])
      .gte("created_at", today.toISOString());

    // Удаленная работа (work_format = 'remote')
    const { data: remoteVacancies, count: remoteCount } = await supabase
      .from("orders")
      .select("salary_from, salary_to", { count: "exact" })
      .eq("type", "vacancy")
      .in("status", ["new", "response_received"])
      .eq("work_format", "remote");

    // Подработка (employment_type = 'part-time')
    const { data: partTimeVacancies, count: partTimeCount } = await supabase
      .from("orders")
      .select("salary_from, salary_to", { count: "exact" })
      .eq("type", "vacancy")
      .in("status", ["new", "response_received"])
      .eq("employment_type", "part-time");

    // Получаем все уникальные специализации из активных вакансий
    const specializationStats = await getAllSpecializationsFromDB(supabase);

    // Формируем категории с реальными данными (без "Компании дня")
    const categories: CategoryStats[] = [
      // Вакансии дня - только если есть
      ...(dailyCount && dailyCount > 0 ? [{
        id: "vacancies_daily",
        name: "Вакансии дня",
        icon: "/icons/specializations/calendar-one-day.svg",
        count: dailyCount,
        minSalary: getMinSalary(dailyVacancies),
        maxSalary: getMaxSalary(dailyVacancies),
        href: "/vacancies?featured=daily",
      }] : []),
      // Удалённая работа - только если есть
      ...(remoteCount && remoteCount > 0 ? [{
        id: "remote_work",
        name: "Работа из дома",
        icon: "/icons/specializations/laptop.svg",
        count: remoteCount,
        minSalary: getMinSalary(remoteVacancies),
        maxSalary: getMaxSalary(remoteVacancies),
        href: "/vacancies?remote=true",
      }] : []),
      // Подработка - только если есть
      ...(partTimeCount && partTimeCount > 0 ? [{
        id: "part_time",
        name: "Подработка",
        icon: "/icons/specializations/work.svg",
        count: partTimeCount,
        minSalary: getMinSalary(partTimeVacancies),
        maxSalary: getMaxSalary(partTimeVacancies),
        href: "/vacancies?type=part-time",
      }] : []),
      // Все специализации из БД
      ...specializationStats,
    ];

    return NextResponse.json({
      categories,
      totalVacancies: totalCount || 0,
    });
  } catch (error) {
    console.error("Error fetching vacancy stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch vacancy statistics" },
      { status: 500 }
    );
  }
}

// Получаем все уникальные специализации из активных вакансий в БД
async function getAllSpecializationsFromDB(supabase: any): Promise<CategoryStats[]> {
  // Получаем все активные вакансии с их специализациями
  const { data: vacancies } = await supabase
    .from("orders")
    .select("specialization_id, salary_from, salary_to")
    .eq("type", "vacancy")
    .in("status", ["new", "response_received"])
    .not("specialization_id", "is", null); // Только вакансии с указанной специализацией

  if (!vacancies || vacancies.length === 0) {
    return [];
  }

  // Группируем по specialization_id
  const groupedStats: Record<string, {
    count: number;
    salaries: { from?: number; to?: number }[];
  }> = {};

  for (const vacancy of vacancies) {
    const specId = vacancy.specialization_id;
    if (!specId) continue;

    if (!groupedStats[specId]) {
      groupedStats[specId] = {
        count: 0,
        salaries: [],
      };
    }

    groupedStats[specId].count++;
    groupedStats[specId].salaries.push({
      from: vacancy.salary_from,
      to: vacancy.salary_to,
    });
  }

  // Преобразуем в массив CategoryStats
  const stats: CategoryStats[] = Object.entries(groupedStats).map(([specId, data]) => {
    const salaryData = data.salaries.map(s => ({ salary_from: s.from, salary_to: s.to }));
    const specInfo = getSpecializationInfo(specId);
    
    return {
      id: specId,
      name: specInfo.name,
      icon: specInfo.icon,
      count: data.count,
      minSalary: getMinSalary(salaryData),
      maxSalary: getMaxSalary(salaryData),
      href: `/vacancies?specialization=${specId}`,
    };
  });

  // Сортируем по количеству вакансий (от большего к меньшему)
  return stats.sort((a, b) => b.count - a.count);
}

function getMinSalary(data: { salary_from?: number; salary_to?: number }[] | null): number | null {
  if (!data || data.length === 0) return null;
  const salaries = data
    .map((v) => v.salary_from)
    .filter((s): s is number => s !== null && s !== undefined && s > 0);
  return salaries.length > 0 ? Math.min(...salaries) : null;
}

function getMaxSalary(data: { salary_from?: number; salary_to?: number }[] | null): number | null {
  if (!data || data.length === 0) return null;
  const salaries = data
    .map((v) => v.salary_to || v.salary_from)
    .filter((s): s is number => s !== null && s !== undefined && s > 0);
  return salaries.length > 0 ? Math.max(...salaries) : null;
}
