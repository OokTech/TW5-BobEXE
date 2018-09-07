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

The executables are listed here: https://github.com/OokTech/TW5-SingleExecutable/releases

When you run the executable it will create a wiki folder for you, start the
wiki server and then open up the wiki in your default browser.

After that it is the same as a normal tiddlywiki running Bob.

The default tiddler has some additional instructions.

# Below here is only developer stuff, you should ignore it.

## How to use this repo

- Clone the repo
- Initialise the sub-modules
- Install npm modules.
- Install the node pkg module
- Run `buildExecutables.sh`

## Repo Structure

Folders:

- `Bob/` the repo for the Bob plugin
- `TiddlyWiki5/` the repo for TiddlyWiki
- `editions/` just holds the index wiki edition used as the root wiki.
- `buildExecutables.sh` the script that builds the executables

## To get the repo at the correct version

git clone --branch v5.1.17 https://github.com/Jermolene/TiddlyWiki5.git --depth 1
