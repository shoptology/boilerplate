Base = require "../Base"

chalk = require "chalk"

class Tutorial extends Base
  @usageParams: ->
    "<tutorialName>"

  @usage: ()->
    """
    Generates a tutorial teaching you features of the Steroids platform.

    Run #{chalk.bold("steroids generate tutorial")} for a list of available tutorials.
    """

  constructor: (@options)->

    @args = "steroids:tutorial:#{@options.name}"
    @options = {}

module.exports = Tutorial
