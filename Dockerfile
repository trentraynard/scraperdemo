FROM php:8.1-fpm

# Set working directory
WORKDIR /var/www/

# Install any required PHP extensions
RUN docker-php-ext-install curl soap

COPY ../src /var/www/html
# Expose port 9000 for PHP-FPM
EXPOSE 9000