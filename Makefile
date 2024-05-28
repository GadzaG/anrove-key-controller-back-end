SITENAME =anrove-server
PORT_FOR_DB = 5432
PORT = 4200

POSTGRES_USER = postgres
POSTGRES_DB = anrove_key_controller
POSTGRES_PASSWORD = 55Kirill55

build:
	docker build -t $(SITENAME) .

stop:
	docker stop $(SITENAME)
log:
	docker log $(SITENAME)

server:
	docker run -d -p $(PORT):$(PORT) --env-file ./.env --rm --name $(SITENAME)
db:
	docker run --name postgres -p $(PORT_FOR_DB):$(PORT_FOR_DB) -v ./pgdata:/var/lib/postgresql/data -e POSTGRES_PASSWORD=55Kirill55 -e POSTGRES_USER=postgres -e POSTGRES_DB=anrove_key_controller --rm -d postgres

