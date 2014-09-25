Server = require "../Server"
Converter = require "../Converter"
util = require "util"
path = require "path"

fs = require "fs"
Paths = require "../paths"

URL = require "url"

String::endsWith = (str) -> if @match(new RegExp "#{str}$") then true else false

class WebServer extends Server

  constructor: (@options) ->
    super(@options)

  setRoutes: =>
    @app.get "*", @serveRequest

  handleRootPath: (requestPath) ->
    return if /\/$/.test(requestPath)
      path.join(requestPath.substring(1), "index.html")
    else
      requestPath

  # CODESMELL starts here, mmmh it smells good:
  serveRequest: (req, res) =>
    filePath = @handleRootPath(req.path)
    fileDistPath = path.join("dist", filePath)

    if req.path.endsWith("config.xml")
      configFile = path.join Paths.application.wwwDir, "config.#{steroidsCli.platform}.xml"
      steroidsCli.debug "config.xml requesteded, sending #{configFile}"
      res.sendfile configFile
      return
    else if req.path.endsWith("cordova_plugins.js")
      res.sendfile path.join(Paths.appgyverStaticFiles, "browser_overrides", "ripple", "cordova_plugins.js")
      return
    else if req.path.endsWith("plugins/org.apache.cordova.device/www/device.js")
      res.sendfile path.join(Paths.appgyverStaticFiles, "browser_overrides", "ripple", "plugins", "device.js")
      return
    else if req.path.endsWith("plugins/org.apache.cordova.vibration/www/vibration.js")
      res.sendfile path.join(Paths.appgyverStaticFiles, "browser_overrides", "ripple", "plugins", "vibration.js")
      return
    else if req.path.endsWith("cordova.js")
      res.sendfile path.join(Paths.appgyverStaticFiles, "browser_overrides", "ripple", "cordova.js")
      return
    else if req.path.endsWith("cordova.tizen.js")
      steroidsCli.debug "cordova.tizen.js requested, serving from npm"
      tizenCordovaFile = path.join Paths.appgyverStaticFiles, "browser_overrides", "cordova.tizen.js"
      res.sendfile tizenCordovaFile
      return
    unless fs.existsSync(fileDistPath)
      res.status(status = 404)
      res.end()
      return

    config = steroidsCli.config.getCurrent()

    if !req.path.endsWith(".html") or req.query.steroidsServed or not config.tabBar.enabled
      res.status(status = 200).sendfile(fileDistPath)
      util.log "GET -- #{status} -- #{fileDistPath}"

      return

    # Rewrite document to include an iframe and tabs
    if !req.query.steroidsServed and config.tabBar.enabled and req.path.endsWith(".html")

      sanitizedPath = req.path.replace("//", "/")

      sanitizedQueryString = ""
      for key, value of req.query
        sanitizedQueryString += "#{key}=#{value}&"

      sanitizedQueryString += "steroidsServed=true"

      tabIndexTemplate = path.join Paths.appgyverStaticFiles, "tabbar", "index.html"
      tabIndexContents = fs.readFileSync(tabIndexTemplate).toString()

      tabIndexContents = tabIndexContents.replace "<!--DOCUMENT-->", "#{sanitizedPath}?#{sanitizedQueryString}"

      tabHTML = ""
      for tab in config.tabBar.tabs
        parsedLocation = URL.parse(tab.location)
        tabHTML += "| <a href='http://#{req.headers.host}/#{parsedLocation.path}'>#{tab.title}</a> |"

      tabIndexContents = tabIndexContents.replace "<!--TABS-->", tabHTML

      res.status(status = 200).send(tabIndexContents)
      return




module.exports = WebServer
