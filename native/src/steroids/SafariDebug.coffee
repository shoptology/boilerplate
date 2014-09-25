paths = require "./paths"
path = require "path"
sbawn = require("./sbawn")
chalk = require "chalk"

Help = require "./Help"

os = require "os"

Q = require "q"

class SafariDebug

  constructor: (@callBackOnExit) ->  # @callBackOnExit is invoked when this class' methods exit - typically used to redisplay the interactive prompt.

  listViews: =>
    @runAppleScript "SafariDebugWebViewLister.scpt"

  open: (argument) =>
    @runAppleScript "openSafariDevMenu.scpt", argument

  runAppleScript: (scriptFileName, argument)=>
    unless os.type() == "Darwin"
      console.log "Error: Safari Developer Tools debugging requires Mac OS X."
      @callBackOnExit?()

    @ensureAssistiveAccess().then( =>
      scriptPath = path.join paths.scriptsDir, scriptFileName

      args = [scriptPath]
      if argument?
        args.push argument

      osascriptSbawn = sbawn
        cmd: "osascript"
        args: args

      osascriptSbawn.on "exit", () =>
        steroidsCli.debug "SafariDebug started and killed."
        steroidsCli.debug "stderr: " + osascriptSbawn.stderr
        steroidsCli.debug "stdout: " + osascriptSbawn.stdout

        if osascriptSbawn.code  # error occurred
          errMsg = chalk.red '\nERROR: ' + (/\ execution error: ([\s\S]+)$/.exec(osascriptSbawn.stderr)?[1] || osascriptSbawn.stderr)
          console.error errMsg
        else unless argument?
          console.log "\n\n  Found following WebViews in Safari:\n"
          for line in osascriptSbawn.stdout.split("\n") when line isnt ""
            console.log "   - #{line}"
          console.log ''

        @callBackOnExit?()

    ).fail (errMsg) =>
      console.error chalk.red errMsg
      @callBackOnExit?()

  ensureAssistiveAccess: =>
    deferred = Q.defer()

    scriptPath = path.join paths.scriptsDir, "ensureAssistiveAccess.scpt"

    ensureAssistiveAccessSbawn = sbawn
      cmd: "osascript"
      args: [scriptPath]

    ensureAssistiveAccessSbawn.on "exit", () =>
      steroidsCli.debug "Ensure assistive access started and killed"

      if ensureAssistiveAccessSbawn.code
        errMsg = '\nERROR: ' + (/\ execution error: ([\s\S]+)$/.exec(ensureAssistiveAccessSbawn.stderr)?[1] || ensureAssistiveAccessSbawn.stderr)
        deferred.reject(errMsg)
      else
        deferred.resolve()

    deferred.promise

module.exports = SafariDebug
