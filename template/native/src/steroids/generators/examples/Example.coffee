Base = require "../Base"

chalk = require "chalk"

class Example extends Base
  @usageParams: ->
    "<exampleName>"

  @usage: ()->
    """
    Generates an example demonstrating a Steroids feature.

    Run #{chalk.bold("steroids generate example")} for a list of available examples.
    """

  constructor: (@options)->

    @args = "steroids:example:#{@options.name}"
    @options = {}

module.exports = Example