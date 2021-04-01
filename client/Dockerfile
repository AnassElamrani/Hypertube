FROM node:12
WORKDIR /usr/src/client
ENV TZ=Africa/Casablanca
RUN apt-get install ca-certificates
RUN openssl req -x509 -nodes -days 365 \
    -subj  "/C=MA/ST=CASA/O=hyperTube Inc/CN=hyperTube.app" \
     -newkey rsa:2048 -keyout /etc/ssl/private/hypertubesigned.key \
     -out /etc/ssl/certs/hyertubesigned.crt
CMD ["npm", "run", "dev"]