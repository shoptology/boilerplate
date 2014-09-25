portscanner = require "portscanner"

class PortChecker

  constructor: (@options = {}) ->
    @run() if @options.autorun?

  run: =>
    portscanner.checkPortStatus @options.port, 'localhost', (error, status) =>
      @options.onClosed(status) if status is "closed" and @options.onClosed?
      @options.onOpen(status) if status is "open" and @options.onOpen?

module.exports = PortChecker
