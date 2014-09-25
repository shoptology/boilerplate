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

    it "prints usage instructions when no parameters are given", ->

      cmd = @testHelper.runInProjectSync "generate",
        args: ["tutorial"]

      runs ->
        expect( cmd.stderr ).toMatch(/Error: You must specify a valid tutorial name./)

    it "gives a friendly error message when tutorial is not found", ->

      cmd = @testHelper.runInProjectSync "generate",
        args: ["tutorial", "neverGonnaExistTutorial"]

      runs ->
        expect( cmd.stderr ).toMatch(/Error: You must specify a valid tutorial name/)

    xit "prompts on overwriting the application.coffee", ->


    it "generates begin tutorial", ->

      cmd = @testHelper.runInProjectSync "generate",
        args: ["tutorial", "begin"]

      runs ->
        expect( cmd.code ).toBe(0)
        expect( cmd.stderr ).toMatch(/steroids.config.location = \"http:\/\/localhost\/tutorial.html\"/)

        tutorialFileLocation = path.join(@testHelper.testAppPath, "www", "tutorial.html")
        expect( fs.existsSync tutorialFileLocation ).toBe true

        expect( fs.readFileSync( tutorialFileLocation ).toString() ).toMatch(/Awesome, welcome!/)


    it "generates steroids tutorial", ->

      runs ->
        fs.unlinkSync( path.join(@testHelper.testAppPath, "config", "application.coffee") )

      cmd = @testHelper.runInProjectSync "generate",
        args: ["tutorial", "steroids"]

      runs ->
        expect( cmd.code ).toBe(0)
        expect( cmd.stderr).toMatch(/and uncomment some lines/)

        tutorialStartHTMLPath = path.join(@testHelper.testAppPath, "app", "views", "steroidsTutorial", "index.html")
        expect( fs.existsSync tutorialStartHTMLPath ).toBe true

        expect( fs.readFileSync(tutorialStartHTMLPath ).toString()).toMatch(/Hooray!/)

    it "generates controllers tutorial after steroids", ->

      runs ->
        fs.unlinkSync( path.join(@testHelper.testAppPath, "config", "application.coffee") )

      cmd = @testHelper.runInProjectSync "generate",
        args: ["tutorial", "steroids"]

      cmd = @testHelper.runInProjectSync "generate",
        args: ["tutorial", "controllers"]

      runs ->
        expect( cmd.code ).toBe(0)
        expect( cmd.stderr ).toMatch(/Now change the first tab in config\/application\.coffee/)

        controllersStartHTMLPath = path.join(@testHelper.testAppPath, "app", "views", "steroidsTutorial", "controllers.html")
        expect( fs.existsSync controllersStartHTMLPath ).toBe true

        expect( fs.readFileSync(controllersStartHTMLPath ).toString()).toMatch(/Good! You made it all/)

    it "fails to generate controller tutorial to an empty project", ->

      cmd = @testHelper.runInProjectSync "generate",
        args: ["tutorial", "controllers"]


      runs ->
        expect( cmd.code ).toBe(1)
        expect( cmd.stderr ).toMatch(/Please make sure you've generated the steroids tutorial/)

        controllersStartHTMLPath = path.join(@testHelper.testAppPath, "app", "views", "steroidsTutorial", "controllers.html")
        expect( fs.existsSync controllersStartHTMLPath ).toBe false


  describe 'examples', ->

    beforeEach ->
      @testHelper.createProjectSync()

    it "prints usage instructions when no parameters are given", ->

      cmd = @testHelper.runInProjectSync "generate",
        args: ["example"]

      runs ->
        expect( cmd.stderr ).toMatch(/Error: You must specify a valid example name/)

    it "gives a friendly error message when example is not found", ->

      cmd = @testHelper.runInProjectSync "generate",
        args: ["example", "neverGonnaExistExample"]

      runs ->
        expect( cmd.stderr ).toMatch(/Error: Example neverGonnaExistExample not found/)


    describe "cordova examples", ->

      it "generates accelerometer example", ->
        cmd = @testHelper.runInProjectSync "generate",
          args: ["example", "accelerometer"]

        runs ->
          expect( cmd.stderr ).toMatch("www/accelerometerExample.html")

      it "generates audio example", ->
        cmd = @testHelper.runInProjectSync "generate",
          args: ["example", "audio"]

        runs ->
          expect( cmd.stderr ).toMatch("www/audioExample.html")

      it "generates compass example", ->
        cmd = @testHelper.runInProjectSync "generate",
          args: ["example", "compass"]

        runs ->
          expect( cmd.stderr ).toMatch("www/compassExample.html")

      it "generates device example", ->
        cmd = @testHelper.runInProjectSync "generate",
          args: ["example", "device"]

        runs ->
          expect( cmd.stderr ).toMatch("www/deviceExample.html")

      it "generates geolocation example", ->
        cmd = @testHelper.runInProjectSync "generate",
          args: ["example", "geolocation"]

        runs ->
          expect( cmd.stderr ).toMatch("www/geolocationExample.html")

      it "generates notification example", ->
        cmd = @testHelper.runInProjectSync "generate",
          args: ["example", "notification"]

        runs ->
          expect( cmd.stderr ).toMatch("www/notificationExample.html")

      it "generates storage example", ->
        cmd = @testHelper.runInProjectSync "generate",
          args: ["example", "storage"]

        runs ->
          expect( cmd.stderr ).toMatch("www/storageExample.html")


    describe "steroids examples", ->

      it "generates animation example", ->
        cmd = @testHelper.runInProjectSync "generate",
          args: ["example", "animation"]

        runs ->
          expect( cmd.stderr ).toMatch("app/views/layouts/animationExample.html")

      it "generates drumMachine example", ->
        cmd = @testHelper.runInProjectSync "generate",
          args: ["example", "drumMachine"]

        runs ->
          expect( cmd.stderr ).toMatch("app/views/layouts/drumMachineExample.html")

      it "generates modal example", ->
        cmd = @testHelper.runInProjectSync "generate",
          args: ["example", "modal"]

        runs ->
          expect( cmd.stderr ).toMatch("app/views/layouts/modalExample.html")

      it "generates preload example", ->
        cmd = @testHelper.runInProjectSync "generate",
          args: ["example", "preload"]

        runs ->
          expect( cmd.stderr ).toMatch("app/views/layouts/preloadExample.html")


  describe 'usage', ->

    beforeEach ->
      @testHelper.createProjectSync()

    it "prints usage instructions when no parameters", ->

      cmd = @testHelper.runInProjectSync "generate",
        args: []

      runs =>
        expect( cmd.stdout ).toMatch(/Usage: steroids generate ng-resource/)


    it "gives friendly error message when generator is not found", ->

      cmd = @testHelper.runInProjectSync "generate",
        args: ["neverGonnaExistGenerator"]

      runs =>
        expect( cmd.code ).toBe(1)
        expect( cmd.stdout ).toMatch(/No such generator: neverGonnaExistGenerator/)




    describe "ng-resource", ->

      # TODO: requires user input
      xit "creates a angular resource", ->
        @testHelper.createProjectSync()

        cmd = @testHelper.runInProjectSync "generate",
          args: ["ng-resource", "ngCars"]

        runs ()=>
          expect( cmd.code ).toBe(0)

          ctrlPath = path.join(@testHelper.testAppPath, "app", "controllers", "ngCars.js")
          expect(fs.existsSync ctrlPath).toBe true
          expect(fs.readFileSync(ctrlPath).toString()).toMatch(/ngCarsApp\.controller/)

          expect(fs.existsSync path.join(@testHelper.testAppPath, "app", "views", "ngCars", "index.html")).toBe true
          expect(fs.existsSync path.join(@testHelper.testAppPath, "app", "views", "ngCars", "show.html")).toBe true

      # TODO: requires user input
      xit "fails when trying to overwrite existing files", ->
        @testHelper.createProjectSync()

        runs ->
          @cmd1 = @testHelper.runInProjectSync "generate",
            args: ["ng-resource", "ngCars"]

        runs ->
          @cmd2 = @testHelper.runInProjectSync "generate",
            args: ["ng-resource", "ngCars"]

        runs ->
          expect( @cmd1.code ).toBe(0)
          expect( @cmd2.code ).toBe(1)

          ctrlPath = path.join(@testHelper.testAppPath, "app", "controllers", "ngCars.js")
          expect(fs.existsSync ctrlPath).toBe true

          expect(@cmd2.stdout).toMatch(/would be overwritten by this command/)

