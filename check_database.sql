-- Быстрая проверка таблиц для авторизации
-- Выполните этот скрипт в Supabase SQL Editor

-- 1. Проверяем, существуют ли таблицы
SELECT 
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
  AND table_name IN ('otp_codes', 'user_sessions', 'users')
ORDER BY table_name;

-- 2. Проверяем последние OTP коды
SELECT 
    phone,
    code,
    expires_at,
    created_at,
    CASE 
        WHEN expires_at > NOW() THEN '✅ Активен'
        ELSE '❌ Истек'
    END as status
FROM otp_codes 
ORDER BY created_at DESC 
LIMIT 5;

-- 3. Проверяем пользователей
SELECT 
    id,
    phone,
    first_name,
    last_name,
    role,
    is_verified,
    created_at
FROM users 
ORDER BY created_at DESC 
LIMIT 5;

-- 4. Проверяем сессии
SELECT 
    s.id,
    s.user_id,
    u.phone,
    s.expires_at,
    s.created_at,
    CASE 
        WHEN s.expires_at > NOW() THEN '✅ Активна'
        ELSE '❌ Истекла'
    END as status
FROM user_sessions s
LEFT JOIN users u ON s.user_id = u.id
ORDER BY s.created_at DESC 
LIMIT 5;

-- 5. Если таблиц нет, создайте их:
-- Раскомментируйте следующие строки если таблицы не существуют:

/*
-- Создание таблицы otp_codes
CREATE TABLE IF NOT EXISTS otp_codes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    phone VARCHAR(20) UNIQUE NOT NULL,
    code VARCHAR(6) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создание таблицы user_sessions
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Индексы
CREATE INDEX IF NOT EXISTS idx_otp_codes_phone ON otp_codes(phone);
CREATE INDEX IF NOT EXISTS idx_otp_codes_expires_at ON otp_codes(expires_at);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON user_sessions(expires_at);

-- Отключаем RLS
ALTER TABLE otp_codes DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions DISABLE ROW LEVEL SECURITY;
*/

-- 6. Очистка истекших записей (опционально)
-- DELETE FROM otp_codes WHERE expires_at < NOW();
-- DELETE FROM user_sessions WHERE expires_at < NOW();

