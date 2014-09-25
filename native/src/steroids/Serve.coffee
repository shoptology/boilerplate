Server = require "./Server"
WebServer = require "./servers/WebServer"
util = require "util"
open = require "open"
paths = require "./paths"

URL = require "url"


class Serve
  constructor: (@port, @opts = {}) ->
    @baseURL = "http://127.0.0.1:#{@port}/"

  start: =>
    config = steroidsCli.config.getCurrent()

    startLocation = if config.tabBar and config.getCurrent().tabBar.enabled
      config.tabBar.tabs[0].location
    else
      config.location

    startLocationURL = URL.parse(startLocation)

    url = URL.parse(@baseURL + startLocationURL.path)
    url = URL.format(url)

    serveServer = Server.start
      port: @port
      callback: ()=>
        webServer = new WebServer
          path: "/"

        serveServer.mount(webServer)

        util.log "Serving application in #{url}"

        if steroidsCli.platform == "tizen" || @opts.noBrowser
          return
        else
          open url

module.exports = Serve
