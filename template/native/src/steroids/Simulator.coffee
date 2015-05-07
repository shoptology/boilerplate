steroidsSimulators = require "steroids-simulators"
spawn = require("child_process").spawn

sbawn = require("./sbawn")
Help = require "./Help"

os = require "os"
paths = require "./paths"

Q = require "q"

class Simulator

  DEFAULT_DEVICE_TYPE: "iphone_5s"
  SUPPORTED_DEVICE_TYPES: [
    "iphone_4s"
    "iphone_5"
    "iphone_5s"
    "iphone_6"
    "iphone_6_plus"
    "ipad_2"
    "ipad_retina"
    "ipad_air"
    "ipad"
    "iphone_retina_3_5_inch"
    "iphone_retina_4_inch"
  ]

  running: false

  constructor: (@options = {}) ->

  run: (opts={}) =>
    unless os.type() == "Darwin"
      console.log "Error: Simulator requires Mac OS X."
      return false

    @stop()

    @running = true

    cmd = paths.iosSim.path
    args = ["launch", steroidsSimulators.latestSimulatorPath]

    if opts.deviceType?

      # Split into device type and optional, '@'-separated suffix specifying the iOS version (SDK version; e.g., '5.1').
      [ deviceType, iOSVersion ] = opts.deviceType.split('@')

      namespace = "com.apple.CoreSimulator.SimDeviceType."

      switch deviceType
        when "ipad"
          args.push "--family", "ipad"
        when "ipad_retina"
          args.push "--family", "ipad", "--retina"
        when "iphone_retina_3_5_inch"
          args.push "--retina"
        when "iphone_retina_4_inch"
          args.push "--retina", "--tall"
        when "iphone_4s"
          args.push "--devicetypeid", "#{namespace}iPhone-4s"
        when "iphone_5"
          args.push "--devicetypeid", "#{namespace}iPhone-5"
        when "iphone_5s"
          args.push "--devicetypeid", "#{namespace}iPhone-5s"
        when "iphone_6_plus"
          args.push "--devicetypeid", "#{namespace}iPhone-6-Plus"
        when "iphone_6"
          args.push "--devicetypeid", "#{namespace}iPhone-6"
        when "ipad_2"
          args.push "--devicetypeid", "#{namespace}iPad-2"
        when "ipad_air"
          args.push "--devicetypeid", "#{namespace}iPad-Air"

      if iOSVersion?
        args.push "--sdk", iOSVersion

    @killall().then( =>
      steroidsCli.debug "Spawning #{cmd}"
      steroidsCli.debug "with params: #{args}"

      @simulatorSession = sbawn
        cmd: cmd
        args: args
        stdout: if opts.stdout? then opts.stdout  else true
        stderr: if opts.stderr? then opts.stderr else true

      @simulatorSession.on "exit", () =>
        @running = false

        steroidsCli.debug "Killing iOS Simulator ..."

        @killall()

        console.log "PRO TIP: use `steroids [simulator|connect] --deviceType <device>` to specify device type, see `steroids usage` for help."

        return unless ( @simulatorSession.stderr.indexOf('Session could not be started') == 0 )

        Help.attention()
        Help.resetiOSSim()

        setTimeout () =>
          resetSimulator = sbawn
                    cmd: steroidsSimulators.iosSimPath
                    args: ["start"]
                    debug: true
        , 250
    )

  stop: () =>
    @simulatorSession.kill() if @simulatorSession

  killall: ()=>
    deferred = Q.defer()

    killSimulator = sbawn
      cmd: "/usr/bin/pkill"
      args: ["-f", "iOS Simulator"]

    killSimulator.on "exit", () =>
      steroidsCli.debug "Killed iOS Simulator."
      deferred.resolve()

    return deferred.promise

module.exports = Simulator
