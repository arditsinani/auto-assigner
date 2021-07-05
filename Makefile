.PHONY: all init clone build rebuild up stop restart status

DC := docker-compose
DR := docker

all: up

status:
	@echo "*** Containers statuses ***"
	$(DC) ps

build: stop
	@echo "*** Building containers... ***"
	$(DC) build $(filter-out $@,$(MAKECMDGOALS))

build-back:
	@echo "*** Building back... ***"
	$(DC) build back

rebuild: stop
	@echo "*** Rebuilding containers... ***"
	$(DC) build --no-cache $(filter-out $@,$(MAKECMDGOALS))

up:
	@echo "*** Spinning up containers mom implementation... ***"
	$(DC) up -d $(filter-out $@,$(MAKECMDGOALS))
	@$(MAKE) --no-print-directory status

stop:
	@echo "*** Halting containers... ***"
	$(DC) stop
	@$(MAKE) --no-print-directory status

down:
	@echo "*** Removing containers... ***"
	$(DC) down
	@$(MAKE) --no-print-directory status

# Restart
restart:
	@echo "*** Restarting containers... ***"
	@$(MAKE) --no-print-directory stop
	@$(MAKE) --no-print-directory up

restart-back:
	@echo "*** Restarting back... ***"
	$(DC) restart back

console-back:
	$(DC) exec back sh

# Mongo shell
console-mongo:
	$(DR) exec -it mongo mongo

logs-back:
	$(DC) logs -f -t --tail 100 back

logs-mongo:
	$(DC) logs -f -t --tail 100 mongo

logs-rabbit:
	$(DC) logs -f -t --tail 100 rabbitmq

clean:
	@echo "*** Removing containers. All data will be lost!!!... ***"
	$(DC) down --rmi all
	@rm -rf mongo/db/*
	@rm -rf mongo/dump/*

populate-agents:
	$(DC) exec back npm run user:init
