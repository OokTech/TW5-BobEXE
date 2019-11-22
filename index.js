#!/usr/bin/env node

// Check to make sure that the index wiki exists
const fs = require('fs');
const path = require('path');

//var basePath = process.pkg?path.dirname(process.argv[0]):process.cwd();

const rootWikiPath = (process.argv.length > 2)?process.argv[2]:'./IndexWiki';
const basePath = (process.argv.length > 3)?path.resolve(process.argv[3]):(process.pkg?path.dirname(process.argv[0]):process.cwd();)

if (!fs.existsSync(path.join(basePath, 'IndexWiki'))) {
  // Recursively copy files from the virtual file system in the packaged
  // executable into the real file system outside it.
  // NOTE: None of the fs copying functions work on the virtual file system.
  // That is why I made this function.
  function specialCopy (source, destination) {
    fs.mkdirSync(destination);
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
  const destination = path.join(basePath, 'IndexWiki');
  const source = path.join(__dirname, 'editions/Bob')
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

$tw.boot.argv = [path.join(basePath, wikiPath), "--wsserver"];

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
