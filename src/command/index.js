const commandList = [
  require('./init'), // init create
  require('./version'), // get version
  require('./run') // run
]
exports.launcher = (program) => {
  commandList.forEach((command) => {
    command.register(program)
  })
}
