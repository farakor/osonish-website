import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { SPECIALIZATIONS } from "@/constants/specializations-full";

interface CategoryStats {
  id: string;
  name: string;
  icon: string;
  count: number;
  minBudget: number | null;
  maxBudget: number | null;
  href: string;
}

const DEFAULT_ICON = "/icons/specializations/more.svg";

function getSpecializationInfo(specId: string): { name: string; icon: string } {
  const spec = SPECIALIZATIONS.find((s) => s.id === specId);
  if (spec) {
    return {
      name: spec.name,
      icon: spec.iconPath || DEFAULT_ICON,
    };
  }
  return {
    name: specId.split("_").map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(" "),
    icon: DEFAULT_ICON
  };
}

export async function GET() {
  try {
    const supabase = await createClient();

    // Получаем общую статистику заказов (только daily type)
    const { count: totalCount } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("type", "daily")
      .in("status", ["new", "response_received"]);

    // Получаем все уникальные специализации из активных заказов
    const specializationStats = await getAllSpecializationsFromDB(supabase);

    // Формируем категории с реальными данными (без "Заказы дня")
    const categories: CategoryStats[] = [
      // Все специализации из БД
      ...specializationStats,
    ];

    return NextResponse.json({
      categories,
      totalOrders: totalCount || 0,
    });
  } catch (error) {
    console.error("Error fetching order stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch order statistics" },
      { status: 500 }
    );
  }
}

// Получаем все уникальные специализации из активных заказов в БД
async function getAllSpecializationsFromDB(supabase: any): Promise<CategoryStats[]> {
  // Получаем все активные заказы с их специализациями
  const { data: orders } = await supabase
    .from("orders")
    .select("specialization_id, budget")
    .eq("type", "daily")
    .in("status", ["new", "response_received"])
    .not("specialization_id", "is", null); // Только заказы с указанной специализацией

  if (!orders || orders.length === 0) {
    return [];
  }

  // Группируем по specialization_id
  const groupedStats: Record<string, {
    count: number;
    budgets: number[];
  }> = {};

  for (const order of orders) {
    const specId = order.specialization_id;
    if (!specId) continue;

    if (!groupedStats[specId]) {
      groupedStats[specId] = {
        count: 0,
        budgets: [],
      };
    }

    groupedStats[specId].count++;
    if (order.budget) {
      groupedStats[specId].budgets.push(order.budget);
    }
  }

  // Преобразуем в массив CategoryStats
  const stats: CategoryStats[] = Object.entries(groupedStats).map(([specId, data]) => {
    const specInfo = getSpecializationInfo(specId);
    
    return {
      id: specId,
      name: specInfo.name,
      icon: specInfo.icon,
      count: data.count,
      minBudget: data.budgets.length > 0 ? Math.min(...data.budgets) : null,
      maxBudget: data.budgets.length > 0 ? Math.max(...data.budgets) : null,
      href: `/orders?specialization=${specId}`,
    };
  });

  // Сортируем по количеству заказов (от большего к меньшему)
  return stats.sort((a, b) => b.count - a.count);
}
