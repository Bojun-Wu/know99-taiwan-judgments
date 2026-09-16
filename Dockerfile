# Dockerfile for Laravel Backend
FROM php:8.2-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    nginx \
    supervisor \
    nodejs \
    npm \
    libpq-dev \
    git \
    zip \
    unzip \
    curl \
    dos2unix \
    unar \
    && docker-php-ext-install pdo pdo_pgsql \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy application files
COPY . .

# Install PHP dependencies
RUN composer install --no-scripts --optimize-autoloader

# Install frontend dependencies and build
RUN npm install && npm run build:ssr

# Create log directories and files
RUN mkdir -p \
    /var/log/nginx \
    /var/log/php-fpm \
    && touch /var/www/html/storage/logs/laravel.log

# Entrypoint script
COPY docker/entrypoint.sh /entrypoint.sh
RUN dos2unix /entrypoint.sh && chmod +x /entrypoint.sh

# Nginx configuration
COPY docker/nginx.conf /etc/nginx/nginx.conf

# Supervisor configuration
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# zzz-docker.conf
COPY docker/zzz-docker.conf /usr/local/etc/php-fpm.d/zzz-docker.conf

# set permissions
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Expose port
EXPOSE 80

# Use entrypoint script
ENTRYPOINT ["/entrypoint.sh"]
