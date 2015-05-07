fs = require "fs"

Paths = require "./paths"
Config = require "./Config"

class DeployConverter

  constructor: ()->
    config = new Config()
    @config = config.getCurrent()

  applicationCloudSchemaRepresentation: ->

    name: @config.name || "New project"
    framework_id: 13
    navigation_bar_style: @config.theme
    status_bar_style: @statusBarStyle()
    fullscreen: not @config.tabBar.enabled
    fullscreen_start_url: @config.location
    client_version: "edge"
    initial_eval_js_string: ""
    background_eval_js_string: ""
    latest_build_built_by: "steroids"
    nav_bar_portrait_background_image: @config.navigationBar.portrait.backgroundImage
    nav_bar_landscape_background_image: @config.navigationBar.landscape.backgroundImage
    nav_bar_tint_color: @config.navigationBar.tintColor
    nav_bar_title_text_color: @config.navigationBar.titleColor
    nav_bar_title_shadow_color: @config.navigationBar.titleShadowColor
    nav_bar_button_tint_color: @config.navigationBar.buttonTintColor
    nav_bar_button_title_text_color: @config.navigationBar.buttonTitleColor
    nav_bar_button_title_shadow_color: @config.navigationBar.buttonShadowColor
    tab_bar_background_image: @config.tabBar.backgroundImage,
    tab_bar_tint_color: @config.tabBar.tintColor
    tab_bar_button_title_text_color: @config.tabBar.tabTitleColor
    tab_bar_button_title_shadow_color: @config.tabBar.tabTitleShadowColor
    tab_bar_selected_icon_tint_color: @config.tabBar.selectedTabTintColor
    tab_bar_selected_indicator_background_image: @config.tabBar.selectedTabBackgroundImage
    loading_screen_color: @config.loadingScreen.tintColor
    wait_for_document_ready_before_open: @config.wait_for_document_ready_before_open ? "true"
    open_clicked_links_in_new_layer: @config.open_clicked_links_in_new_layer ? "false"
    shake_gesture_enabled_during_development: @config.shake_gesture_enabled_during_development ? "false"
    tabs: @tabsCloudSchemaRepresentation()
    hosts: @hostsCloudSchemaRepresentation()

  hostsCloudSchemaRepresentation: ->
    return [] unless @config.hosts?

    hosts = []
    for configHost in @config.hosts
      host =
        host: configHost

      hosts.push host

    return hosts

  tabsCloudSchemaRepresentation: ->
    if @config.tabBar?.tabs?

      betterTabs = []
      for configTab, i in @config.tabBar.tabs
        tab =
          title: configTab.title
          icon: configTab.icon
          location: configTab.location

        betterTabs.push tab

      return betterTabs
    else
      return []

  statusBarStyle: ->
    unless @config.statusBar?.enabled? && @config.statusBar.enabled == true
      "hidden"
    else
      @config.statusBar.style


module.exports = DeployConverter
