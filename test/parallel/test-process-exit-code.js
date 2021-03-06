'use strict';
require('../common');
const assert = require('assert');

switch (process.argv[2]) {
  case 'child1':
    return child1();
  case 'child2':
    return child2();
  case 'child3':
    return child3();
  case 'child4':
    return child4();
  case 'child5':
    return child5();
  case undefined:
    return parent();
  default:
    throw new Error('wtf');
}

function child1() {
  process.exitCode = 42;
  process.on('exit', function(code) {
    assert.strictEqual(code, 42);
  });
}

function child2() {
  process.exitCode = 99;
  process.on('exit', function(code) {
    assert.strictEqual(code, 42);
  });
  process.exit(42);
}

function child3() {
  process.exitCode = 99;
  process.on('exit', function(code) {
    assert.strictEqual(code, 0);
  });
  process.exit(0);
}

function child4() {
  process.exitCode = 99;
  process.on('exit', function(code) {
    if (code !== 1) {
      console.log('wrong code! expected 1 for uncaughtException');
      process.exit(99);
    }
  });
  throw new Error('ok');
}

function child5() {
  process.exitCode = 95;
  process.on('exit', function(code) {
    assert.strictEqual(code, 95);
    process.exitCode = 99;
  });
}

function parent() {
  test('child1', 42);
  test('child2', 42);
  test('child3', 0);
  test('child4', 1);
  test('child5', 99);
}

function test(arg, exit) {
  const spawn = require('child_process').spawn;
  const node = process.execPath;
  const f = __filename;
  const option = { stdio: [ 0, 1, 'ignore' ] };
  spawn(node, [f, arg], option).on('exit', function(code) {
    assert.strictEqual(code, exit, 'wrong exit for ' +
                 arg + '\nexpected:' + exit +
                 ' but got:' + code);
    console.log('ok - %s exited with %d', arg, exit);
  });
}
