# BuildAll

Building the Dockerfile in this folder will create an image that contains the BobEXE executables for Linux, Windows and OSX.

It has a volume called `dist` that you can connect to a folder on the host machine and copy the executables out of the container.

## How?

the quick version is in a terminal go into the `BuildAll` folder and then type this:

```
docker build -t bobbuild .
mkdir dist
docker run --mount type=bind,source="$(pwd)"/dist,target=/dist bobbuild
docker container rm bobbuild
```

## What it does

1. build the temporary docker container
    - this downloads a docker image with Nodejs and Alpine Linux
    - clones all the needed git repos
    - installs all of the dependencies
    - build executables using nexe
2. make a folder on the local machine called `dist` for the output
3. run the container to build the executables
    - this also copies the executables into the local `dist` folder
4. remove the container
