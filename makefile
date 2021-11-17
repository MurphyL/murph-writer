restify_port:=3000

start:
	docker run --name murph-writer --rm -it -v $(CURDIR):/usr/murph -p $(restify_port):3000 murphyl/nodejs:latest npm run start

rest:
	docker run --name murph-writer --rm -it -v $(CURDIR):/usr/murph -p $(restify_port):3001 murphyl/nodejs:latest npm run restify
