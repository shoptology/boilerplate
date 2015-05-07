semver = require "semver"
rimraf = require "rimraf"
path = require "path"
fs = require "fs"

paths = require "./paths"
sbawn = require "./sbawn"

events = require "events"
Q = require "q"
chalk = require "chalk"
Help = require "./Help"
inquirer = require "inquirer"

class ApplicationConfigUpdater extends events.EventEmitter

  validateSteroidsEngineVersion: (versionNumber)->
    semver.satisfies @getSteroidsEngineVersion(), versionNumber

  getSteroidsEngineVersion: ->
    packageJson = if fs.existsSync paths.application.configs.packageJson
      packageJsonContents = fs.readFileSync paths.application.configs.packageJson, 'utf-8'
      JSON.parse packageJsonContents

    packageJson?.engines?.steroids

  # 3.1.0 MIGRATION:
  # - cordova.js not loaded from /appgyver/
  # - package.json exists
  # - engines.steroids exists at "3.1.0"
  updateTo3_1_0: ->
    deferred = Q.defer()

    if @validateSteroidsEngineVersion(">=3.1.0")
      deferred.resolve()
    else
      @checkCordovaJsPaths().then( =>
        @ensurePackageJsonExists()
      ).then( =>
        @ensureSteroidsEngineIsDefinedWithVersion("3.1.0")
      ).then( ->
        deferred.resolve()
      ).fail (msg)->
        msg = msg ||
          """
          \n#{chalk.bold.red("Migration aborted")}
          #{chalk.bold.red("=================")}

          Please read through the instructions again!

          """
        deferred.reject(msg)

    return deferred.promise

  # 3.1.4 MIGRATION
  # -
  updateTo3_1_4: ->
    deferred = Q.defer()

    if @validateSteroidsEngineVersion(">=3.1.4")
      deferred.resolve()
    else
      steroidsEngineVersion = @getSteroidsEngineVersion() || "undefined"
      Help.attention()
      console.log(
        """
        #{chalk.bold("engine.steroids")} was #{chalk.bold(steroidsEngineVersion)} in #{chalk.bold("package.json")}, expected #{chalk.bold(">=3.1.4")}

        This is likely because your project was created with an older version of Steroids CLI. We will
        now run through a few migration tasks to ensure that your project functions correctly.

        """
      )

      promptConfirm().then( =>
        @updateTo3_1_0()
      ).then( =>
        @ensureGruntfileExists()
      ).then( =>
        @ensureGruntfileContainsSteroids()
      ).then( =>
        @ensurePackageJsonExists()
      ).then( =>
        @ensureGruntDependency()
      ).then( =>
        @ensureSteroidsEngineIsDefinedWithVersion("3.1.4")
      ).then( =>
        Help.SUCCESS()
        console.log chalk.green("Migration successful, moving on!")
        deferred.resolve()
      ).fail (msg)->
        msg = msg ||
          """
          \n#{chalk.bold.red("Migration aborted")}
          #{chalk.bold.red("=================")}

          Please read through the instructions again!

          """
        deferred.reject(msg)

    return deferred.promise

  updateTo3_1_9: ->
    deferred = Q.defer()

    if @validateSteroidsEngineVersion(">=3.1.9")
      deferred.resolve()
    else
      steroidsEngineVersion = @getSteroidsEngineVersion() || "undefined"
      Help.attention()
      console.log(
        """
        #{chalk.bold("engine.steroids")} was #{chalk.bold(steroidsEngineVersion)} in #{chalk.bold("package.json")}, expected #{chalk.bold(">=3.1.9")}

        This is likely because your project was created with an older version of Steroids CLI. We will
        now run through a few migration tasks to ensure that your project functions correctly.

        """
      )

      promptConfirm().then( =>
        @updateTo3_1_0()
      ).then( =>
        @updateTo3_1_4()
      ).then( =>
        @ensurePackageJsonExists()
      ).then( =>
        @ensureNoBadGruntDeps()
      ).then( =>
        @ensureSteroidsEngineIsDefinedWithVersion("3.1.9")
      ).then( =>
        Help.SUCCESS()
        console.log chalk.green("Migration successful, moving on!")
        deferred.resolve()
      ).fail (msg)->
        msg = msg ||
          """
          \n#{chalk.bold.red("Migration aborted")}
          #{chalk.bold.red("=================")}

          Please read through the instructions again!

          """
        deferred.reject(msg)

    return deferred.promise

  checkCordovaJsPaths: ->
    deferred = Q.defer()

    console.log(
      """
      \nFirst up, the load path for #{chalk.bold("cordova.js")} has changed in Steroids CLI v3.1.0. The deprecated path is

        #{chalk.underline.red("http://localhost/appgyver/cordova.js")}

      or any subfolder of localhost. The required path for Steroids CLI 3.1.0 and newer is

        #{chalk.underline.green("http://localhost/cordova.js")}

      We will now search through your project's HTML files to see if there are any deprecated load paths.

      """
    )

    promptConfirm().then( ->

      gruntSbawn = sbawn
        cmd: steroidsCli.pathToSelf
        args: ["grunt", "--task=check-cordova-js-paths", "--gruntfile=#{paths.grunt.gruntfile}"]
        stdout: true
        stderr: true

      gruntSbawn.on "exit", () =>
        if gruntSbawn.code == 0
          promptUnderstood().then( ->
            deferred.resolve()
          ).fail ->
            deferred.reject()
        else
          console.log("Failed to run Grunt task #{chalk.bold("check-cordova-js-paths")}.")
          process.exit(1)

    ).fail ->
      deferred.reject()

    return deferred.promise

  ensurePackageJsonExists: ->
    deferred = Q.defer()

    console.log("Checking to see if #{chalk.bold("package.json")} exists in project root...")

    if fs.existsSync paths.application.configs.packageJson
      console.log chalk.green("OK!")
      deferred.resolve()
    else
      console.log(
        """
          \n#{chalk.red.bold("Could not find package.json in project root")}
          #{chalk.red.bold("===========================================")}

          We could not find a #{chalk.bold("package.json")} file in project root. This is required
          for project npm dependencies and the #{chalk.bold("engines.steroids")} field.

          We will create the file now.

        """
      )

      promptConfirm().then( ->
        console.log("\nCreating #{chalk.bold("package.json")} in project root...")
        fs.writeFileSync paths.application.configs.packageJson, fs.readFileSync(paths.templates.packageJson)
        console.log("#{chalk.green("OK!")}")
        deferred.resolve()
      ).fail ->
        deferred.reject()

    return deferred.promise

  ensureSteroidsEngineIsDefinedWithVersion: (version)->
    deferred = Q.defer()

    if @validateSteroidsEngineVersion(version)
      console.log("\n#{chalk.bold("engine.steroids")} in #{chalk.bold("package.json")} is #{chalk.bold(version)}, moving on!")
      deferred.resolve()
    else
      console.log("Setting #{chalk.bold("engine.steroids")} in #{chalk.bold("package.json")} to #{chalk.bold(version)}...")
      if fs.existsSync paths.application.configs.packageJson
        packageJsonData = fs.readFileSync paths.application.configs.packageJson, 'utf-8'
        packageJson = JSON.parse(packageJsonData)

        if !packageJson.engines?
          packageJson.engines = { steroids: version }
        else
          packageJson.engines.steroids = version

        packageJsonData = JSON.stringify packageJson, null, 2
        fs.writeFileSync paths.application.configs.packageJson, packageJsonData
        console.log chalk.green("OK!")
        deferred.resolve()
      else
        deferred.reject()

    return deferred.promise

  # 3.1.4 migration tasks
  ensureGruntfileExists: ->
    deferred = Q.defer()

    console.log "Checking to see if #{chalk.bold("Gruntfile.js")} exists in project root..."
    if fs.existsSync paths.application.configs.grunt
      console.log chalk.green("OK!")
      deferred.resolve()
    else
      Help.attention()
      console.log(
        """
        \n#{chalk.green.bold("New feature")}
        #{chalk.green.bold("===========")}

        To build the #{chalk.bold("dist/")} folder, Steroids now uses a Gruntfile.js file directly from the project
        root directory. The tasks are defined in the #{chalk.bold("grunt-steroids")} Grunt plugin, installed as a
        npm dependency.

        To learn more about the new Grunt setup, see:

          #{chalk.underline("http://guides.appgyver.com/steroids/guides/project_configuration/gruntfile")}

        We will first create the default #{chalk.bold("Gruntfile.js")} file to your project root.

        """
      )

      promptConfirm().then( ->

        console.log "\nCreating new #{chalk.bold("Gruntfile.js")} in project root..."

        fs.writeFileSync(paths.application.configs.grunt, fs.readFileSync(paths.templates.gruntfile))

        console.log chalk.green("OK!")

        deferred.resolve()

      ).fail ->
        deferred.reject()

      return deferred.promise

  ensureGruntfileContainsSteroids: ->
    deferred = Q.defer()

    console.log "Checking to see if project #{chalk.bold("Gruntfile.js")} loads tasks from the #{chalk.bold("grunt-steroids")} plugin..."

    gruntfileData = fs.readFileSync paths.application.configs.grunt, 'utf-8'

    if gruntfileData.indexOf("grunt.loadNpmTasks(\"grunt-steroids\")") > -1
      console.log chalk.green("OK!")
      deferred.resolve()
    else
      Help.attention()
      console.log(
        """
        #{chalk.red.bold("Existing Gruntfile.js doesn't load grunt-steroids tasks")}
        #{chalk.red.bold("=======================================================")}

        Breaking update ahead!

        To build the #{chalk.bold("dist/")} folder, Steroids now uses a #{chalk.bold("Gruntfile.js")} file directly from the
        project root directory. The tasks are defined in the #{chalk.bold("grunt-steroids")} Grunt plugin.

        #{chalk.red.bold("Manual action needed")}
        #{chalk.red.bold("====================")}

        Your existing #{chalk.bold("Gruntfile.js")} isn't loading the required Steroids tasks (defined in the
        #{chalk.bold("grunt-steroids")} Grunt plugin). To get rid of this message, add the following line to
        your #{chalk.bold("Gruntfile.js")} (we're installing the #{chalk.bold("grunt-steroids")} npm package next):

           #{chalk.blue("grunt.loadNpmTasks(\"grunt-steroids\")")};

        Then, you must configure your default Grunt task to include the required Steroids tasks:

           #{chalk.blue("grunt.registerTask('default', ['steroids-make', 'steroids-compile-sass'])")}

        To read more about the new Grunt setup, see:

          #{chalk.underline("http://guides.appgyver.com/steroids/guides/project_configuration/gruntfile")}

        """
      )

      promptUnderstood().then( ->
        deferred.resolve()
      ).fail ->
        deferred.reject()


    return deferred.promise

  ensureGruntDependency: ->
    deferred = Q.defer()

    console.log("Checking #{chalk.bold("package.json")} for the #{chalk.bold("grunt-steroids")} dependency...")
    packagejsonData = fs.readFileSync paths.application.configs.packageJson, 'utf-8'
    if packagejsonData.indexOf("grunt-steroids") > -1

      console.log chalk.green("OK!")

      console.log(
        """
        \n#{chalk.red.bold("npm install required")}
        #{chalk.red.bold("====================")}

        We need to run

          #{chalk.bold("$ npm install")}

        to ensure that the #{chalk.bold("grunt-steroids")} dependency is installed.

        """
      )

      promptConfirm().then( =>
        Npm = require "./Npm"
        npm = new Npm

        npm.install().then( ->
          console.log(
            """
            \n#{chalk.green("OK!")} npm dependencies installed successfully.

            """
          )
          deferred.resolve()
        ).fail ->
          msg =
            """
            \nCould not install npm dependencies.

            Try running the command again, or install the package with

              #{chalk.bold("$ npm install")}

            """
          deferred.reject(msg)
      ).fail ->
        deferred.reject()

    else
      Help.attention()
      console.log(
        """
        \n#{chalk.red.bold("Existing package.json found without grunt-steroids dependency")}
        #{chalk.red.bold("=============================================================")}

        Your existing #{chalk.bold("package.json")} file doesn't have the required #{chalk.bold("grunt-steroids")} Grunt
        plugin as a dependency.

        We will now add the #{chalk.bold("grunt-steroids")} npm package as a dependency to your #{chalk.bold("project.json")}.

        Then, we will run

          #{chalk.bold("npm install")}

        to install it.

        """
      )
      promptUnderstood().then( =>

        @addGruntSteroidsDependency()

      ).then( =>

        Npm = require "./Npm"
        npm = new Npm

        npm.install().then( ->
          console.log(
            """
            \n#{chalk.green("OK!")} Installed the #{chalk.bold("grunt-steroids")} npm package successfully
            and saved it to #{chalk.bold("package.json")} devDependencies.

            """
          )
          deferred.resolve()
        ).fail ->
          msg =
            """
            \nCould not install the #{chalk.bold("grunt-steroids")} npm package.

             Try running the command again, or install the package manually with

              #{chalk.bold("$ npm install grunt-steroids --save-dev")}

            """
          deferred.reject(msg)
      ).fail (msg)->
        deferred.reject(msg)

    return deferred.promise


  ensureNodeModulesDir: ->
    deferred = Q.defer()

    if !fs.existsSync(paths.application.nodeModulesDir)
      msg =
        """
        \n#{chalk.bold.red("node_modules directory not found")}
        #{chalk.bold.red("================================")}

        Directory #{chalk.bold("node_modules")} not found in project root. Steroid requires
        certain npm dependencies to work. Please run

          #{chalk.bold("steroids update")}

        in your project root now to install the required dependencies.

        """
      deferred.reject(msg)
    else
      deferred.resolve()

    return deferred.promise

  addGruntSteroidsDependency: ->
    deferred = Q.defer()

    console.log("Adding #{chalk.bold("grunt-steroids")} devDependency to #{chalk.bold("package.json")}...")

    packageJsonData = fs.readFileSync paths.application.configs.packageJson, 'utf-8'
    packageJson = JSON.parse(packageJsonData)

    if packageJson.devDependencies?
      packageJson.devDependencies["grunt-steroids"] = "0.x"
    else
      packageJson["devDependencies"] =
        "grunt-steroids":"0.x"

    packageJsonData = JSON.stringify packageJson, null, 2
    fs.writeFileSync paths.application.configs.packageJson, packageJsonData

    console.log chalk.green("OK!")

    deferred.resolve()

    return deferred.promise

  ensureNoBadGruntDeps: ->
    deferred = Q.defer()

    console.log "Checking for erroneous npm dependencies..."

    packageJsonData = fs.readFileSync paths.application.configs.packageJson, 'utf-8'
    packageJson = JSON.parse(packageJsonData)

    if (packageJson?.devDependencies?["grunt-extend-config"]? ||
       packageJson?.devDependencies?["grunt-contrib-clean"]? ||
       packageJson?.devDependencies?["grunt-contrib-concat"]? ||
       packageJson?.devDependencies?["grunt-contrib-copy"]? ||
       packageJson?.devDependencies?["grunt-contrib-sass"]? ||
       packageJson?.devDependencies?["grunt-contrib-coffee"]? ||
       packageJson?.devDependencies?["grunt"]?)

      Help.error()
      console.log(
        """
        #{chalk.red.bold("Erroneous npm dependencies found")}
        #{chalk.red.bold("================================")}

        Due to an oversight in our previous migration script, migrated projects' #{chalk.bold("package.json")}
        files ended up having several #{chalk.bold("devDependencies")} that should not be there.

        The misplaced dependencies cause errors if the user removes his #{chalk.bold("node_modules")} directory
        and then runs #{chalk.bold("npm install")} afterwards (this is due to #{chalk.bold("grunt-steroids")} using absolute
        version numbers for its peerDependencies, and npm wanting to use the latest patch
        version).

        Unless you know what you're doing, ensure that your #{chalk.bold("package.json")} has none of the
        following #{chalk.bold("devDependencies")} by deleting them from the file:

          "grunt-extend-config"
          "grunt-contrib-clean"
          "grunt-contrib-concat"
          "grunt-contrib-copy"
          "grunt-contrib-sass"
          "grunt-contrib-coffee"
          "grunt"

        Note that you shouldn't remove the #{chalk.bold("grunt-steroids")} dependency, as that's required by
        Steroids CLI to work!

        """
      )

      promptUnderstood().then( ->
        deferred.resolve()
      ).fail ->
        deferred.reject()

    else
      console.log chalk.green("OK!")
      deferred.resolve()

    return deferred.promise

  # Inquirer utils

  promptConfirm = ->
    prompt "confirm", "Can we go ahead?", true

  promptUnderstood = ->
    prompt "input", "Write here with uppercase letters #{chalk.bold("I UNDERSTAND THIS")}", "I UNDERSTAND THIS"

  promptRunNpmInstall = ->
    prompt "input", "Write #{chalk.bold("npm install grunt-steroids --save-dev")} to continue", "npm install grunt-steroids --save-dev"

  prompt = (type, message, answer) ->
    deferred = Q.defer()

    inquirer.prompt [
        {
          type: type
          name: "userAnswer"
          message: message
        }
      ], (answers) ->
        if answers.userAnswer is answer
          deferred.resolve()
        else
          deferred.reject()

    return deferred.promise

module.exports = ApplicationConfigUpdater
