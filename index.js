#!/usr/bin/env node

// Check to make sure that the index wiki exists
var fs = require('fs');
var path = require('path');

var basePath = process.pkg?path.dirname(process.argv[0]):process.cwd();

if (!fs.existsSync(path.join(basePath, 'IndexWiki'))) {
  // Recursively copy files from the virtual file system in the packaged
  // executable into the real file system outside it.
  // NOTE: None of the fs copying functions work on the virtual file system.
  // That is why I made this function.
  function specialCopy (source, destination) {
    fs.mkdirSync(destination);
    var currentDir = fs.readdirSync(source)
    currentDir.forEach(function (item) {
      if (fs.statSync(path.join(source, item)).isFile()) {
        var fd = fs.readFileSync(path.join(source, item), {encoding: 'utf8'});
        fs.writeFileSync(path.join(destination, item), fd, {encoding: 'utf8'});
      } else {
        //Recurse!! Because it is a folder.
        // But make sure it is a directory first.
        if (fs.statSync(path.join(source, item)).isDirectory()) {
          specialCopy(path.join(source, item), path.join(destination, item));
        }
      }
    });
  }

  // If we don't have an index wiki already in this location, make one.
  var destination = path.join(basePath, 'IndexWiki');
  var source = path.join(__dirname, 'editions/Bob')
  specialCopy(source, destination)
}

var resolvedpluginspath = path.resolve(__dirname, './plugins');
if (process.env["TIDDLYWIKI_PLUGIN_PATH"] !== undefined && process.env["TIDDLYWIKI_PLUGIN_PATH"] !== '') {
  process.env["TIDDLYWIKI_PLUGIN_PATH"] = process.env["TIDDLYWIKI_PLUGIN_PATH"] + path.delimiter + resolvedpluginspath;
} else {
  process.env["TIDDLYWIKI_PLUGIN_PATH"] = resolvedpluginspath;
}

var $tw = require("./TiddlyWiki5/boot/boot.js").TiddlyWiki();

// Pass the command line arguments to the boot kernel

$tw.boot.argv = [path.join(basePath, "./IndexWiki"), "--wsserver"];

// Boot the TW5 app
$tw.boot.boot();

// This opens the IndexWiki in the default browser
openBrowser();

function openBrowser() {
  if (!$tw.settings.suppressBrowser) {
    setTimeout(function () {
      if ($tw.httpServerPort) {
        require("openurl").open("http://127.0.0.1:" + $tw.httpServerPort);
      } else {
        openBrowser();
      }
    }, 100);
  }
}
