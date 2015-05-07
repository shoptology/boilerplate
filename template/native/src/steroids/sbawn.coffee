spawn = require("child_process").spawn

class Sbawned

  constructor: (@options)->
    @_events = {}

    @stderr = ""
    @stdout = ""

    if not @options.exitOnError?
      @options.exitOnError = true

    @done = false

  onStdoutData: (buffer) =>
    newData = buffer.toString()
    @stdout = @stdout + newData

    process.stdout.write newData if @options.debug or @options.stdout

  onStderrData: (buffer) =>
    newData = buffer.toString()

    if /^execvp\(\)/.test(newData)
      console.log "Failed to run command: '#{@options.cmd}' with args #{JSON.stringify(@options.args)}"
      if !@options.exitOnError
        process.exit(-1)

    @stderr = @stderr + newData
    console.log newData if @options.debug or @options.stderr

  onExit: (code) =>
    @code = code ? 137

    @_performEvents "exit"

    @done = true

  sbawn: () =>
    args = @options.args
    args << "--debug" if steroidsCli.options.debug?

    try
      if process.platform is "win32"
        originalCmd = @options.cmd
        @options.cmd = process.env.comspec
        args = ["/c", "node", originalCmd].concat(args)
        @spawned = spawn @options.cmd, args, { cwd: @options.cwd, stdio: 'inherit' }
      else
        @spawned = spawn @options.cmd, args, { cwd: @options.cwd }
    catch e
      console.log "Failed to spawn a process, error: #{e.code}"

      if e.code == "EMFILE"
        console.log "The code EMFILE means that the process has run out of file descriptors, increase this with:\n"
        console.log "  $ ulimit -n 1024"
        console.log "\nAnd start the command again"

      @onExit()

    # windows spawn command inherits stdio from current process to get output working
    unless process.platform is "win32"
      @spawned.stdout.on "data", @onStdoutData
      @spawned.stderr.on "data", @onStderrData
    @spawned.on "exit", @onExit
    @spawned.on "error", (err)=>
      console.log err

  kill: () =>
    @spawned.kill("SIGKILL")

  on: (event, callback) =>
    @_events[event] = [] unless @_events[event]
    @_events[event].push callback

  _performEvents: (event) =>
    for i of @_events[event]
      @_events[event][i].call() if @_events[event][i]

sbawn = (options={}) ->
  s = new Sbawned(options)
  s.sbawn()

  return s

module.exports = sbawn
