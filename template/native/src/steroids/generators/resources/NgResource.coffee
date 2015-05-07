Base = require "../Base"
chalk = require "chalk"

module.exports = class NgResource extends Base

  constructor: (@options) ->
    @args = "steroids:ng-resource"
    @opts = {}

  @usageParams: ->
    ""

  @usage: ()->
    """
    Generates an Angular.js resource that uses local data.

    For a resource named #{chalk.bold("car")}, the following files will be created:

        - app/controllers/car.js
        - app/models/car.js
        - app/views/car/index.html
        - app/views/car/show.html
        - app/views/layouts/car.html
        - www/data/car.json

    """
