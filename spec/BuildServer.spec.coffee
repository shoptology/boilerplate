wrench = require "wrench"
path = require "path"
fs = require "fs"
request = require "request"

TestHelper = require "./TestHelper"
CommandRunner = require "./CommandRunner"

describe 'BuildServer', ->

  beforeEach ->
    @testHelper = new TestHelper

    @testHelper.bootstrap()
    @testHelper.changeToWorkingDirectory()
    @testHelper.createProjectSync()


  afterEach ->
    @testHelper.cleanUp()
    @testHelper.killConnect()


  it "should start", ->

    @testHelper.runConnect()

    json = undefined
    gotResponse = false
    runs () =>
      request.get {url: 'http://localhost:4567/appgyver/api/applications/1.json', json: true}, (err, res, body)=>
        json = body
        gotResponse = true


    waitsFor(()=>
      return gotResponse
    , "Did not get json", 4000)

    runs () ->
      expect( json.configuration.fullscreen ).toEqual "true"
