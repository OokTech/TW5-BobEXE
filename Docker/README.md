# Docker for BobLinux

This is a small dockerfile and script to support running BobLinux with docker.

## Build

`docker build -t boblinux .`

## Run

`docker run -ti -v $HOME/tiddlywiki:/tiddlywiki -p 8080:8080 -p 61192:61192 boblinux`

* `-v` - volume mount directory into container
* `-p` - Expose ports

## Things to know

* BobLinux is run from the `/tiddlywiki` directory inside the container.
* On boot `start.sh` will check for a settings file, and create a bootstraped one if it needs.
* BobLinux is downloaded from github releases.  `VERSION` can be changed in the `Dockerfile` or using `--build-arg` at build time
