# ---------------------------------------------------------------
# Laravel 12 backend — production image (Render, Railway, any Docker host)
# PHP 8.3 + Apache, document root = public/
# ---------------------------------------------------------------
FROM php:8.3-apache

# PHP extensions: MySQL, zip (composer), bcmath, opcache
RUN apt-get update \
 && apt-get install -y --no-install-recommends libzip-dev unzip \
 && docker-php-ext-install pdo_mysql zip bcmath opcache \
 && a2enmod rewrite headers \
 && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# PHP limits (uploads up to 200 MB) + Apache vhost listening on $PORT
COPY docker/php.ini /usr/local/etc/php/conf.d/zz-app.ini
COPY docker/apache-vhost.conf /etc/apache2/sites-available/000-default.conf
RUN echo 'Listen ${PORT}' > /etc/apache2/ports.conf \
 && echo 'ServerName localhost' >> /etc/apache2/apache2.conf

ENV PORT=10000 \
    APP_ENV=production \
    APP_DEBUG=false \
    LOG_CHANNEL=stderr \
    COMPOSER_ALLOW_SUPERUSER=1

WORKDIR /var/www/html

# Install PHP dependencies first (better layer caching)
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist --no-interaction --no-progress

# App code
COPY . .
RUN composer dump-autoload --optimize --no-dev \
 && mkdir -p storage/framework/cache/data storage/framework/sessions storage/framework/views \
             storage/logs storage/app/public bootstrap/cache \
 && chown -R www-data:www-data storage bootstrap/cache \
 && sed -i "s/\r$//" docker/entrypoint.sh \
 && chmod +x docker/entrypoint.sh

EXPOSE 10000
CMD ["docker/entrypoint.sh"]
