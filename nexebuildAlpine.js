#!/usr/bin/env node

const { compile } = require('nexe')


console.log('now Alpine')
compile({
  input: './index.js',
  output: 'BobAlpine',
  targets: 'alpine-x64-12.9.1',
  //targets: 'mac-x64-14.12.0',
  resources: ['./plugins/**/*', './TiddlyWiki5/**/*', './themes/**/*', './editions/**/*']
}).then(() => {
  console.log('done')
}).catch((e) => {console.log('error?', e)})