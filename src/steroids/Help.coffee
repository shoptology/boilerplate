path = require "path"
paths = require "./paths"
colorize = require "colorize"
chalk = require "chalk"


class Help

  @usage: ->
    @printBanner(paths.banners.usage, true)

  @dataUsage: ->
    @printBanner(paths.banners.dataUsage, true)

  @deployCompleted: ->
    @printBanner(paths.banners.deployCompleted, true)

  @attention: ->
    @printBanner(paths.banners.attention, true)

  @awesome: ->
    @printBanner(paths.banners.awesome, true)

  @SUCCESS: ->
    @printBanner(paths.banners.SUCCESS, true)

  @error: ->
    @printBanner(paths.banners.error, true)

  @connect: ->
    @printBanner(paths.banners.connect, true)

  @projectCreated: (path)->
    @printBanner(paths.banners.ready, true)
    console.log(
      """
        Now go to your project directory with

          #{chalk.bold("$ cd #{path}")}

        And then type

          #{chalk.bold("$ steroids connect")} or #{chalk.bold("$ steroids usage")} for more options

      """
    )

  @logo: ->
    @printBanner(paths.banners.logo, true)

  @newVersionAvailable: (version) ->
    @attention()
    @printBanner(paths.banners.newVersionAvailable, true)

  @newClientVersionAvailable: (opts) ->
    @attention()
    @printBanner(paths.banners.newClientVersionAvailable, true)
    console.log """

      You have: #{opts.currentVersion}
      Latest available is: #{opts.latestVersion}
    """

    if opts.platform == "android"
      console.log """

        Please update from Google Play.

      """
    else
      console.log """

        Please update from App Store.

      """


  @loggedOut: ->
    @printBanner(paths.banners.loggedOut, true)

  @loggedIn: ->
    @printBanner(paths.banners.loggedIn, true)
  @listGenerators: ->
    Generators = require "./Generators"

    for name, generator of Generators
      console.log(
        """
        -------------------------

        #{chalk.bold(name)}

        Usage: #{chalk.green.bold("steroids generate #{name} #{chalk.cyan(generator.usageParams())}")}

        #{generator.usage()}

        """
      )

  @deployRequiredForData: ->
    @error()
    console.log(
      """
      Could not find file #{chalk.bold('config/cloud.json')}.

      Your application needs to be deployed to AppGyver Cloud
      before using Steroids Data. Please run:

        #{chalk.bold('$ steroids deploy')}

      """
    )

  @connectError: (errorMessage)->
    @error()
    console.log(
      """
      #{errorMessage} Please check your
      Internet connection.

      In case of a service outage, more information is available at

        #{chalk.underline('http://status.appgyver.com')}

      """
    )

  @legacy:
    requiresDetected: ->
      Help.printBanner(paths.banners.legacy.requiresDetected, true)

    capitalizationDetected: ->
      Help.printBanner(paths.banners.legacy.capitalizationDetected, true)

    specificSteroidsJSDetected: ->
      Help.printBanner(paths.banners.legacy.specificSteroidsJSDetected, true)

    simulatorType: ->
      Help.printBanner(paths.banners.legacy.simulatorType, true)

    serve: ->
      Help.printBanner(paths.banners.legacy.serve, true)

    debugweinre: ->
      Help.printBanner(paths.banners.legacy.debugweinre, true)

  @safariListingHeader: ->
    @printBanner(paths.banners.safariListingHeader, true)

  @resetiOSSim: ->
    @printBanner(paths.banners.resetiOSSim, true)

  @readContentsSync: (filename) ->
    fs = require "fs"
    return fs.readFileSync(filename).toString()

  @printBanner: (filename, color=false) ->

    contents = @readContentsSync(filename)

    if color
      colorize.console.log  contents
    else
      console.log contents



module.exports = Help