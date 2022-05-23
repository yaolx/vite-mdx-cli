#!/usr/bin/env node

require = require('esm')(module /*, options*/)
const checkUpdate = require('../src/checkUpdate')
// checkUpdate();

const commands = require('../src/command/index')
const program = require('commander')
commands.launcher(program)

program.parse(process.argv)
