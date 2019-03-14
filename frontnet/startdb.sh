docker run --name db-diary --env MYSQL_RANDOM_ROOT_PASSWORD=true \
 --env MYSQL_USER=diary --env MYSQL_PASSWORD=diary \
 --env MYSQL_DATABASE=diary \
 --volume `pwd`/my.cnf:/etc/my.cnf \
 --volume `pwd`/../diary-data:/var/lib/mysql \
 --network frontnet mysql/mysql-server:5.7