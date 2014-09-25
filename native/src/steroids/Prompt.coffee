Help = require "./Help"
paths = require "./paths"
chalk = require "chalk"

class Prompt

  prompt: null

  constructor: (@options) ->
    @prompt = require('prompt')

    @prompt.message = "#{chalk.cyan("AppGyver")} #{chalk.magenta("Steroids")}"
    @prompt.delimiter = " "

    @prompt.start();

  refresh: () =>
    process.stdout.write @prompt.message + @prompt.delimiter + chalk.grey("command  ")

  cleanUp: () =>
    console.log "Shutting down Steroids ..."

    steroidsCli.simulator.stop()

    console.log "... done."


  connectLoop: =>

    console.log "\nHit #{chalk.green("[enter]")} to push updates, type #{chalk.bold("help")} for usage"

    onInput = (err, result) =>
      command = if result? and result.command?
        result.command
      else
        "quit"

      [mainCommand, commandOptions...] = command.split(' ')

      switch mainCommand
        when "quit", "exit", "q"
          @cleanUp()

          console.log "Bye"

          process.exit(0)
        when "", "push", "p"
          console.log "Updating code on all connected devices ..."
          Project = require "./Project"

          project = new Project
          project.make
            onSuccess: =>
              project.package
                onSuccess: =>
                  @refresh()

        when "d", "debug"
          SafariDebug = require "./SafariDebug"
          safariDebug = new SafariDebug => @connectLoop()
          if commandOptions[0]?
            safariDebug.open(commandOptions[0])
          else
            safariDebug.listViews()
          return # Exit now and later let the callback passed to SafarDebug's constructor re-enter the loop once its methods exit.

        when "s", "sim", "simulator"

          deviceType = if commandOptions[0]
            commandOptions[0]
          else if steroidsCli.options.argv.deviceType
            steroidsCli.options.argv.deviceType
          else
            steroidsCli.simulator.DEFAULT_DEVICE_TYPE

          console.log "Starting iOS Simulator of type `#{deviceType}`"

          steroidsCli.simulator.run
            deviceType: deviceType

        when "qr", "qr-code", "qrcode"
          QRCode = require "./QRCode"
          QRCode.showLocal
            port: steroidsCli.port

        when "e", "edit"

          if process.platform is "win32"
            console.log "Error: launching text editor via Steroids is not supported on Windows"
          else
            editorCmd = steroidsCli.config.getCurrent().editor.cmd
            editorArgs = steroidsCli.config.getCurrent().editor.args

            acualArgs = if editorArgs
              editorArgs
            else
              [paths.applicationDir]

            acualCmd = if editorCmd
              editorCmd
            else
              "subl"

            sbawn = require "./sbawn"
            sbawn
              cmd: acualCmd
              args: acualArgs
              debug: true
              exitOnError: false

        when "help", "?", "usage"
          Help.connect()
        else
          console.log "Did not recognize input: #{result.command}, type help for usage."

      @connectLoop()

    @get
      onInput: onInput



  get: (options)->
    @prompt.get
      properties:
        command:
          message: ""
    , (options.onInput ? @options.onInput?)



module.exports = Prompt