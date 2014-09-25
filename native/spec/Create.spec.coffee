Paths = require "../src/steroids/paths"

TestHelper = require "./TestHelper"
CommandRunner = require "./CommandRunner"


fs = require "fs"
path = require "path"

describe 'Steroids', ->

  beforeEach ->
    @testHelper = new TestHelper

    @testHelper.bootstrap()
    @testHelper.changeToWorkingDirectory()

  afterEach ->
    @testHelper.cleanUp()


  describe 'create', ->

    it "creates project with name myApp", ->
      @createRun = new CommandRunner
        cmd: TestHelper.steroidsBinPath
        args: ["create", "myApp"]
        debug: false
        timeout: 15000  # steroids create installs from npm nowadays...

      runs ()=>
        @createRun.run()

      runs ()=>
        expect( @createRun.code ).toBe(0)
        expect( fs.existsSync "myApp" ).toBe true

    it "does not overwrite existing directory", ->
      @createRun1 = new CommandRunner
        cmd: TestHelper.steroidsBinPath
        args: ["create", "importantDirectoryDoNotOverwrite"]
        timeout: 15000  # steroids create installs from npm nowadays...

      @createRun2 = new CommandRunner
        cmd: TestHelper.steroidsBinPath
        args: ["create", "importantDirectoryDoNotOverwrite"]

      runs ->
        @createRun1.run()

      runs ->
        @createRun2.run()

      runs ->
        expect( @createRun1.code ).toBe(0)
        expect( @createRun2.code ).toBe(1)


    it "gives usage information when no params are given", ->
      @createRun = new CommandRunner
        cmd: TestHelper.steroidsBinPath
        args: ["create"]

      runs ()=>
        @createRun.run()

      runs ()=>
        expect( @createRun.code ).toBe(1)
        expect( @createRun.stdout ).toMatch /Usage: steroids create <directoryName>/


  describe 'project default files', ->

    beforeEach ->
      @testHelper.createProjectSync()
      @wwwPath = path.join @testHelper.testAppPath, "www"
      @configPath = path.join @testHelper.testAppPath, "config"
      @appPath = @testHelper.testAppPath

    it "has www/index.html with salutation", ->
      indexHTMLPath = path.join @wwwPath, "index.html"

      contents = fs.readFileSync(indexHTMLPath).toString()
      expect( contents ).toMatch(/<h1>Welcome to Steroids/)

    it "has config/application.coffee with config.name", ->
      applicationCoffeePath = path.join @configPath, "application.coffee"

      contents = fs.readFileSync(applicationCoffeePath).toString()
      expect( contents ).toMatch(/steroids.config.name = \"testApp"/)

    it "has bower.json with dependency to steroids.js", ->
      bowerJsonPath = path.join @appPath, "bower.json"

      contents = fs.readFileSync(bowerJsonPath).toString()
      expect( contents ).toMatch(/\"steroids-js\": \"/)

    it "has www/config.ios.xml with key DisallowOverscroll", ->
      configXmlPath = path.join @wwwPath, "config.ios.xml"

      contents = fs.readFileSync(configXmlPath).toString()
      expect( contents ).toMatch(/DisallowOverscroll/)

    it "has www/config.android.xml with key with element </widget>", ->
      configXmlPath = path.join @wwwPath, "config.android.xml"

      contents = fs.readFileSync(configXmlPath).toString()
      expect( contents ).toMatch(/\<\/widget\>/)

    it "does not have a folder named app", ->
      appPath = path.join @testHelper.testAppPath, "app"

      expect( fs.existsSync(appPath) ).not.toBe true


  describe 'create', ->
    it "prints usage instructions when no parameters", ->
      @testHelper.createProjectSync()

      cmd = @testHelper.runInProjectSync "generate",
        args: []

      runs ()=>
        expect( cmd.stdout ).toMatch(/Usage: steroids generate ng-resource/)

