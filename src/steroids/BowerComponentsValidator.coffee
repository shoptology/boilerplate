Q = require "q"
paths = require "./paths"
path = require "path"
fs = require "fs"
chalk = require "chalk"

class BowerComponentsValidator

  constructor: ->


  validate: ->
    deferred = Q.defer()

    bowerJSON = require paths.application.configs.bower

    for dependency of bowerJSON.dependencies
      unless fs.existsSync path.join(paths.application.bowerComponentsDir, dependency)
        console.log "#{chalk.bold.red("ERROR")}: bower dependency #{dependency} doesn't exist in #{paths.application.bowerComponentsDir}"
        console.log "       To install dependencies run #{chalk.bold("$ steroids update")}"
        process.exit(1)


    deferred.resolve()

    return deferred.promise




module.exports = BowerComponentsValidator