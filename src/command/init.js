const inquirer = require('inquirer')
const chalk = require('chalk')
const path = require('path')
const { fsExists } = require('../util')
const { projectInstall } = require('pkg-install')
const execa = require('execa')
const listr = require('listr')
const ncp = require('ncp')
const { promisify } = require('util')
const copy = promisify(ncp)
const fs = require('fs')

exports.register = (program) => {
  program
    .command('init')
    .alias('i')
    .description('Init a new vite mdx blog')
    .action((name, options, command) => {
      let questions = [
        {
          type: 'input',
          name: 'projectName',
          message: chalk.green('Please enter project name'),
          validate: async (val) => {
            return !!val
          }
        },
        {
          type: 'list',
          message: function (answers) {
            return chalk.red(
              `❗️ Directory ${answers.projectName} already exists! Are you sure you want to continue?`
            )
          },
          choices: ['continue', 'cancel'],
          name: 'projectNameConfirm',
          when: async function (answers) {
            const targetFolder = path.join(process.cwd(), answers.projectName)
            return fsExists(targetFolder)
          },
          filter: (val) => {
            if (val == 'cancel') {
              process.exit(0)
            }
          }
        },
        {
          type: 'input',
          name: 'author',
          message: chalk.green('Please enter the author')
        },
        {
          type: 'list',
          message: chalk.green('Please choose which project template to use？'),
          name: 'template',
          choices: ['typescript'],
          filter: function (val) {
            return val.toLowerCase()
          }
        },
        {
          type: 'confirm',
          name: 'git',
          message: chalk.green('Initialize a git repository?')
        },
        {
          type: 'confirm',
          name: 'install',
          message: chalk.green('Whether to install dependencies？')
        }
      ]
      console.log(
        chalk.green('🐨🐨🐨 ' + 'Welcome to vite-mdx cli,easy to build vite-mdx-project～🎉🎉🎉')
      )
      inquirer.prompt(questions).then((answers) => {
        generatorProject(answers)
      })
    })
}

async function generatorProject(answers) {
  const currentFileUrl = import.meta.url
  const templateDirectory = path.resolve(
    new URL(currentFileUrl).pathname.slice(1),
    `../../../templates/`,
    answers.template.toLowerCase()
  )
  answers.templateDirectory = templateDirectory
  const isfsExists = await fsExists(templateDirectory)
  if (!isfsExists) {
    console.error('template not exists', chalk.red.bold('ERROR'))
    process.exit(1)
  }
  const tasks = [
    {
      title: 'Copy project template',
      task: async (ctx) => {
        const templateTargetDirectory = await copyTemplate(answers)
        ctx.templateTargetDirectory = templateTargetDirectory
      }
    },
    {
      title: 'Initialize git',
      task: (ctx) => initGit(ctx.templateTargetDirectory),
      enabled: () => answers.git
    },
    {
      title: 'Install dependencies',
      task: (ctx) => initInstall(ctx.templateTargetDirectory),
      enabled: () => answers.install
    }
  ]
  const listrInstance = new listr(tasks)
  await listrInstance.run()
  console.log(chalk.green.bold('vite-mdx init completed'))
  process.exit(0)
}

async function initGit(targetFolder) {
  try {
    const gitInstallResult = await execa('git', ['--version'], {
      cwd: targetFolder
    })
    console.log(
      chalk.green('🐨🐨🐨 ' + 'Welcome to vite-mdx cli,easy to build vite-mdx project～🎉🎉🎉')
    )
    if (gitInstallResult.failed) {
      return Promise.reject(new Error('Please install git '))
    }
    // git init
    const result = await execa('git', ['init'], {
      cwd: targetFolder
    })
    if (result.failed) {
      return Promise.reject(new Error('Failed to initialize git'))
    }
  } catch (error) {
    console.log('Failed to initialize git', chalk.red.bold('ERROR'))
    return Promise.reject(new Error('Failed to initialize git'))
  }
  return
}

async function initInstall(targetFolder) {
  const { stdout } = await projectInstall({
    prefer: 'yarn',
    cwd: targetFolder
  })
  console.log(chalk.green(`install 完成，进程信息 ${stdout}`))
}

async function copyTemplate(answers) {
  const targetDirectory = path.join(process.cwd(), answers.projectName)
  let isExist = await fsExists(targetDirectory)
  if (isExist) {
    console.log(chalk.red(`❗️Directory [${answers.projectName}]already exists`))
    return
  }
  const source = answers.templateDirectory
  const target = targetDirectory
  await copy(source, target, {
    clobber: false
  })
  await revisePackageJson(answers, target)
  return target
}

/**
 * replace package.json
 * @param {*} answer
 * @param {*} templatePath
 */
async function revisePackageJson(answers, targetDirectory) {
  // read package.json
  const data = fs.readFileSync(`${targetDirectory}/package.json`)
  const { projectName, author } = answers
  let packageJson = data.toString()
  packageJson = projectName ? packageJson.replace(/projectValue/g, projectName.trim()) : packageJson
  packageJson = author ? packageJson.replace(/authorValue/g, author.trim()) : packageJson
  // 写入文件
  await fs.writeFileSync(`${targetDirectory}/package.json`, packageJson)
}
