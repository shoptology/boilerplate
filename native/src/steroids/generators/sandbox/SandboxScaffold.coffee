Base = require "../Base"
chalk = require "chalk"

module.exports = class SandboxScaffold extends Base

  constructor: (@options) ->
    @args = "steroids:sandbox-scaffold #{@options.args}"
    @opts = {}

  @usageParams: ->
    ""

  @usage: ()->
    """
    Generates a CRUD scaffold for your SandboxDB resource.

    For a resource named #{chalk.bold("car")}, the following files will be created:

        - app/controllers/car.js
        - app/models/car.js
        - app/views/car/index.html
        - app/views/car/show.html
        - app/views/layouts/car.html

    """
