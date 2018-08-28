## Installation

- Create a `.env` file based on `.env.example` in the project root
- Set up a fresh mongo database, grab the connection string and set it as MONGODB_URI
- Set up a fresh redis instance, grab the connection string and set it as REDIS_URL

### Quickstart with docker

If you've got docker installed, you can run these commands to get set up quickly.

```
$ docker run --name line-db -p 127.0.0.1:27020:27017 -d mongo
$ docker run --name line-redis -d -p 127.0.0.1:63791:6379 redis
$ docker exec -ti line-db mongo admin
> db.createUser({ user: 'line', pwd: '1234', roles: [ { role: "userAdminAnyDatabase", db: "admin" } ] });
> exit
```

Once everything is set up you need only run this to get it started:

```
$ docker start line-db line-redis
```

Install dependencies with `yarn`

Develop with `yarn watch`
