wrench = require "wrench"
fs = require "fs"
path = require "path"

CommandRunner = require "./CommandRunner"

class TestHelper
  @CommandRunner: CommandRunner
  @steroidsBinPath: path.join __dirname, "..", "bin", "steroids"

  constructor: (@options = {}) ->
    testDirectory = @options.relativePath || "__test"
    @testAppName = @options.testAppName || "testApp"
    @workingDirectory = path.join process.cwd(), testDirectory
    @testAppPath = path.join(@workingDirectory, @testAppName)

  bootstrap: () =>
    wrench.rmdirSyncRecursive @workingDirectory, true
    fs.mkdirSync @workingDirectory

  changeToWorkingDirectory: () =>
    process.chdir @workingDirectory

  cleanUp: () =>
    if process.cwd() == @workingDirectory
      process.chdir path.join process.cwd(), ".."

    wrench.rmdirSyncRecursive @workingDirectory, false


  createProjectSync: () =>

    @createRun = new CommandRunner
      cmd: TestHelper.steroidsBinPath
      args: ["create", @testAppName]
      timeout: 20000

    runs ()=>
      @createRun.run()

    runs ()=>
      expect( @createRun.done ).toBe(true)

  runInProjectSync: (command, options={})=>
    options.cmd ?= TestHelper.steroidsBinPath
    options.args = [command].concat options.args
    options.cwd ?= @testAppPath

    commandRun = new CommandRunner options

    runs ()=>
      commandRun.run()

    return commandRun

  runMakeInProjectSync: () =>
    cmd = @runInProjectSync "make"

    runs ()=>
      expect( cmd.done ).toBe(true)


  runPackageInProjectSync: () =>
    cmd = @runInProjectSync "package"

    runs ()=>
      expect( cmd.done ).toBe(true)

  runConnect: () =>
    @connectRun = @runInProjectSync "connect",
      waitsFor: 3000

    runs () =>
      @requestServerInterval = setInterval(()=>
        require("request").get 'http://localhost:4567/appgyver/api/applications/1.json', (err, res, body)=>
          if err is null
            @running = true
            clearInterval @requestServerInterval
      , 250)

    waitsFor(()=>
      return @running
    , "Command 'connect' should complete", 6000)

  killConnect: () =>
    @connectRun.kill() if @connectRun

module.exports = TestHelper
