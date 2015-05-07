steroids = require "../src/steroids"

describe 'steroids', ->

  beforeEach ->

  describe 'config', ->

    it 'provides config with initial tabs', ->
      Config = require "../src/steroids/Config"
      config = new Config()
      expect(config.tabBar.tabs).toEqual([])



Paths = require "../src/steroids/paths"

path = require "path"
fs = require "fs"

TestHelper = require "./TestHelper"


describe 'Steroids Cli', ->

  beforeEach ->
    @testHelper = new TestHelper

    @testHelper.bootstrap()
    @testHelper.changeToWorkingDirectory()

  afterEach ->
    @testHelper.cleanUp()


  describe 'without being in steroids project directory', ->

    it "gives error if command requires to be run in project directory", ->

      commandsThatRequireSteroidsProject = ["push", "make", "package", "grunt", "debug", "simulator", "connect", "update", "generate", "deploy"]

      for command in commandsThatRequireSteroidsProject

        @requireRun = new TestHelper.CommandRunner
          cmd: TestHelper.steroidsBinPath
          args: [command]

        runs ->
          @requireRun.run()

        runs ->
          expect( @requireRun.code ).toBe(1)

          expect( @requireRun.stdout ).toMatch /requires to be run in a Steroids project directory./
