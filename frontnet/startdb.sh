docker run --name db-diary \
    --volume `pwd`/diary-data:/data/db \
    --network frontnet \
    mongo:3.6-jessie