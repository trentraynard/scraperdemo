FROM php:8.1-fpm
# Set working directory
WORKDIR /var/www/
# Install any required PHP extensions
RUN apt-get update && apt-get install -y curl libcurl4-openssl-dev
# Copy files to container
COPY src/ /var/www/html
# Expose port 9000 for PHP-FPM
EXPOSE 9000