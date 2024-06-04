FROM php:8.1-fpm

# Set working directory
WORKDIR /var/www/

# Install any required PHP extensions
RUN apt-get update && apt-get install -y \ 
    libcurl4-openssl-dev \
    libxml2-dev \
    libxslt-dev \
    curl \
    zip\
    unzip\
    && docker-php-ext-install curl dom soap

# Add Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy the composer files and install dependencies
COPY composer.json composer.lock ./
RUN composer install --no-interaction

# Copy files to container
COPY src/ /var/www/html
COPY tests/ /var/www/html/tests

# Install Composer dependencies
RUN composer global require phpunit/phpunit --prefer-dist

# Add Composer's global bin directory to PATH
ENV PATH="/root/.composer/vendor/bin:${PATH}"

# Expose port 9000 for PHP-FPM
EXPOSE 9000