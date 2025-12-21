/**
 * Скрипт для обновления поля category в заказах
 * Запуск: node update-orders-category.js
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Загружаем переменные окружения вручную
function loadEnvFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    lines.forEach(line => {
      const match = line.match(/^([^=:#]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^["']|["']$/g, '');
        process.env[key] = value;
      }
    });
  } catch (error) {
    console.error(`⚠️  Не удалось загрузить ${filePath}`);
  }
}

// Загружаем .env.local или .env
const envFiles = ['.env.local', '.env'];
for (const envFile of envFiles) {
  const envPath = path.join(__dirname, envFile);
  if (fs.existsSync(envPath)) {
    console.log(`📄 Загружаем переменные из ${envFile}...\n`);
    loadEnvFile(envPath);
    break;
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Ошибка: не найдены переменные окружения SUPABASE');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateOrdersCategory() {
  console.log('🔄 Начинаем обновление категорий заказов...\n');

  try {
    // 1. Получаем все заказы, у которых category = "other" и есть specialization_id
    const { data: orders, error: fetchError } = await supabase
      .from('orders')
      .select('id, title, category, specialization_id')
      .eq('category', 'other')
      .not('specialization_id', 'is', null)
      .not('specialization_id', 'eq', '');

    if (fetchError) {
      console.error('❌ Ошибка при получении заказов:', fetchError);
      return;
    }

    console.log(`📊 Найдено заказов для обновления: ${orders.length}\n`);

    if (orders.length === 0) {
      console.log('✅ Все заказы уже актуальны!');
      return;
    }

    // 2. Обновляем каждый заказ
    let updated = 0;
    let failed = 0;

    for (const order of orders) {
      const { error: updateError } = await supabase
        .from('orders')
        .update({ category: order.specialization_id })
        .eq('id', order.id);

      if (updateError) {
        console.error(`❌ Не удалось обновить заказ ${order.id}:`, updateError.message);
        failed++;
      } else {
        console.log(`✅ Обновлен заказ: "${order.title}" (${order.id})`);
        console.log(`   category: "other" → "${order.specialization_id}"\n`);
        updated++;
      }
    }

    // 3. Итоговая статистика
    console.log('\n' + '='.repeat(50));
    console.log('📈 ИТОГОВАЯ СТАТИСТИКА:');
    console.log('='.repeat(50));
    console.log(`✅ Успешно обновлено: ${updated}`);
    console.log(`❌ Ошибок: ${failed}`);
    console.log(`📊 Всего обработано: ${orders.length}`);
    console.log('='.repeat(50) + '\n');

    // 4. Показываем статистику по категориям
    const { data: stats, error: statsError } = await supabase
      .from('orders')
      .select('category')
      .eq('type', 'daily')
      .in('status', ['new', 'response_received']);

    if (!statsError && stats) {
      const categoryCounts = stats.reduce((acc, order) => {
        acc[order.category] = (acc[order.category] || 0) + 1;
        return acc;
      }, {});

      console.log('📊 Статистика по категориям (активные заказы):');
      console.log('-'.repeat(50));
      Object.entries(categoryCounts)
        .sort((a, b) => b[1] - a[1])
        .forEach(([category, count]) => {
          console.log(`   ${category}: ${count}`);
        });
      console.log('-'.repeat(50));
    }

  } catch (error) {
    console.error('❌ Неожиданная ошибка:', error);
  }
}

// Запускаем скрипт
updateOrdersCategory()
  .then(() => {
    console.log('\n✅ Скрипт завершен!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Скрипт завершен с ошибкой:', error);
    process.exit(1);
  });

