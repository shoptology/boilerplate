steroidsSimulators = require "steroids-simulators"
sbawn = require("./sbawn")
os = require "os"

class TizenWebSimulator

  constructor: (@port) ->


  run: (opts={}) =>
    unless os.type() == "Darwin"
      console.log "Error: Simulator requires Mac OS X."
      return false

    cmd = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

    args = [
      "--args"
      "--allow-file-access-from-files"
      "--disable-web-security"
      "--start-maximized"
      "--user-data-dir=/tmp/steroidsTizenWebSimulator"
      "--app=file://#{steroidsSimulators.latestTizenWebSimulatorPath}/web/index.html?url=http://localhost:#{@port}/index.html"
    ]

    steroidsCli.debug "Spawning #{cmd}"
    steroidsCli.debug "with params: #{args}"

    @simulatorSession = sbawn
      cmd: cmd
      args: args
      stdout: true
      stderr: true

module.exports = TizenWebSimulator
