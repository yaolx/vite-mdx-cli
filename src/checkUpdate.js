'use strict'
const pjson = require('../package.json')
const shell = require('shelljs')
const semver = require('semver')
const chalk = require('chalk')

module.exports = function () {
  const localVersion = pjson.version
  const packageName = pjson.name
  const remoteVersionStr = shell.exec(
    `npm info ${packageName}@latest version --registry=https://www.npmjs.com/package/vite-mdx-cli`,
    {
      silent: true
    }
  ).stdout
  if (typeof remoteVersionStr == null) {
    console.log(chalk.red('Failed to get the corresponding module version'))
    process.exit(0)
  }
  const remoteVersion = semver.clean(remoteVersionStr)

  if (localVersion != remoteVersion) {
    console.log(`Latest version is [${remoteVersion}]，Please execute the upgrade command:`)
    console.log('npm i -g vite-mdx-cli --registry=https://www.npmjs.com/package/vite-mdx-cli')
    process.exit(0)
  }
}
