watchr = require "watchr"

class Watcher

  constructor:(@options) ->

  watch: (path)=>
    watchr.watch
      paths: [path]
      listeners:
        change: (changeType, filePath, fileCurrentStat, filePreviousStat) =>
          if @options.excludePaths?
            for excludePath in @options.excludePaths
              if filePath.indexOf(excludePath) > -1
                steroidsCli.debug "Watcher detected #{filePath} (#{changeType}). It was excluded by '#{excludePath}' excludePaths rule."
                return false

          steroidsCli.debug "Watcher detected #{filePath} (#{changeType})."
          switch changeType
            when "delete"
              @options.onDelete(filePath, fileCurrentStat, filePreviousStat)
            when "create"
              @options.onCreate(filePath, fileCurrentStat, filePreviousStat)
            when "update"
              @options.onUpdate(filePath, fileCurrentStat, filePreviousStat)

module.exports = Watcher
