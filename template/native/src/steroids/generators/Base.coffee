paths = require "../paths"

env = require("yeoman-generator")()
chalk = require "chalk"

class Base
  @usageParams: ->
    throw "generators.Base.usageParams not overrridden by subclass!"

  @usage: ->
    throw "generators.Base.usage not overridden by subclass!"

  constructor: (@options) ->
    unless @options.name
      console.log "#{chalk.red.bold("Error:")} missing name of the generator, see 'steroids generate' for help."
      process.exit(1)

    @args = ""
    @opts = {}

  generate: ->
    # Look for generators in CLI's node_modules folder
    env.plugins "node_modules", paths.npm

    # lookup for generators with the steroids: namespace, within the environments.paths and lookups
    env.lookup '*:*'

    # env.on 'end', ->

    # env.on 'error', (err)->
    #   console.error 'Error', process.argv.slice(2).join(' '), '\n'
    #   console.error opts.debug ? err.stack : err.message
    #   process.exit(err.code || 1)

    env.run @args, @opts

module.exports = Base
