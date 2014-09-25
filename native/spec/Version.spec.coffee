#wrench = require "wrench"
#fs = require "fs"
path = require "path"

TestHelper = require "./TestHelper"
CommandRunner = require "./CommandRunner"

describe 'Version', ->

  describe 'command line', ->

    it 'prints version with --version', ->

      @versionRun = new CommandRunner
        cmd: TestHelper.steroidsBinPath
        args: ["--version"]

      runs ()=>
        @versionRun.run()

      runs ()=>
        packageJSON = require "../package.json"

        versionString = "AppGyver Steroids #{packageJSON.version}\n"
        expect( @versionRun.stdout ).toMatch(versionString)

    it 'prints version with version', ->

      @versionRun = new CommandRunner
        cmd: TestHelper.steroidsBinPath
        args: ["version"]

      runs ()=>
        @versionRun.run()

      runs ()=>
        packageJSON = require "../package.json"

        versionString = "AppGyver Steroids #{packageJSON.version}\n"
        expect( @versionRun.stdout ).toMatch(versionString)

