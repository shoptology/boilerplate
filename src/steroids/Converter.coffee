fs = require "fs"

Paths = require "./paths"
Config = require "./Config"
CloudConfig = require "./CloudConfig"

class Converter
  constructor: (@configPath)->

  configToAnkaFormat: ->

    config = new Config()
    configObject = config.getCurrent()

    cloudConfig = new CloudConfig().getCurrentSync()
    cloudId = if cloudConfig
      cloudConfig.id
    else
      1

    ankaLikeJSON =
      id: cloudId
      name: configObject.name||"Default name"

    if fs.existsSync Paths.temporaryZip
      ankaLikeJSON.build_timestamp = fs.lstatSync(Paths.temporaryZip).mtime.getTime()

    ankaLikeJSON.configuration = @configurationObject(configObject)
    ankaLikeJSON.appearance = @appearanceObject(configObject)
    ankaLikeJSON.preloads = @preloadsObject(configObject)
    ankaLikeJSON.drawers = @drawersObject(configObject)

    # runtime crashes with empty initialView object
    initialViewObject = @initialViewObject(configObject)
    if initialViewObject?
      ankaLikeJSON.initialView = initialViewObject

    ankaLikeJSON.files = []
    ankaLikeJSON.archives = []

    ankaLikeJSON.bottom_bars = @tabsObject(configObject)

    # legacy stuff
    ankaLikeJSON.authentication = @legacyAuthenticationObject()
    ankaLikeJSON.update = @legacyUpdateObject()

    ankaLikeJSON.hosts = @hostsObject(configObject)

    return ankaLikeJSON

  tabsObject: (config)->
    return [] unless config.tabBar.tabs.length
    return [] if @fullscreen

    tabs = []
    for configTab, i in config.tabBar.tabs
      tab =
        position: i,
        title: configTab.title
        image_path: configTab.icon
        target_url: configTab.location

      tabs.push tab

    return tabs

  hostsObject: (config)->
    return [] unless config.hosts.length

    hosts = []
    for configHost in config.hosts
      host =
        host: configHost

      hosts.push host

    return hosts

  configurationObject: (config)->

    if config.statusBar.enabled == false or config.statusBar.enabled == undefined
      statusBar = "hidden"
    else
      statusBar = config.statusBar.style

    if config.tabBar.enabled == true
      @fullscreen = false
    else
      @fullscreen = true

    return {
      request_user_location: "false"
      fullscreen: "#{@fullscreen}"
      fullscreen_start_url: "#{config.location}"
      splashscreen_duration_in_seconds: 0
      client_version: "edge"
      navigation_bar_style: "#{config.theme}"
      status_bar_style: statusBar
      initial_eval_js_string: ""
      background_eval_js_string: ""
      wait_for_document_ready_before_open: "true"
      open_clicked_links_in_new_layer: "false"
      shake_gesture_enabled_during_development: "false"
      copy_to_user_files: @userFilesObject(config)
    }

  appearanceObject: (config)->
    appearanceObject =
      nav_bar_portrait_background_image: "#{config.navigationBar.portrait.backgroundImage}"
      nav_bar_landscape_background_image: "#{config.navigationBar.landscape.backgroundImage}"
      nav_bar_tint_color: "#{config.navigationBar.tintColor}"
      nav_bar_title_text_color: "#{config.navigationBar.titleColor}"
      nav_bar_title_shadow_color: "#{config.navigationBar.titleShadowColor}"
      nav_bar_button_tint_color: "#{config.navigationBar.buttonTintColor}"
      nav_bar_button_title_text_color: "#{config.navigationBar.buttonTitleColor}"
      nav_bar_button_title_shadow_color: "#{config.navigationBar.buttonShadowColor}"
      tab_bar_background_image: "#{config.tabBar.backgroundImage}"
      tab_bar_tint_color: "#{config.tabBar.tintColor}"
      tab_bar_button_title_text_color: "#{config.tabBar.tabTitleColor}"
      tab_bar_button_title_shadow_color: "#{config.tabBar.tabTitleShadowColor}"
      tab_bar_selected_icon_tint_color: "#{config.tabBar.selectedTabTintColor}"
      tab_bar_selected_indicator_background_image: "#{config.tabBar.selectedTabBackgroundImage}"
      loading_screen_color: "#{config.loadingScreen.tintColor}"

    # legacy support: bug in 3.1.5 client causes empty strings for these values to crash
    unless config.navigationBar.borderSize is null or config.navigationBar.borderSize is ""
      appearanceObject.nav_bar_border_size = "#{config.navigationBar.borderSize}"

    unless config.navigationBar.borderColor is null or config.navigationBar.borderColor is ""
      appearanceObject.nav_bar_border_color = "#{config.navigationBar.borderColor}"

    return appearanceObject

  preloadsObject: (config)->
    return [] unless config.preloads?.length

    preloads = []

    for preloadView in config.preloads
      preloads.push preloadView

    return preloads

  drawersObject: (config)->
    return {} unless config.drawers?

    drawersObject = config.drawers

    # strechDrawer typo fix
    if drawersObject.options?.stretchDrawer?
      drawersObject.options.strechDrawer = drawersObject.options.stretchDrawer

    return drawersObject

  initialViewObject: (config)->
    return config.initialView || null # runtime crashes with empty object

  userFilesObject: (config)->
    userFilesObject = []

    for file in config.copyToUserFiles
      userFilesObject.push file

    return userFilesObject

  legacyAuthenticationObject: ->
    return {
      title: "Log in recommended"
      link_types: [ ]
      message: "You should login to use Facebook. You can also login later for commenting etc."
      cancel_button_text: "Back"
    }

  legacyUpdateObject: ->
    return {
      minimum_required_version: "2.0",
      update_recommendation_url: "http://store.apple.com/",
      title: "Update found",
      text: "You should update",
      current_version: "2.0"
    }


module.exports = Converter
