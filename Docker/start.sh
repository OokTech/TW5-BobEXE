#!/bin/sh

set -ex

if [ ! -d "/tiddlywiki" ]; then
  mkdir /tiddlywiki
fi

cd /tiddlywiki

if [ ! -f "BobLinux" ]; then
  mv /BobLinux BobLinux
fi

if [ ! -d "IndexWiki" ]; then
  cp -r /IndexWiki IndexWiki
fi

./BobLinux
