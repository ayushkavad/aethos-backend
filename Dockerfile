# node image as the base image for the Dockerfile.
FROM node

# set the working directory to /app.
WORKDIR /app

# copies the package.json file to the working directory.
COPY package.json .

#  the npm install command to install the dependencies.
RUN npm install 

# copies all the files from the current directory to the working directory.
COPY . . 

# expose port 8080.
EXPOSE 8080

# Docker to run the npm start command when the container starts.
CMD [ "npm","start" ]
