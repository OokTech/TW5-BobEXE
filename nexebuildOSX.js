#!/usr/bin/env node

const { compile } = require('nexe')


console.log('now osx x64')
compile({
  input: './index.js',
  output: 'BobOSX.command',
  targets: 'mac-x64-12.9.0',
  //targets: 'mac-x64-14.12.0',
  resources: ['./plugins/**/*', './TiddlyWiki5/**/*', './themes/**/*', './editions/**/*']
}).then(() => {
  console.log('done')
}).catch((e) => {console.log('error?', e)})