FROM node:lts-alpine AS build

RUN apk add git && \
git clone --depth=1 --branch docker https://github.com/OokTech/TW5-BobEXE.git BobEXE && \
git clone --depth=1 --branch v5.2.3 https://github.com/Jermolene/TiddlyWiki5.git /BobEXE/TiddlyWiki5 && \
git clone --depth=1 https://github.com/OokTech/TW5-Bob.git /BobEXE/plugins/OokTech/Bob && \
git clone --depth=1 https://github.com/OokTech/TW5-TWederBob.git /BobEXE/plugins/OokTech/TwederBob

WORKDIR /BobEXE

RUN npm install

RUN node ./nexebuild.js

VOLUME /dist

COPY CopyAll.sh /CopyAll.sh

WORKDIR /

CMD ["/bin/sh", "CopyAll.sh"]