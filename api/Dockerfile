FROM node:12
WORKDIR /usr/src/app
RUN npm install -g nodemon
ENV TZ=Africa/Casablanca
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
RUN apt-get install ca-certificates
RUN openssl req -x509 -nodes -days 365 \
    -subj  "/C=MA/ST=CASA/O=hyperTube Inc/CN=hyperTube.app" \
     -newkey rsa:2048 -keyout /etc/ssl/private/hypertube.key \
     -out /etc/ssl/certs/hypertube.crt
CMD ["npm", "start"]