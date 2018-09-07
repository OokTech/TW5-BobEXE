#!/bin/bash

pkg . --targets latest-win --output tiddlyWin.exe
pkg . --targets latest-win-x86 --output tiddlyWin32.exe
pkg . --targets latest-macos --output tiddlyOSX.command
pkg . --targets latest-macos-x86 --output tiddlyOSX32.command
pkg . --targets latest-linux --output tiddlyLinux
pkg . --targets latest-linux-x86 --output tiddlyLinux32
pkg . --targets latest-linux-armv7 --output tiddlyArmV7
