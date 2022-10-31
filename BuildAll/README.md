# BuildAll

Building the Dockerfile in this folder will create an image that contains the BobEXE executables for Linux, Windows and OSX.

It has a volume called `dist` that you can connect to a folder on the host machine and copy the executables out of the container.

## How?

in the BuildAll folder run

```
docker build -t bobbuild .
```

then start the container with the /dist volume mounted somewhere on the host machine. The container will copy the binaries into the dist volume, then stop the contaier and you have your stuff.