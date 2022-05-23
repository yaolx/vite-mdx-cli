const inquirer = require('inquirer')
const chalk = require('chalk')
const defaultEnv = 'debug'
exports.register = (program) => {
  program
    .command('run')
    .alias('r')
    .description('Start run vite-mdx')
    .action(() => {
      const questions = [
        {
          type: 'list',
          message: 'Please choose which service environment to use？',
          name: 'state',
          choices: ['debug', 'dev'],
          filter: function (val) {
            return val.toLowerCase()
          },
          defaultEnv: defaultEnv,
          when: (res) => Boolean(res.conf)
        }
      ]
      console.log(chalk.green('🐨🐨🐨 ' + 'starting run vite-mdx...'))
      const answers = inquirer.prompt(questions)
      runService(answers)
    })
  return program
}

async function runService(answers) {}
