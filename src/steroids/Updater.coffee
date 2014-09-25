Help = require "./Help"
restler = require "restler"
os = require "os"

Login = require "./Login"

semver = require "semver"

Q = require "q"

class Updater


  constructor: (@options={})->


  getFromEndpoint: (endpointURL, onSuccess) ->

    restler.get(endpointURL).on 'complete', (data) =>
      return if data.errno

      latestVersion = data["version"]

      onSuccess(latestVersion)

  getCurrentUserId: () =>
    currentToken = Login.currentToken()
    currentUserId = if currentToken
      currentToken.user_id
    else
      null


  checkClient: (opts={}) =>
    platform = opts.platform
    currentVersion = opts.version
    simulator = opts.simulator
    osVersion = opts.osVersion
    device = opts.device

    encodedPlatform = encodeURIComponent(platform)
    encodedVersion = encodeURIComponent(currentVersion)
    encodedOsVersion = encodeURIComponent(osVersion)
    encodedDevice = encodeURIComponent(device)

    currentUserId = @getCurrentUserId()

    currentVersion = opts.version

    endpointURL = "https://updates.appgyver.com/v1/client/latest.json?platform=#{encodedPlatform}&version=#{encodedVersion}&os_version=#{encodedOsVersion}&device=#{encodedDevice}&simulator=#{simulator}&user_id=#{currentUserId}"

    @getFromEndpoint endpointURL, (latestVersion) =>

      clientVersionGood = semver.satisfies(semver.clean(currentVersion), ">=#{latestVersion}")

      return if clientVersionGood

      Help.newClientVersionAvailable
        currentVersion: currentVersion
        latestVersion: latestVersion
        platform: platform
        simulator: simulator

  check: (opts={})=>
    deferred = Q.defer()

    currentUserId = @getCurrentUserId()

    currentVersion = steroidsCli.version.getVersion()

    osType = os.type()
    encodedOsType = encodeURIComponent(osType)
    encodedVersion = encodeURIComponent(currentVersion)

    endpointURL = "https://updates.appgyver.com/v1/steroids/latest.json?os=#{encodedOsType}&version=#{encodedVersion}&from=#{opts.from}&user_id=#{currentUserId}"

    @getFromEndpoint endpointURL, (latestVersion) =>

      versionGood = semver.satisfies(semver.clean(currentVersion), ">=#{latestVersion}")

      if versionGood
        deferred.resolve()
        return

      if latestVersion == currentVersion
        console.log "Running latest version of Steroids NPM (#{currentVersion})" if @options.verbose
        deferred.resolve()
        return

      Help.newVersionAvailable(latestVersion)
      deferred.resolve()

    return deferred.promise


module.exports = Updater
