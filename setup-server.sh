#!/bin/bash

################################################################################
# Скрипт автоматической настройки Ubuntu сервера для Osonish Website
# Использование: bash setup-server.sh
# Запускать от имени пользователя с sudo правами (не root)
################################################################################

# Цвета
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Конфигурация
NODE_VERSION="20"
DOMAIN="oson-ish.uz"
WWW_DOMAIN="www.oson-ish.uz"
APP_PORT="3000"
PROJECT_NAME="osonish-2"
APP_NAME="osonish-website"

log() {
    echo -e "${2}${1}${NC}"
}

check_status() {
    if [ $? -eq 0 ]; then
        log "✓ $1" "${GREEN}"
    else
        log "✗ $1 - ОШИБКА!" "${RED}"
        exit 1
    fi
}

# Проверка что не запущено от root
if [ "$EUID" -eq 0 ]; then 
    log "❌ Не запускайте этот скрипт от root!" "${RED}"
    log "Создайте пользователя deploy и запустите от его имени" "${YELLOW}"
    exit 1
fi

# Проверка наличия sudo
if ! sudo -v; then
    log "❌ У пользователя нет sudo прав!" "${RED}"
    exit 1
fi

log "========================================" "${BLUE}"
log "🚀 Настройка сервера для Osonish Website" "${BLUE}"
log "========================================" "${BLUE}"
echo ""

# 1. Обновление системы
log "📦 Обновление системы..." "${YELLOW}"
sudo apt update
check_status "apt update"
sudo apt upgrade -y
check_status "apt upgrade"

# 2. Установка базовых утилит
log "🔧 Установка базовых утилит..." "${YELLOW}"
sudo apt install -y curl wget git build-essential ufw fail2ban
check_status "Базовые утилиты установлены"

# 3. Установка Node.js
log "📦 Установка Node.js ${NODE_VERSION}..." "${YELLOW}"
if command -v node >/dev/null 2>&1; then
    CURRENT_NODE=$(node --version)
    log "Node.js уже установлен: ${CURRENT_NODE}" "${YELLOW}"
    read -p "Переустановить? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log "Пропуск установки Node.js" "${YELLOW}"
    else
        curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | sudo -E bash -
        sudo apt install -y nodejs
        check_status "Node.js установлен"
    fi
else
    curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | sudo -E bash -
    sudo apt install -y nodejs
    check_status "Node.js установлен"
fi

log "Node.js версия: $(node --version)" "${GREEN}"
log "npm версия: $(npm --version)" "${GREEN}"

# 4. Установка PM2
log "📦 Установка PM2..." "${YELLOW}"
if command -v pm2 >/dev/null 2>&1; then
    log "PM2 уже установлен: $(pm2 --version)" "${GREEN}"
else
    sudo npm install -g pm2
    check_status "PM2 установлен"
    log "PM2 версия: $(pm2 --version)" "${GREEN}"
fi

# 5. Установка Nginx
log "📦 Установка Nginx..." "${YELLOW}"
if command -v nginx >/dev/null 2>&1; then
    log "Nginx уже установлен" "${GREEN}"
else
    sudo apt install -y nginx
    check_status "Nginx установлен"
    sudo systemctl start nginx
    sudo systemctl enable nginx
    check_status "Nginx запущен и добавлен в автозагрузку"
fi

# 6. Настройка Firewall
log "🔥 Настройка Firewall..." "${YELLOW}"
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable
check_status "Firewall настроен"

# 7. Установка Certbot для SSL
log "🔒 Установка Certbot..." "${YELLOW}"
if command -v certbot >/dev/null 2>&1; then
    log "Certbot уже установлен" "${GREEN}"
else
    sudo apt install -y certbot python3-certbot-nginx
    check_status "Certbot установлен"
fi

# 8. Создание структуры директорий
log "📁 Создание структуры директорий..." "${YELLOW}"
mkdir -p ~/projects
mkdir -p ~/backups
mkdir -p ~/logs
check_status "Директории созданы"

# 9. Настройка Git
log "🔧 Настройка Git..." "${YELLOW}"
read -p "Введите ваш Git email: " GIT_EMAIL
read -p "Введите ваше Git имя: " GIT_NAME

if [ -n "$GIT_EMAIL" ] && [ -n "$GIT_NAME" ]; then
    git config --global user.email "$GIT_EMAIL"
    git config --global user.name "$GIT_NAME"
    check_status "Git настроен"
else
    log "Git email и имя не указаны, пропуск" "${YELLOW}"
fi

# 10. Генерация SSH ключа для GitHub (опционально)
log "🔑 Генерация SSH ключа для GitHub..." "${YELLOW}"
if [ ! -f ~/.ssh/id_rsa ]; then
    read -p "Сгенерировать SSH ключ для GitHub? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        ssh-keygen -t rsa -b 4096 -C "$GIT_EMAIL" -f ~/.ssh/id_rsa -N ""
        check_status "SSH ключ сгенерирован"
        log "📋 Ваш публичный ключ:" "${YELLOW}"
        cat ~/.ssh/id_rsa.pub
        log "" "${NC}"
        log "Добавьте этот ключ в GitHub: https://github.com/settings/keys" "${YELLOW}"
        read -p "Нажмите Enter после добавления ключа в GitHub..."
    fi
else
    log "SSH ключ уже существует" "${GREEN}"
fi

# 11. Клонирование репозитория
log "📥 Клонирование репозитория..." "${YELLOW}"
cd ~/projects

if [ -d "$PROJECT_NAME" ]; then
    log "Репозиторий уже существует в ~/projects/${PROJECT_NAME}" "${YELLOW}"
    read -p "Пересклонировать? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        rm -rf "$PROJECT_NAME"
        read -p "Введите URL репозитория (SSH или HTTPS): " REPO_URL
        git clone "$REPO_URL"
        check_status "Репозиторий склонирован"
    fi
else
    read -p "Введите URL репозитория (SSH или HTTPS): " REPO_URL
    git clone "$REPO_URL"
    check_status "Репозиторий склонирован"
fi

cd "${PROJECT_NAME}/${APP_NAME}"

# 12. Создание .env.production
log "⚙️  Создание файла .env.production..." "${YELLOW}"
if [ -f ".env.production" ]; then
    log "Файл .env.production уже существует" "${YELLOW}"
    read -p "Перезаписать? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log "Пропуск создания .env.production" "${YELLOW}"
    else
        cat > .env.production << 'EOF'
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Eskiz SMS Configuration
ESKIZ_SMS_EMAIL=info@oson-ish.uz
ESKIZ_SMS_PASSWORD=your_password_here
NEXT_PUBLIC_ESKIZ_SMS_URL=https://notify.eskiz.uz/api
SMS_SENDER_NAME=OsonIsh

# App Configuration
NEXT_PUBLIC_APP_URL=https://oson-ish.uz
NODE_ENV=production
EOF
        log "✓ Шаблон .env.production создан" "${GREEN}"
        log "⚠️  ВАЖНО: Отредактируйте .env.production и добавьте реальные значения!" "${YELLOW}"
        read -p "Открыть для редактирования сейчас? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            nano .env.production
        fi
    fi
else
    cat > .env.production << 'EOF'
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Eskiz SMS Configuration
ESKIZ_SMS_EMAIL=info@oson-ish.uz
ESKIZ_SMS_PASSWORD=your_password_here
NEXT_PUBLIC_ESKIZ_SMS_URL=https://notify.eskiz.uz/api
SMS_SENDER_NAME=OsonIsh

# App Configuration
NEXT_PUBLIC_APP_URL=https://oson-ish.uz
NODE_ENV=production
EOF
    log "✓ Шаблон .env.production создан" "${GREEN}"
    log "⚠️  ВАЖНО: Отредактируйте .env.production и добавьте реальные значения!" "${YELLOW}"
    read -p "Открыть для редактирования сейчас? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        nano .env.production
    fi
fi

# 13. Установка зависимостей
log "📦 Установка npm зависимостей (это может занять несколько минут)..." "${YELLOW}"
npm install
check_status "Зависимости установлены"

# 14. Сборка приложения
log "🔨 Сборка приложения (это может занять несколько минут)..." "${YELLOW}"
npm run build
if [ $? -eq 0 ]; then
    check_status "Сборка завершена"
else
    log "⚠️  Ошибка сборки. Возможно, нужно проверить .env.production" "${YELLOW}"
    log "Вы можете запустить сборку позже: cd ~/projects/${PROJECT_NAME}/${APP_NAME} && npm run build" "${YELLOW}"
fi

# 15. Создание ecosystem.config.js для PM2
log "⚙️  Создание конфигурации PM2..." "${YELLOW}"
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: '${APP_NAME}',
    script: 'npm',
    args: 'start',
    cwd: '${HOME}/projects/${PROJECT_NAME}/${APP_NAME}',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: ${APP_PORT}
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    max_memory_restart: '1G',
    autorestart: true,
    watch: false
  }]
}
EOF
check_status "Конфигурация PM2 создана"

mkdir -p logs

# 16. Запуск приложения через PM2
log "🚀 Запуск приложения через PM2..." "${YELLOW}"
pm2 start ecosystem.config.js
check_status "Приложение запущено"

pm2 save
check_status "Конфигурация PM2 сохранена"

# 17. Настройка автозапуска PM2
log "⚙️  Настройка автозапуска PM2..." "${YELLOW}"
pm2 startup | tail -n 1 | bash
check_status "Автозапуск PM2 настроен"

# 18. Настройка Nginx
log "🌐 Настройка Nginx..." "${YELLOW}"
sudo tee /etc/nginx/sites-available/${APP_NAME} > /dev/null << EOF
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN} ${WWW_DOMAIN};

    client_max_body_size 10M;

    access_log /var/log/nginx/${APP_NAME}-access.log;
    error_log /var/log/nginx/${APP_NAME}-error.log;

    location / {
        proxy_pass http://localhost:${APP_PORT};
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 300;
        proxy_connect_timeout 300;
    }

    location /_next/static {
        proxy_pass http://localhost:${APP_PORT};
        proxy_cache_valid 60m;
        add_header Cache-Control "public, max-age=3600, immutable";
    }

    location /_next/image {
        proxy_pass http://localhost:${APP_PORT};
        proxy_cache_valid 60m;
    }
}
EOF
check_status "Конфигурация Nginx создана"

sudo ln -sf /etc/nginx/sites-available/${APP_NAME} /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

sudo nginx -t
check_status "Конфигурация Nginx проверена"

sudo systemctl reload nginx
check_status "Nginx перезагружен"

# 19. Установка SSL сертификата
log "🔒 Установка SSL сертификата..." "${YELLOW}"
log "⚠️  Убедитесь, что DNS записи для ${DOMAIN} и ${WWW_DOMAIN} указывают на этот сервер!" "${YELLOW}"
read -p "DNS настроены? Продолжить установку SSL? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    read -p "Введите email для уведомлений Let's Encrypt: " LETSENCRYPT_EMAIL
    sudo certbot --nginx -d ${DOMAIN} -d ${WWW_DOMAIN} --non-interactive --agree-tos --email ${LETSENCRYPT_EMAIL} --redirect
    if [ $? -eq 0 ]; then
        check_status "SSL сертификат установлен"
    else
        log "⚠️  Ошибка установки SSL. Проверьте DNS и повторите позже: sudo certbot --nginx -d ${DOMAIN} -d ${WWW_DOMAIN}" "${YELLOW}"
    fi
else
    log "SSL установка пропущена. Установите позже: sudo certbot --nginx -d ${DOMAIN} -d ${WWW_DOMAIN}" "${YELLOW}"
fi

# 20. Создание скрипта обновления
log "📝 Создание скрипта обновления..." "${YELLOW}"
if [ ! -f "deploy-update.sh" ]; then
    log "⚠️  Скрипт deploy-update.sh не найден в репозитории" "${YELLOW}"
    log "Создайте его вручную или скопируйте из документации" "${YELLOW}"
else
    chmod +x deploy-update.sh
    check_status "Скрипт обновления готов"
fi

# Итоговая информация
echo ""
log "========================================" "${GREEN}"
log "✅ Настройка сервера завершена!" "${GREEN}"
log "========================================" "${GREEN}"
echo ""
log "📊 Информация о системе:" "${BLUE}"
log "  • Node.js: $(node --version)" "${NC}"
log "  • npm: $(npm --version)" "${NC}"
log "  • PM2: $(pm2 --version)" "${NC}"
log "  • Nginx: $(nginx -v 2>&1 | cut -d'/' -f2)" "${NC}"
echo ""
log "📂 Пути:" "${BLUE}"
log "  • Проект: ~/projects/${PROJECT_NAME}/${APP_NAME}" "${NC}"
log "  • Логи: ~/projects/${PROJECT_NAME}/${APP_NAME}/logs" "${NC}"
log "  • Nginx конфиг: /etc/nginx/sites-available/${APP_NAME}" "${NC}"
echo ""
log "🔧 Полезные команды:" "${BLUE}"
log "  • Статус приложения:  pm2 status" "${NC}"
log "  • Логи приложения:    pm2 logs ${APP_NAME}" "${NC}"
log "  • Перезапуск:         pm2 restart ${APP_NAME}" "${NC}"
log "  • Обновление:         cd ~/projects/${PROJECT_NAME}/${APP_NAME} && ./deploy-update.sh" "${NC}"
log "  • Статус Nginx:       sudo systemctl status nginx" "${NC}"
log "  • Логи Nginx:         sudo tail -f /var/log/nginx/${APP_NAME}-error.log" "${NC}"
echo ""
log "🌐 Доступ к сайту:" "${BLUE}"
log "  • HTTP:  http://$(curl -s ifconfig.me)" "${NC}"
log "  • HTTPS: https://${DOMAIN} (после настройки DNS)" "${NC}"
echo ""
log "📚 Следующие шаги:" "${YELLOW}"
log "  1. Проверьте и отредактируйте .env.production с реальными значениями" "${NC}"
log "  2. Убедитесь, что DNS записи настроены" "${NC}"
log "  3. Установите SSL сертификат (если пропустили)" "${NC}"
log "  4. Проверьте работу сайта" "${NC}"
log "  5. Настройте мониторинг (опционально)" "${NC}"
echo ""
log "✨ Удачи с деплоем!" "${GREEN}"
echo ""

exit 0

