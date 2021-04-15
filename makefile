CONTAINER=murph-writer

SERVE_PORT?=7500
FRONT_PORT?=7501

BINDING=-p $(SERVE_PORT):5000 -p $(FRONT_PORT):3000 -p 35740:35740

WORK_DIR=$(CURDIR)

restart:
	docker restart $(CONTAINER)

start: 
	docker run --name $(CONTAINER) -v $(WORK_DIR):/usr/murph $(BINDING) -e CHOKIDAR_USEPOLLING=true murphyl/nodejs sh -c "npm run dev"

install:
	docker run --rm -v $(WORK_DIR):/usr/murph murphyl/nodejs npm install