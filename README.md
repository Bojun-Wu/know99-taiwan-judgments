# Local Development
```shell
# Install the dependencies
npm install
composer install

# Setup the environment variables
cp .env.example .env

# Initialize the database/redis/typesense
docker-compose -f docker-compose.dev.yml up -d

# Run the migrations and seed the database
php artisan migrate:fresh --seed

# Import the verdict data(checkout app/Console/Commands/ImportVerdictsLocal.php for more details)
php artisan verdict:import-local

# Run the development server(MacOS/Linux)
composer run dev:ssr
```