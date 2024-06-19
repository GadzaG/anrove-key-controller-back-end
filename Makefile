SITENAME = anrove-server
PORT = 4200
build:
	docker build -t anrove-server .
run:
	docker run $(SITENAME) -d -p $(PORT):$(PORT) --env-file ./.env --rm --name $(SITENAME)
