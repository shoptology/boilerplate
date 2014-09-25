
wrench = require "wrench"
path = require "path"
fs = require "fs"
spawn = require("child_process").spawn

TestHelper = require("./TestHelper")

describe 'Karma', ->

  beforeEach ->
    @testHelper = new TestHelper

    @testHelper.bootstrap()
    @testHelper.changeToWorkingDirectory()

  afterEach ->
    @testHelper.cleanUp()


  describe 'init', ->

    beforeEach ->
      @testHelper.createProjectSync()

    it 'should complain on missing files', ->

      cmd = @testHelper.runInProjectSync "test",
        args: ["karma"]

      runs ()=>
        expect( cmd.stdout ).toMatch("Could not find all karma configuration files")
        expect( cmd.stdout ).toMatch("testApp/test/karma.coffee")
        expect( cmd.stdout ).toMatch("testApp/test/karmaSingle.coffee")

    it 'should generate configuration files', ->
      cmd = @testHelper.runInProjectSync "test",
        args: ["karma", "init"]

      karmaConfigPath = path.join(@testHelper.testAppPath, "test")

      runs () =>
        expect( fs.existsSync(path.join(karmaConfigPath, "karma.coffee")) ).toBeTruthy()
        expect( fs.existsSync(path.join(karmaConfigPath, "karmaSingle.coffee")) ).toBeTruthy()

