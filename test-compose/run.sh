docker-compose stop

docker-compose build
docker-compose up --force-recreate -d
docker ps
docker network ls

sleep 20
docker exec -it --workdir /diaryapp/test -e DEBUG= diary-test npm install

docker exec -it --workdir /diaryapp/test -e DEBUG= diary-test npm run test-entries-memory
docker exec -it --workdir /diaryapp/test -e DEBUG= diary-test npm run test-entries-sequelize-sqlite
docker exec -it --workdir /diaryapp/test -e DEBUG= diary-test npm run test-entries-sequelize-mysql
docker exec -it --workdir /diaryapp/test -e DEBUG= diary-test npm run test-entries-mongodb


docker exec -it -e DEBUG= userauth-test npm install supertest mocha chai
docker exec -it -e DEBUG= userauth-test ./node_modules/.bin/mocha test.js

docker-compose stop