restify_port:=3000

start:
	docker run --name murph-writer --rm -it -v $(CURDIR):/usr/murph -v E:/restify:/usr/restify -e RESTIFY_PREFIX=/api -p $(restify_port):3000 murphyl/nodejs:latest npm run start

rest:
	docker run --name murph-writer --rm -it -v $(CURDIR):/usr/murph -e RESTIFY_PREFIX=/api -p $(restify_port):3001 murphyl/nodejs:latest npm run restify

vm:
	docker run --name murph-writer --rm -it -v $(CURDIR):/usr/murph -e RESTIFY_PREFIX=/api -p $(restify_port):3000 murphyl/nodejs:latest 