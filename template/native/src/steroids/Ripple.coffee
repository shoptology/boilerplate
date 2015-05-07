spawn = require("child_process").spawn
sbawn = require("./sbawn")
paths = require "./paths"
portscanner = require "portscanner"

class Ripple

  constructor: (@options = {}) ->
    @port = @options.port || 4400
    @servePort = @options.servePort || 4000

  run: (opts={}) =>
    portscanner.checkPortStatus @port, 'localhost', (error, status) =>
      unless status == "closed"
        console.log "Error: port #{@port} is already in use. Make sure there is no other program or that 'steroids connect' is not running on this port."
        process.exit(1)

    cmd = paths.rippleBinary
    args = ["emulate", "--remote", "http://localhost:#{@servePort}", "--port", @port]

    steroidsCli.debug "Starting ripple with #{cmd} and #{args}"
    @rippleServer = sbawn
      cmd: cmd
      args: args
      stdout: true
      stderr: true

module.exports = Ripple
