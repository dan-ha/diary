FROM node:10 

ENV DEBUG="diary:*" 
ENV SEQUELIZE_CONNECT="models/sequelize-docker-mysql.yaml" 
ENV ENTRIES_MODEL="sequelize" 
ENV USER_SERVICE_URL="http://userauth:3333" 
ENV PORT="3000" 
ENV NOTES_SESSIONS_DIR="/sessions" 
# ENV TWITTER_CONSUMER_KEY="..."
# ENV TWITTER_CONSUMER_SECRET="..."
# Use this line when the Twitter Callback URL
# has to be other than localhost:3000
# ENV TWITTER_CALLBACK_HOST=http://45.55.37.74:3000 

RUN mkdir -p /diaryapp /diaryapp/bin /diaryapp/public /diaryapp/routes /diaryapp/views
COPY bin/ /diaryapp/bin
COPY models/*.mjs models/sequelize-docker-mysql.yaml /diaryapp/models/
COPY public/ /diaryapp/public/
COPY routes/ /diaryapp/routes/
COPY views/ /diaryapp/views/
COPY app.mjs package.json /diaryapp/

WORKDIR /diaryapp
RUN apt-get update -y \
    && apt-get -y install curl python build-essential git ca-certificates \
    && npm install --unsafe-perm

# Uncomment to build the theme directory
# WORKDIR /notesapp/theme
# RUN npm run download && npm run build && npm run clean

WORKDIR /diaryapp

VOLUME /sessions 
EXPOSE 3000 
CMD node --experimental-modules ./bin/www.mjs