Paths = require "../src/steroids/paths"

wrench = require "wrench"
path = require "path"
fs = require "fs"

TestHelper = require "./TestHelper"

describe 'Packager', ->

  beforeEach ->
    @testHelper = new TestHelper

    @testHelper.bootstrap()
    @testHelper.changeToWorkingDirectory()

  afterEach ->
    @testHelper.cleanUp()


  describe 'zip', ->

    it 'should be created', ->
      @testHelper.createProjectSync()
      @testHelper.runMakeInProjectSync()
      @testHelper.runPackageInProjectSync()

      runs ()=>
        expect(fs.existsSync Paths.temporaryZip).toBe true
