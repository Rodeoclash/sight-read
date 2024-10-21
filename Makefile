stop-all:
	 bash ../scripts/docker-stop-all.sh

build:
	docker compose pull --ignore-pull-failures; \
	docker compose build;

setup: build
	docker compose run --no-deps --user=root:root --rm frontend mkdir -p /home/server; \
	docker compose run --no-deps --user=root:root --rm frontend chown -R 1000:1000 /home/server; \
	docker compose run --no-deps --user=root:root --rm frontend chown -R 1000:1000 /usr/src/app; \

install: setup
	docker compose run --no-deps --rm frontend npm install;

bash:
	docker compose run --rm frontend bash

bash-root:
	docker compose run --user=root:root --rm frontend bash

start:
	docker compose up;