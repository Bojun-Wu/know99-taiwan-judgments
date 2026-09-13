#!/bin/sh

# database
php artisan migrate --force --no-interaction

# clear cache
php artisan optimize:clear

# optimize
php artisan optimize

# generate sitemap
php artisan sitemap:generate

# supervisor
/usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf