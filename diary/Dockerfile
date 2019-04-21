FROM node:10 

ENV DEBUG="diary:*" 
ENV LOCAL_MONGODB_URI="mongodb://db-diary:27017/Diary"
ENV LOCAL_USER_SERVICE_URL="http://userauth:3333" 
ENV PORT_LOCAL="3000" 
ENV PORT_PROD=$PORT
ENV NOTES_SESSIONS_DIR="/sessions" 

RUN mkdir -p /diaryapp /diaryapp/bin /diaryapp/components /diaryapp/models /diaryapp/public /diaryapp/routes /diaryapp/views
COPY bin/ /diaryapp/bin
COPY components/*.mjs /diaryapp/components/
COPY models/*.mjs /diaryapp/models/
COPY public/ /diaryapp/public/
COPY routes/ /diaryapp/routes/
COPY views/ /diaryapp/views/
COPY app.mjs package.json /diaryapp/

WORKDIR /diaryapp
RUN apt-get update -y \
    && apt-get -y install curl python build-essential git ca-certificates \
    && npm install --unsafe-perm

VOLUME /sessions 
EXPOSE 3000 
CMD node --experimental-modules ./bin/www.mjs