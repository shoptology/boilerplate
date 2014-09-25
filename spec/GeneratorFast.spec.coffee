Paths = require "../src/steroids/paths"

wrench = require "wrench"
path = require "path"
fs = require "fs"

TestHelper = require "./TestHelper"

describe 'Generator', ->

  beforeEach ->
    @testHelper = new TestHelper

    @testHelper.bootstrap()
    @testHelper.changeToWorkingDirectory()

  afterEach ->
    @testHelper.cleanUp()


  describe 'tutorials', ->

    beforeEach ->
      @testHelper.createProjectSync()

    it "generates begin tutorial", ->

      cmd = @testHelper.runInProjectSync "generate",
        args: ["tutorial", "begin"]

      runs ->
        expect( cmd.code ).toBe(0)
        expect( cmd.stderr ).toMatch(/steroids.config.location = "http:\/\/localhost\/tutorial.html"/)

        tutorialFileLocation = path.join(@testHelper.testAppPath, "www", "tutorial.html")
        expect( fs.existsSync tutorialFileLocation ).toBe true

        expect( fs.readFileSync( tutorialFileLocation ).toString() ).toMatch(/Awesome, welcome!/)
