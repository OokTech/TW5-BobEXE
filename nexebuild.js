const { compile } = require('nexe')

console.log('starting with windows x64')
compile({
  input: './index.js',
  output: 'BobWin',
  targets: 'windows-x64'
}).then(() => {
  console.log('now windows x32')
  return compile({
    input: './index.js',
    output: 'BobWin32',
    targets: 'windows-x32'
  })
}).then(() => {
  console.log('now osx x64')
  return compile({
    input: './index.js',
    output: 'BobOSX.command',
    targets: 'mac-x64'
  })
}).then(() => {
  console.log('now linux x64')
  return compile({
    input: './index.js',
    output: 'BobLinux',
    targets: 'linux-x64'
  })
}).then(() => {
  console.log('now linux x32')
  return compile({
    input: './index.js',
    output: 'BobLinux32',
    targets: 'linux-x32'
  })
}).then(() => {
  console.log('done')
}).catch((e) => {console.log('error?', e)})