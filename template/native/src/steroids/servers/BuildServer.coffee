Server = require "../Server"
Converter = require "../Converter"
util = require "util"
request = require "request"
semver = require "semver"
chalk = require "chalk"

fs = require "fs"
Paths = require "../paths"

Updater = require "../Updater"


class ClientResolver

  constructor: (@request) ->

  ipInInterfaces: (ip, interfaces) =>
    for iface in interfaces
      return true if iface.ip == ip

    return false

  resolve: =>
    ios = @request.headers["user-agent"].match("iPhone|iPad|iPod")?
    android = ios == false

    interfaces = steroidsCli.server.interfaces()
    simulator = @ipInInterfaces(@request.ip, interfaces)

    clientVersion = @request.query["client_version"]

    clientVersionMatch = @request.headers["user-agent"].match(/AppGyverSteroids\/([^\s]+)/)
    clientVersion = clientVersionMatch[1] if clientVersionMatch

    if android
      androidVersionMatch = @request.headers["user-agent"].match(/Android (\d+\.\d+\.\d+)\;/)
      osVersion = androidVersionMatch[1] if androidVersionMatch

    if ios
      iosVersionMatch = @request.headers["user-agent"].match(/(iPod|iPad|iPhone) OS ([^\s]*)/)
      device = iosVersionMatch[1] if iosVersionMatch
      osVersion = iosVersionMatch[2] if iosVersionMatch

    return {
      isIOS: ios
      isSimulator: simulator
      isAndroid: android
      version: clientVersion
      osVersion: osVersion
      device: device
    }

class BuildServer extends Server

  constructor: (@options) ->
    @converter = new Converter Paths.application.configs.application
    @clients = {}

    super(@options)

  setRoutes: =>
    @app.get "/", (req, res) =>
      res.redirect("/__appgyver/index.html")

    @app.get "/appgyver/api/applications/1.json", (req, res) =>

      config = @converter.configToAnkaFormat()

      if @options.karmaPort
        config.configuration.fullscreen_start_url = "#{req.protocol}://#{req.host}:#{@options.karmaPort}"
        config.configuration.fullscreen = "true"

      config.archives.push {url: "#{req.protocol}://#{req.host}:#{@options.port}/appgyver/zips/project.zip"}

      request.get { url: "http://127.0.0.1:#{steroidsCli.weinrePort}/target/target-script-min.js#anonymous" }, (err, bettereq, betteres)=>
        unless err
          #TODO detect if debugger is online
          config.configuration.initial_eval_js_string += """
          window.addEventListener("load", function(){
            if (!window.AG_DEBUGGER_INJECTED) {
              e = document.createElement('script');
              e.setAttribute('src','#{req.protocol}://#{req.host}:#{steroidsCli.weinrePort}/target/target-script-min.js#anonymous');
              document.getElementsByTagName('body')[0].appendChild(e);
              window.AG_DEBUGGER_INJECTED = true;
            }
          }, false);
          """

        res.json config

    @app.get "/appgyver/zips/project.zip", (req, res)->
      res.sendfile Paths.temporaryZip

    @app.get "/refresh_client_events?:timestamp", (req, res)=>
      res.header "Access-Control-Allow-Origin", "*"
      res.header('Content-Type', 'text/event-stream')
      res.header('Cache-Control', 'no-cache')
      res.header('Connection', 'keep-alive')

      timestamp = key for key,val of req.query

      id = setInterval ()->

        if fs.existsSync Paths.temporaryZip
          filestamp = fs.lstatSync(Paths.temporaryZip).mtime.getTime()
        else
          filestamp = 0

        if parseInt(filestamp,10) > parseInt(timestamp,10)
          res.write 'event: refresh\ndata: true\n\n'
        else
          res.write 'event: refresh\ndata: false\n\n'

      , 1000

      res.on "close", ()->
        clearInterval id



    @app.options "/__appgyver/logger", (req, res) =>
      res.header "Access-Control-Allow-Origin", "*"
      res.header "Access-Control-Allow-Headers", "Content-Type"

      res.end('')

    @app.post "/__appgyver/logger", (req, res) =>
      res.header "Access-Control-Allow-Origin", "*"
      res.header "Access-Control-Allow-Headers", "Content-Type"
      res.end('')

      logMessage = req.body
      console.log "[#{chalk.cyan('steroids logger')}] #{logMessage.date} - #{logMessage.location} - tab: #{logMessage.screen_id}, layer: #{logMessage.layer_id} \n#{logMessage.message}\n"


    @app.get "/refresh_client?:timestamp", (req, res) =>

      res.header "Access-Control-Allow-Origin", "*"

      clientResolver = new ClientResolver(req)
      resolvedClient = clientResolver.resolve()

      client = if @clients[req.ip]
        @clients[req.ip]
      else

        platform = if resolvedClient.isAndroid
          "android"
        else
          "ios"

        updater = new Updater()
        updater.checkClient
          platform: platform
          version: resolvedClient.version
          simulator: resolvedClient.isSimulator
          osVersion: resolvedClient.osVersion
          device: resolvedClient.device

        {
          ipAddress: req.ip
          firstSeen: Date.now()
          userAgent: req.headers["user-agent"]
          new: true
        }

      client.lastSeen = Date.now()
      @clients[req.ip] = client

      timestamp = key for key,val of req.query

      if fs.existsSync Paths.temporaryZip
        filestamp = fs.lstatSync(Paths.temporaryZip).mtime.getTime()
      else
        filestamp = 0

      if parseInt(filestamp,10) > parseInt(timestamp,10)
        res.send "true"
      else
        res.send "false"


module.exports = BuildServer
