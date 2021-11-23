service_port:=3000
restify_port:=3001

start:
	docker run --name murph-writer --rm -it -v $(CURDIR):/usr/murph -p $(service_port):3000 murphyl/nodejs:latest npm run start

rest:
	docker run --name murph-writer --rm -it -v $(CURDIR):/usr/murph -p $(restify_port):3001 murphyl/nodejs:latest npm run restify

vm:
	docker run --name murph-writer --rm -it -v $(CURDIR):/usr/murph -p $(service_port):3000 -p $(restify_port):3001 murphyl/nodejs:latest