default:
    @just --list

# Start the development containers
up:
    docker compose up -d

# Stop the development containers
down:
    docker compose down

# Rebuild the docker containers
build:
    docker compose up --build -d

# Run Django database migrations
migrate:
    docker compose run --rm server uv run python manage.py migrate

# Generate new Django database migrations
makemigrations:
    docker compose run --rm server uv run python manage.py makemigrations

# Open a Django interactive shell
shell:
    docker compose run --rm server uv run python manage.py shell

# Create a Django superuser
createsuperuser:
    docker compose run --rm server uv run python manage.py createsuperuser

# View application logs
logs:
    docker compose logs -f server

test *apps:
    docker compose run --rm server uv run python manage.py test {{apps}}
