spawn = require("child_process").spawn

class CommandRunner

  constructor: (@options)->
    @cmd = @options.cmd
    @args = @options.args || []
    @cwd = @options.cwd || ""

    @timeout = @options.timeout || 6000

    @stdout = ""
    @stderr = ""
    @done = false   # always true after exit, even in failure
    @success = false
    @code = null

  run:() =>
    if @options.debug
      console.log "starting cmd: #{@cmd}"
      console.log "args: #{@args}"
      console.log "cwd: #{@cwd}"

    @spawned = spawn @cmd, @args, { cwd: @cwd }

    @spawned.stdout.on "data", (buffer) =>
      newData = buffer.toString()
      @stdout = @stdout + newData

      console.log newData if @options.debug

    @spawned.stderr.on "data", (buffer) =>
      newData = buffer.toString()

      if /^execvp\(\)/.test(newData)
        console.log "!!! CommandRunner: failed to start process #{@cmd}"
        @done = true
        return

      @stderr = @stderr + newData
      console.log newData if @options.debug


    @spawned.on "exit", (code) =>
      @code = code
      @success = true
      @done = true

    if @options.waitsFor
      setTimeout ()=>
        @done = true
      , @options.waitsFor

    waitsFor(()=>
      return @done
    , "CommandRunner: cmd never exited", @timeout)

  kill:() =>
    @spawned.kill('SIGKILL')

module.exports = CommandRunner
