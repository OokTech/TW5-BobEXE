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

if (!fs.existsSync(path.join(basePath, './Plugins'))) {
  fs.mkdirSync(path.join(basePath, './Plugins'));
  fs.mkdirSync(path.join(basePath, './Editions'));
  fs.mkdirSync(path.join(basePath, './Themes'));
}

var resolvedpluginspath = path.resolve(__dirname, './plugins');
var externalpluginspath = path.resolve(basePath, './Plugins');
if (process.env["TIDDLYWIKI_PLUGIN_PATH"] !== undefined && process.env["TIDDLYWIKI_PLUGIN_PATH"] !== '') {
  process.env["TIDDLYWIKI_PLUGIN_PATH"] = process.env["TIDDLYWIKI_PLUGIN_PATH"] + path.delimiter + resolvedpluginspath + path.delimiter + externalpluginspath;
} else {
  process.env["TIDDLYWIKI_PLUGIN_PATH"] = resolvedpluginspath + path.delimiter + externalpluginspath;
}

var resolvedthemespath = path.resolve(__dirname, './themes');
var externalthemespath = path.resolve(basePath, './Themes');
if (process.env["TIDDLYWIKI_THEME_PATH"] !== undefined && process.env["TIDDLYWIKI_THEME_PATH"] !== '') {
  process.env["TIDDLYWIKI_THEME_PATH"] = process.env["TIDDLYWIKI_THEME_PATH"] + path.delimiter + resolvedthemespath + path.delimiter + externalthemespath;
} else {
  process.env["TIDDLYWIKI_THEME_PATH"] = resolvedthemespath + path.delimiter + externalthemespath;
}

var resolvededitionspath = path.resolve(__dirname, './editions')
var externaleditionsspath = path.resolve(basePath, './Editions');
if (process.env["TIDDLYWIKI_EDITION_PATH"] !== undefined && process.env["TIDDLYWIKI_EDITION_PATH"] !== '') {
  process.env["TIDDLYWIKI_EDITION_PATH"] = process.env["TIDDLYWIKI_EDITION_PATH"] + path.delimiter + resolvededitionspath + path.delimiter + externaleditionsspath;
} else {
  process.env["TIDDLYWIKI_EDITION_PATH"] = resolvededitionspath + path.delimiter + externaleditionsspath;
}

var $tw = require("./TiddlyWiki5/boot/boot.js").TiddlyWiki();

// Pass the command line arguments to the boot kernel

$tw.boot.argv = [path.join(basePath, "./IndexWiki"), "--wsserver"];

// Boot the TW5 app
$tw.boot.boot();

// When running headless the browser doesn't exist and this will crash, so we
// put it in a try block to make that simpler.
try {
  // This opens the IndexWiki in the default browser
  openBrowser();
} catch (e) {
  console.log('Error opening browser:')
  console.log(e)
}

// Because parts of node are asynchronous this function may run before the
// http(s) server is started. This checks to see if it exists before trying to
// open the browser.
function openBrowser() {
  if (!$tw.settings.suppressBrowser) {
    setTimeout(function () {
      if ($tw.httpServerPort) {
        if ($tw.settings['ws-server'].host === '127.0.0.1' || $tw.settings['ws-server'].host === '0.0.0.0') {
          require("openurl").open("http://127.0.0.1:" + $tw.httpServerPort);
        } else {
          require('openurl').open('http://' + $tw.settings['ws-server'].host + ':' + $tw.httpServerPort)
        }
      } else {
        openBrowser();
      }
    }, 100);
  }
}
