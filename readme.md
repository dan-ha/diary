# Online Diary
Dummy project for Node.js learning purposes  

## Local Deployment - individual components
### Authentication Service
* Network - authent
  ```
  cd authnet
  sh buildauthnet.sh
  ```
* Database - MySql
  ```
  cd authnet
  sh startdb.sh
  ```
* User service
  ```
  cd users
  npm run docker-build
  cd ../authnet
  sh startserver.sh
  ```
  User authentication service will be available at http://localhost:3333/
### Diary
* Network - frontnet
  ```
  cd frontnet
  sh buildfrontnet.sh
  ```
* Database - MongoDb
  ```
  cd frontnet
  sh startdb.sh
  ```
* Diary
  ```
  cd diary
  npm run docker-build
  cd ../frontnet
  sh startserver.sh
  ```
### Connect networks
```
docker network connect frontnet  userauth
```
Diary webapp will be available at http://localhost:3000
## Local Deployment - Docker Compose
```
cd compose
docker-compose build
docker-compose up
# docker-compose down
```
Diary webapp will be available at http://localhost:3000
## Testing

## Deployment to Heroku

### User service  
```
cd users
heroku create
heroku addons:create cleardb:ignite
heroku container:push web
heroku container:release web
heroku open
```
### Diary
```
cd diary
heroku create
heroku addons:create mongolab:sandbox
heroku config:set USER_SERVICE_URL=https://<app>.herokuapp.com/
heroku container:push web
heroku container:release web
heroku open
```


