# BobEXE

Single executable version of TiddlyWiki using Bob.

# This a version of tiddlywiki using the Bob plugin

It is packaged as a single executable so you don't need to install anything to
use the node version of tiddlywiki with multi-user support and the other
features of Bob.

- Tiddlywiki github repo https://github.com/Jermolene/TiddlyWiki5
- Bob github repo https://github.com/OokTech/TW5-Bob

# Instructions

Download the executable for your system and copy it to where you want your wiki
to be. And then run it. (On osx or linux you may have to make it executable)

The executables are listed here: https://github.com/OokTech/TW5-BobEXE/releases

When you run the executable it will create a wiki folder for you, start the
wiki server and then open up the wiki in your default browser.

After that it is the same as a normal tiddlywiki running Bob.

The default tiddler has some additional instructions.

## Advanced usage

If you start the executable from the command line than there are two possible
command line arguments. Both can be absolute or relative paths.

If relative the base path is relative to the location of the executable and the
index path is relative to the base path.

The base path defaults to the location of the executable and the index path
defaults to `./IndexWiki` and is relative to the base path.

If you use positional arguments then:

- The first argument is the location of the index wiki.
- The second argument is the base path for everything else.

Example:

```
BobLinux ./index/wiki/folder ~/base/path
```

If you use named arguments then:

- The index wiki path is given by `--indexPath`
- The base path is given by `--basePath`

Example:

```
BobLinux --indexPath=./index/wiki/folder --basePath=~/base/path
```

The base path is the folder where the `Wikis`, `Plugins`, `Themes` and
`Languages` folders are placed by default.

The index path is the location of the wiki to use as the root wiki.

# Building the executables using Docker

There are two Dockerfiles in the repo, one is to build a container that runs Bob using an Alpine base so it is only about 70mb. This is probably the easiest way to deploy bob if you are in an environment with Docker. The other makes a image that builds the executables for the different supported operating systems, when you run the image in a container it copies the resulting executables into the `dist` volume.

## Running Bob Using Docker

To build the image to run Bob use the docker file in the root folder of this repo.

```
docker build -t bobwiki .
```

the container exposes port `8080` so you can connect and has a volume called `/Bob` where all of the data is stored.
Because of how Docker exposes ports it has to always be set to share on the local network, so if you are runnig the container and don't want to share with the local network you have to specify the host when starting docker.
Also if you turn off the share on local network option you will have to manually edit the settings.json file in the indexwiki in order to be able to access the server again. All of the wikis and settings are saved in the persistent volume so restarting the container will not change it.

to start the container and serve the wikis on port 9090 using a named volume Wikis use:

```
docker run -p 9090:8080 --mount 'type=volume,src=Wikis,dist=/Bob' bobwiki
```

to run the container so only the host machine can access Bob bind the host ip address like this:

```
docker run -p 127.0.0.1:9090:8080 --mount 'type=volume,src=Wikis,dist=/Bob' bobwiki
```

In the container the folder `/Bob` contains more than just the wikis, in addition to the `Wikis` folder it has the `Plugins`, `Themes`, `Languages` and `Editions` folders, any plugins etc. that you copy into those folders are available to all of the wikis on the server.
If you use a bind mount instead of a named volume you have easy access to the contents of the folders.

## Building BobEXE Using Docker

To build the executables use the docker file in the `BuildAll` folder. First build the image using

```
cd BuildAll
docker build -t buildexecutables .
```

then once that is built run the container and it will copy the built executables into the `/dist` volume that you should mount somewhere on the host. Once the container has started and copied the files you should just stop it because it doesn't do anything else.

```
docker run --mount 'type=bind,src=/host/path,dst=/dist' buildexecutables
docker container stop buildexecutables
```

then the executables should be in the `/host/path` folder on the host computer.

# Below here is only developer stuff, you should ignore it.

## How to use this repo

- Clone the repo with submodules: `git clone --recurse-submodules https://github.com/OokTech/TW5-BobEXE.git`
- Install npm modules, `npm install`

to build the executables run:

- run `node ./nexebuild.js`

## Repo Structure

Folders:

- `plugins/` the repo for any plugins to be packaged with the executables. By default just the Bob plugin
  - `plugins/OokTech/Bob` - the submodule for the Bob plugin
  - `plugins/OokTech/TWederBob` - the submodule for the TWederBob plugin
- `editions/` just holds the index wiki edition used as the root wiki. By default just the edition for the IndexWiki
- `themes/` hold any themes to be packaged with the executables. By default empty
- `TiddlyWiki5/` the repo for TiddlyWiki as a submodule
- `nexebuild.js` the script that builds the executables

Any plugins, themes or editions added to the appropriate folders listed above
will be available to all wikis served. You still need to list the plugins in
the tiddlywiki.info file as usual, but you don't have to worry about setting
environment variables or anything like that if they are in the executable.

## To get the repo at the correct version

```
git clone --branch <<TagName>> <<RepoURI>> --depth 1
```

Example:

```
git clone --branch v5.1.17 https://github.com/Jermolene/TiddlyWiki5.git --depth 1
```
