#!/bin/sh
# Container start: cache config with the real env vars, migrate, start Apache.
set -e
cd /var/www/html

# Render secret files (/etc/secrets/*) are readable by root only, but Apache runs as www-data.
# Copy the DB CA certificate to a readable location before caching config.
CA_COPY=/var/www/html/storage/db-ca.pem
if [ -n "$MYSQL_ATTR_SSL_CA" ] && [ -f "$MYSQL_ATTR_SSL_CA" ] && [ "$MYSQL_ATTR_SSL_CA" != "$CA_COPY" ]; then
  install -m 644 "$MYSQL_ATTR_SSL_CA" "$CA_COPY"
  export MYSQL_ATTR_SSL_CA="$CA_COPY"
fi

php artisan storage:link --force >/dev/null 2>&1 || true
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Safe to run on every deploy — only applies new migrations. Set RUN_MIGRATIONS=false to skip.
if [ "${RUN_MIGRATIONS:-true}" = "true" ]; then
  php artisan migrate --force
fi

chown -R www-data:www-data storage bootstrap/cache
exec apache2-foreground
