paths = require "./paths"
fs = require 'fs'

class CloudConfig

  constructor:(opts={}) ->
    @config =
      id: opts.id
      identification_hash: opts.identification_hash

    @pathToConfig = paths.application.configs.cloud

  saveSync: () ->
    config =
      id: @config.id
      identification_hash: @config.identification_hash

    fs.writeFileSync @pathToConfig, JSON.stringify(config, null, 2)


  getCurrentSync: () ->

    return null unless fs.existsSync @pathToConfig

    configContents = fs.readFileSync @pathToConfig
    config = JSON.parse(configContents)

    return config


module.exports = CloudConfig
