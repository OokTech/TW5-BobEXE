FROM node:lts-alpine AS build

RUN apk add git && \
git clone --depth=1 --branch docker https://github.com/OokTech/TW5-BobEXE.git BobEXE && \
git clone --depth=1 --branch v5.2.3 https://github.com/Jermolene/TiddlyWiki5.git && \
git clone --depth=1 https://github.com/OokTech/TW5-Bob.git /plugins/OokTech/Bob && \
git clone --depth=1 https://github.com/OokTech/TW5-TWederBob.git /plugins/OokTech/TwederBob

WORKDIR /BobEXE

RUN npm install

RUN node ./nexebuildAlpine.js

FROM alpine:latest

COPY --from=build /BobEXE/BobAlpine /BobAlpine

EXPOSE 8080

VOLUME /Bob

CMD ["BobAlpine", "--basePath=/Bob"]