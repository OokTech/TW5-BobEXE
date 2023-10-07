cd BuildAll
docker build -t bobbuild .
mkdir dist
docker run --name tempbobbuild --mount type=bind,source="$(pwd)"/dist,target=/dist bobbuild
docker container rm tempbobbuild
docker image rm bobbuild
mv ./dist ../