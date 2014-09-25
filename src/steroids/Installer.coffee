class Installer

  @install: () =>
    s = new Installer
    s.install()

  install: ->

    fs = require "fs"

    console.log "installing ..."

module.exports = Installer
