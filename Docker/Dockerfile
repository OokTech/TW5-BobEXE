FROM node

ARG VERSION=1.6.0

ADD https://github.com/OokTech/TW5-BobEXE/releases/download/${VERSION}/BobLinux /BobLinux
COPY IndexWiki /IndexWiki
COPY start.sh start.sh

RUN chmod +x BobLinux start.sh

CMD ["/start.sh"]
