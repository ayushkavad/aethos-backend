# node image as the base image for the Dockerfile.
FROM node:20-alpine3.17

# expose port 8080.
EXPOSE 8080

# set the working directory to /app.
WORKDIR /app

# add tini
RUN apk add --no-cache tini

# copies the package.json and package-lock.json file to the working directory.
COPY package.json package-lock.json* ./

#  the npm install command to install the dependencies.
RUN npm install && npm clean cache --force

# copies all the files from the current directory to the working directory.
COPY . . 

# Tini is now available at /sbin/tini
ENTRYPOINT [ "/sbin/tini", "--" ]

# Docker to run the npm start command when the container starts.
CMD [ "npm","start" ]

