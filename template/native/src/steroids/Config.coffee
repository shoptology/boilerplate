paths = require "./paths"

class Config

  constructor: ->
    @editor = {}

    @statusBar =
      style: "black"
      enabled: false

    @navigationBar =
      portrait:
        backgroundImage:          ""
      landscape:
        backgroundImage:          ""
      tintColor:                  ""
      titleColor:                 ""
      titleShadowColor:           ""

      buttonTitleColor:           ""
      buttonShadowColor:          ""
      buttonTintColor:            ""

      borderSize:                 ""
      borderColor:                ""

    @theme = "black"

    @location = "http://localhost/index.html"

    @hosts = []
    @tabBar =
      enabled:                    false
      backgroundImage:            ""
      tintColor:                  ""
      tabTitleColor:              ""
      tabTitleShadowColor:        ""
      selectedTabTintColor:       ""
      selectedTabBackgroundImage: ""
      tabs: []

    @loadingScreen =
      tintColor: ""

    @worker =  {}   # what is this?

    @hooks =
      preMake: {}
      postMake: {}

    @watch =
      exclude: []

    # Project files that will be copied to a writable UserFiles directory.
    # File is copied only if it doesn't yet exist in the UserFiles directory.
    @copyToUserFiles = []

  getCurrent: () ->
    # needs to use global, because application.coffee needs to stay require free

    configPath = paths.application.configs.application
    delete require.cache[configPath] if require.cache[configPath]

    global.steroids =
      config: new Config

    require configPath

    return global.steroids.config

module.exports = Config
