
# Shopify Laravel app using docker compose

A simple laravel app for shopify using docker compose


## Installation
Clone project
```bash
  git clone https://github.com/deidax/wishlist-laravel-shopify-dev.git
```
Install laravel packages using composer

```bash
  cd wishlist-laravel-shopify-dev
```
```bash
  composer install
```
Install node modules using npm

```bash
  npm install
```
Create self-signed certificate ssl using [mkcert](https://github.com/FiloSottile/mkcert)
```bash
  cd ./nginx/certs
```
```bash
  mkcert "dev.myshopifyapp.com"
```
Install the CA from mkcert in your machine/browser

```bash
  mkcert --install
```
Add the app address to the hosts file (if you're using docker-machine make sure to use your VM IP address)

```bash
  127.0.0.1  dev.myshopifyapp.com
```
Create ssl key

```bash
  cd ../ssl
```
```bash
  openssl dhparam -out ./dhparam.pem 4096
```

## Environment Variables

copy .env.example and rename it .env

```bash
  cp ../../.env.example ../../.env
```

To run this project, you will need to update the following environment variables in your .env file

`APP_DOMAIN=dev.myshopifyapp.com`

`DB_DATABASE`

`DB_USERNAME`

`DB_PASSWORD`

`DB_ROOT_PASSWORD`

`SHOPIFY_APP_NAME`

`SHOPIFY_API_KEY`

`SHOPIFY_API_SECRET`


## Deployment

To deploy this project run

```bash
  cd ../../
```
```bash
  docker-compose build
```
```bash
  docker-compose up -d
```
Make sure that the containers are up and running
```bash
  docker-compose ps
```
Generate laravel key
```bash
  docker-compose exec app php artisan key:generate
```
Clear laravel config cache
```bash
  docker-compose exec app php artisan config:cache
```
Run Laravel migrations
```bash
  docker-compose exec app php artisan migrate
```
Now you can set up your shopify app.