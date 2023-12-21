# MERN reddit clone backend

## Run backend

- start Docker Desktop
- `docker compose up` - database
- `npm run dev` - server

MongoDB runs in docker
I do not have docker desktop but can run docker from terminal with: `docker compose up`
Then visit `localhost:8081` to view the Mongo Express DB, view login in terminal. 


Init ts config: `npx tsc --init`

## Plan the project

Domain modelling
- Posts
  - Title
  - Link
  - Votes
- Users
  - User name
  - Password
- Comments

Okej to just the base, aka create buckets and how they could be connected, not what details they have. 

Plan the user
- what information do we need
  - Username
  - Password 

`docker compose up -d` - docker runs in the background
`docker compose down` - quit docker

## Build and Deploy

1. Create database on MongoDB Atlas
2. run `npm run build`
3. run `npm run start`
