restify_port:=8080
service_port:=3000
mongodb_port:=27017

start: restify
	docker run --name murph-writer-service --rm -it -v $(CURDIR):/usr/murph -p $(service_port):3000 -e REACT_APP_ENDPOINT=http://127.0.0.1:${restify_port} murphyl/nodejs:latest npm run start

vm: restify
	docker run --name murph-writer-service --rm -it -v $(CURDIR):/usr/murph -p $(service_port):3000 -e REACT_APP_ENDPOINT=http://127.0.0.1:${restify_port} murphyl/nodejs:latest 

restify:
	- docker run --name murph-writer-restify --rm -d -v $(CURDIR)/data:/usr/murph/mongo/data -p ${restify_port}:8080 -e RH_DATABASE=murph_x  -p $(mongodb_port):27017 murphyl/rest-mongo
