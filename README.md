# MERN reddit clone backend

## Run backend locally

- start Docker Desktop
- `docker compose up` - database
- `npm run dev` - server

### MongoDB runs in docker

I do not have docker desktop application (because linux) but can run docker from terminal with: `docker compose up`, but make sure it is set up correctly
Then visit `localhost:8081` to view the Mongo Express DB, view login in terminal. 

## Usefull commands

`docker images` - check existing docker images
`docker ps` - check running containers
`docker ps -a` - check non running containers
`docker compose up -d` - docker runs in the background
`docker compose down` - quit docker

Init ts config: `npx tsc --init`

`history` - check terminal commando history
`history | grep <command>` - check history for specific command
`!<history number>` - run command for specific history number 

## Build and Deploy

1. Create database on MongoDB Atlas
2. run `npm run build`
3. run `npm run start`
