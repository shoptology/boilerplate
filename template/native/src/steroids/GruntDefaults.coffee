chalk = require "chalk"
Paths = require "./paths"
fs = require "fs"

registerMigrationTasks = (grunt)->

  grunt.registerTask 'check-cordova-js-paths', "Checks for deprecated cordova.js paths in all HTML files", ->
    results = []
    grunt.file.recurse Paths.applicationDir, (abspath, rootdir, subdir, filename)->
      if subdir?.indexOf("dist") != 0 and subdir?.indexOf("node_modules") != 0 and filename.indexOf(".html") > -1
        contents = grunt.file.read abspath
        if contents.indexOf("/appgyver/cordova.js") > -1
          subdir = subdir || ""
          results.push(subdir + "/" + filename)

    if results.length > 0
      console.log(
        """
        \n#{chalk.red.bold("Warning!")} The following files might have erroneous #{chalk.bold("cordova.js")} load paths:
        """
      )
      for result in results
        console.log("  - #{result}")

      console.log(
        """
        \n#{chalk.bold.red("MANUAL ACTION NEEDED")}
        #{chalk.bold.red("====================")}

        You need to fix the #{chalk.bold("cordova.js")} load paths for the above files, or your app might not function.
        """
      )

module.exports =
  registerMigrationTasks: registerMigrationTasks
