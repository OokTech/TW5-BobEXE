#!/usr/bin/env node

// Check to make sure that the index wiki exists
const fs = require('fs');
const path = require('path');

let rootWikiPath = './IndexWiki'
let basePath = path.dirname(process.argv[0])
if (process.argv.length > 2) {
  process.argv.slice(2).forEach(function(arg, index) {
    if (!arg.startsWith('--')) {
      if (index === 0) {
        rootWikiPath = arg
      } else if (index === 1) {
        basePath = arg
      }
    } else if (arg.startsWith('--basePath=')) {
      basePath = arg.split('=')[1]
    } else if (arg.startsWith('--indexPath=')) {
      rootWikiPath = arg.split('=')[1]
    }
  })
}

basePath = path.resolve(basePath)
rootWikiPath = path.resolve(basePath, rootWikiPath)

/*
  mkdirSync doesn't always work with the recursive flag, so we fake it here.
*/
function annoyingMkDirSync(dirPath) {
  dirPath = path.resolve(dirPath);
  const pathPieces = dirPath.split(path.sep);
  for (i = 0;i < pathPieces.length;i++) {
    const currPath = pathPieces.slice(0,i+2).join(path.sep);
    if (!fs.existsSync(currPath)) {
      fs.mkdirSync(currPath);
    }
  }
}

if (!fs.existsSync(path.join(rootWikiPath))) {
  // Recursively copy files from the virtual file system in the packaged
  // executable into the real file system outside it.
  // NOTE: None of the fs copying functions work on the virtual file system.
  // That is why I made this function.
  function specialCopy (source, destination) {
    annoyingMkDirSync(destination);
    const currentDir = fs.readdirSync(source)
    currentDir.forEach(function (item) {
      if (fs.statSync(path.join(source, item)).isFile()) {
        const fd = fs.readFileSync(path.join(source, item), {encoding: 'utf8'});
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
  const destination = rootWikiPath;
  const source = path.join(__dirname, 'editions/Bob')
  specialCopy(source, destination)
}

if (!fs.existsSync(path.join(basePath, './Plugins'))) {
  annoyingMkDirSync(path.join(basePath, './Plugins'));
  annoyingMkDirSync(path.join(basePath, './Editions'));
  annoyingMkDirSync(path.join(basePath, './Themes'));
}

var resolvedpluginspath = path.resolve(__dirname, './plugins');
var externalpluginspath = path.resolve(basePath, './Plugins');
if (process.env["TIDDLYWIKI_PLUGIN_PATH"] !== undefined && process.env["TIDDLYWIKI_PLUGIN_PATH"] !== '') {
  process.env["TIDDLYWIKI_PLUGIN_PATH"] = process.env["TIDDLYWIKI_PLUGIN_PATH"] + path.delimiter + externalpluginspath + path.delimiter + resolvedpluginspath;
} else {
  process.env["TIDDLYWIKI_PLUGIN_PATH"] = externalpluginspath + path.delimiter + resolvedpluginspath;
}

var resolvedthemespath = path.resolve(__dirname, './themes');
var externalthemespath = path.resolve(basePath, './Themes');
if (process.env["TIDDLYWIKI_THEME_PATH"] !== undefined && process.env["TIDDLYWIKI_THEME_PATH"] !== '') {
  process.env["TIDDLYWIKI_THEME_PATH"] = process.env["TIDDLYWIKI_THEME_PATH"] + path.delimiter + externalthemespath + path.delimiter + resolvedthemespath;
} else {
  process.env["TIDDLYWIKI_THEME_PATH"] = externalthemespath + path.delimiter + resolvedthemespath;
}

var resolvededitionspath = path.resolve(__dirname, './editions')
var externaleditionsspath = path.resolve(basePath, './Editions');
if (process.env["TIDDLYWIKI_EDITION_PATH"] !== undefined && process.env["TIDDLYWIKI_EDITION_PATH"] !== '') {
  process.env["TIDDLYWIKI_EDITION_PATH"] = process.env["TIDDLYWIKI_EDITION_PATH"] + path.delimiter + externaleditionsspath + path.delimiter + resolvededitionspath;
} else {
  process.env["TIDDLYWIKI_EDITION_PATH"] =  externaleditionsspath + path.delimiter + resolvededitionspath;
}

var $tw = require("./TiddlyWiki5/boot/boot.js").TiddlyWiki();

// Pass the command line arguments to the boot kernel

$tw.boot.argv = [path.resolve(basePath, rootWikiPath), "--wsserver"];

// Boot the TW5 app
$tw.boot.boot();

// Set the base path in case it was passed as a command line argument.
$tw.settings.wikiPathBase = basePath;

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
let numTries = 0
function openBrowser() {
  if (!$tw.settings.suppressBrowser) {
    setTimeout(function () {
      if ($tw.httpServerPort && numTries < 100) {
        if ($tw.settings['ws-server'].host === '127.0.0.1' || $tw.settings['ws-server'].host === '0.0.0.0' || typeof $tw.settings['ws-server'].host === 'undefined') {
          require("openurl").open("http://127.0.0.1:" + $tw.httpServerPort, callback);
        } else {
          require('openurl').open('http://' + $tw.settings['ws-server'].host + ':' + $tw.httpServerPort, callback)
        }
      } else {
        numTries = numTries + 1;
        openBrowser();
      }
    }, 100);
  }
}

function callback(err) {
  if (err) {
    console.log('Error opening browser:', err)
  } else {

  }
}
