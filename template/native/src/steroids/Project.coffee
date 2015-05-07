sbawn = require "./sbawn"
util = require "util"
paths = require "./paths"
chalk = require "chalk"
fs = require "fs"
Help = require "./Help"
ApplicationConfigUpdater = require "./ApplicationConfigUpdater"
ConfigXmlValidator = require "./ConfigXmlValidator"
BowerComponentsValidator = require "./BowerComponentsValidator"
AppSettings = require "./AppSettings"

class Project

  constructor: (@options={}) ->

  initialize: (options={}) =>
    options.onSuccess()

  push: (options = {}) =>
    steroidsCli.debug "Starting push"

    @make
      onSuccess: =>
        @package
          onSuccess: () =>
            options.onSuccess.call() if options.onSuccess?
      onFailure: options.onFailure

  preMake: (options = {}) =>
    config = steroidsCli.config.getCurrent()

    if config.hooks.preMake.cmd and config.hooks.preMake.args

      util.log "preMake starting: #{config.hooks.preMake.cmd} with #{config.hooks.preMake.args}"

      preMakeSbawn = sbawn
        cmd: config.hooks.preMake.cmd
        args: config.hooks.preMake.args
        stdout: true
        stderr: true

      steroidsCli.debug "preMake spawned"

      preMakeSbawn.on "exit", =>
        errorCode = preMakeSbawn.code

        if errorCode == 137 and config.hooks.preMake.cmd == "grunt"
          util.log "command was grunt build which exists with 137 when success, setting error code to 0"
          errorCode = 0

        util.log "preMake done"

        if errorCode == 0
          options.onSuccess.call() if options.onSuccess?
        else
          util.log "preMake resulted in error code: #{errorCode}"
          options.onFailure.call() if options.onFailure?

    else
      options.onSuccess.call() if options.onSuccess?


  postMake: (options = {}) =>
    config = steroidsCli.config.getCurrent()

    if config.hooks.postMake.cmd and config.hooks.postMake.args

      util.log "postMake started"

      postMakeSbawn = sbawn
        cmd: config.hooks.postMake.cmd
        args: config.hooks.postMake.args
        stdout: true
        stderr: true

      postMakeSbawn.on "exit", =>
        util.log "postMake done"

        options.onSuccess.call() if options.onSuccess?
    else
      options.onSuccess.call() if options.onSuccess?

  makeOnly: (options = {}) => # without hooks

    bowerComponentsValidator = new BowerComponentsValidator
    applicationConfigUpdater = new ApplicationConfigUpdater
    configXmlValidator = new ConfigXmlValidator

    bowerComponentsValidator.validate().then( =>
      applicationConfigUpdater.updateTo3_1_9()

    ).then( =>

      configXmlValidator.check("ios")

    ).then( =>

      configXmlValidator.check("android")

    ).then( =>

      applicationConfigUpdater.ensureNodeModulesDir()

    ).then( =>

      steroidsCli.debug "Spawning steroids grunt #{steroidsCli.pathToSelf}"

      gruntArgs = ["grunt"]
      gruntArgs.push("--no-sass") if steroidsCli.options.argv.sass == false

      gruntSbawn = sbawn
        cmd: steroidsCli.pathToSelf
        args: gruntArgs
        stdout: true
        stderr: true

      gruntSbawn.on "exit", () =>
        if gruntSbawn.code == 0
          options.onSuccess.call() if options.onSuccess?
        else
          steroidsCli.debug "grunt spawn exited with code #{gruntSbawn.code}"
          options.onFailure.call() if options.onFailure?

    ).fail (errorMessage)->
      Help.error()
      console.log errorMessage
      process.exit(1)



  make: (options = {}) => # with pre- and post-make hooks

    steroidsCli.debug "Making with hooks."
    appSettings = new AppSettings

    @preMake
      onSuccess: =>
        @makeOnly
          onSuccess: =>
            unless steroidsCli.options.argv.noSettingsJson == true
              steroidsCli.debug "Creating dist/__appgyver_settings.json..."
              appSettings.createJSONFile()
            @postMake options

  package: (options = {}) =>
    steroidsCli.debug "Spawning steroids package"

    packageSbawn = sbawn
      cmd: steroidsCli.pathToSelf
      args: ["package"]
      stdout: true
      stderr: true

    packageSbawn.on "exit", =>

      steroidsCli.debug "package exited with code #{packageSbawn.code}"

      if packageSbawn.code == 0
        options.onSuccess() if options.onSuccess
      else
        options.onFailure() if options.onFailure


module.exports = Project