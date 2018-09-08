#!/bin/bash

pkg . --targets latest-win --output BobWin.exe
pkg . --targets latest-win-x86 --output BobWin32.exe
pkg . --targets latest-macos --output BobOSX.command
pkg . --targets latest-macos-x86 --output BobOSX32.command
pkg . --targets latest-linux --output BobLinux
pkg . --targets latest-linux-x86 --output BobLinux32
#pkg . --targets latest-linux-armv7 --output tiddlyArmV7
