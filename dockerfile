### STAGE 1: Build ###
# We label our stage as ‘builder’
FROM node:19-bullseye as builder

COPY frontend/package.json frontend/package-lock.json ./

## Storing node modules on a separate layer will prevent unnecessary npm installs at each build
## RUN npm ci && mkdir /app && mv ./node_modules ./app
RUN npm i --legacy-peer-deps && mkdir /app && mv ./node_modules ./app

WORKDIR /app

COPY /frontend .

## Build the angular app in production mode and store the artifacts in dist folder
RUN npm run build:prod

### STAGE 2: Setup ###
FROM node:16-alpine

## channge directory
WORKDIR /app

#COPY api code to app folder
COPY /backend/ /app/

RUN npm ci

## From ‘builder’ copy published angular bundles in app/public
COPY --from=builder /app/dist /app/public
## expose port for express
EXPOSE 3000

CMD ["node",  "app.js"]