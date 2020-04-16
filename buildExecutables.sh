#!/bin/bash

#pkg . --targets node10-win --output BobWin.exe
pkg . --targets latest-win --output BobWin.exe
#pkg . --targets node10-win-x86 --output BobWin32.exe
pkg . --targets latest-win-x86 --output BobWin32.exe
#pkg . --targets node10-macos --output BobOSX.command
pkg . --targets latest-macos --output BobOSX.command
#pkg . --targets node10-macos-x86 --output BobOSX32.command
pkg . --targets latest-macos-x86 --output BobOSX32.command
#pkg . --targets node10-linux --output BobLinux
pkg . --targets latest-linux --output BobLinux
#pkg . --targets node10-linux-x86 --output BobLinux32
pkg . --targets latest-linux-x86 --output BobLinux32
#pkg . --targets latest-linux-armv7 --output tiddlyArmV7
