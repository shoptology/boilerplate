
wrench = require "wrench"
path = require "path"
fs = require "fs"
spawn = require("child_process").spawn

TestHelper = require("./TestHelper")

describe 'Grunt', ->

  beforeEach ->
    @testHelper = new TestHelper

    @testHelper.bootstrap()
    @testHelper.changeToWorkingDirectory()

  afterEach ->
    @testHelper.cleanUp()


  describe 'running it', ->

    beforeEach ->
      @testHelper.createProjectSync()

    it 'should create dist/ if missing', ->

      pathToDist = path.join @testHelper.testAppPath, "dist"
      wrench.rmdirSyncRecursive pathToDist, true

      expect( fs.existsSync(pathToDist) ).toBe(false)

      @testHelper.runMakeInProjectSync()

      runs ()=>
        expect( fs.existsSync(pathToDist) ).toBe(true)
        