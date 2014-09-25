path = require "path"
pathExtra = require "path-extra"

pathExtra.tempdir()

class Paths

  @npm: path.join __dirname, "..", ".."
  @applicationDir: process.cwd()

  @templatesDir: path.join @npm, "templates"
  @templates:
    applications: path.join @templatesDir, "applications"
    resources: path.join @templatesDir, "resources"
    scaffolds: path.join @templatesDir, "scaffolds"
    gruntfile: path.join @templatesDir, "applications", "default", "Gruntfile.js"
    packageJson: path.join @templatesDir, "applications", "default", "package.json"

  @grunt:
    library: path.join @npm, "node_modules", "grunt", "lib", "grunt"
    gruntfile: path.join @npm, "src", "steroids", "grunt", "grunt.js"

  @bower: path.join @npm, "node_modules", "bower", "bin", "bower"

  @staticFiles: path.join @npm, "public"
  @appgyverStaticFiles: path.join @staticFiles, "__appgyver"
  @oauthSuccessHTML: path.join @appgyverStaticFiles, "login", "oauth2_success.html"

  @scriptsDir: path.join @npm, "support", "scripts"

  @bannersDir: path.join @npm, "support"
  @banners:
    logo: path.join @bannersDir, "logo"
    connect: path.join @bannersDir, "connect"
    attention: path.join @bannersDir, "attention"
    SUCCESS: path.join @bannersDir, "success-caps"
    error: path.join @bannersDir, "error"
    awesome: path.join @bannersDir, "awesome"
    usage: path.join @bannersDir, "usage"
    ready: path.join @bannersDir, "ready"
    resetiOSSim: path.join @bannersDir, "iossim-reset"
    newVersionAvailable: path.join @bannersDir, "new-version-available"
    newClientVersionAvailable: path.join @bannersDir, "new-client-version-available"
    deployCompleted: path.join @bannersDir, "deploy-completed"
    loggedOut: path.join @bannersDir, "loggedout"
    loggedIn: path.join @bannersDir, "loggedin"
    safariListingHeader: path.join @bannersDir, "safari-listing-header"
    dataUsage: path.join @bannersDir, "data-usage"
    legacy:
      requiresDetected: path.join @bannersDir, "legacy-requiresdetected"
      capitalizationDetected: path.join @bannersDir, "legacy-capitalizationdetected"
      specificSteroidsJSDetected: path.join @bannersDir, "legacy-specificsteroidsjsdetected"
      simulatorType: path.join @bannersDir, "legacy-simulatortype"
      serve: path.join @bannersDir, "legacy-serve"
      debugweinre: path.join @bannersDir, "legacy-debugweinre"

  @application:
    appDir: path.join @applicationDir, "app"
    configDir: path.join @applicationDir, "config"
    distDir: path.join @applicationDir, "dist"
    wwwDir: path.join @applicationDir, "www"
    nodeModulesDir: path.join @applicationDir, "node_modules"
    bowerComponentsDir: path.join @applicationDir, "www", "components"

  @application.configs =
    application: path.join @application.configDir, "application.coffee"
    cloud: path.join @application.configDir, "cloud.json"
    bower: path.join @applicationDir, "bower.json"
    grunt: path.join @applicationDir, "Gruntfile.js"
    configIosXml: path.join @application.wwwDir, "config.ios.xml"
    configAndroidXml: path.join @application.wwwDir, "config.android.xml"
    packageJson: path.join @applicationDir, "package.json"
    appgyverSettings: path.join @application.distDir, "__appgyver_settings.json"
    legacy:
      bower: path.join @application.configDir, "bower.json"

  @application.sources =
    controllerDir: path.join @application.appDir, "controllers"
    controllers: path.join @application.appDir, "controllers", "**", "*"
    modelDir: path.join @application.appDir, "models"
    models: path.join @application.appDir, "models", "**", "*"
    viewDir: path.join @application.appDir, "views"
    views: path.join @application.appDir, "views", "**", "*"
    layoutDir: path.join @application.appDir, "views", "layouts"
    staticDir: path.join @applicationDir, "www"
    statics: path.join @applicationDir, "www", "**", "*"

  @application.compiles =
    coffeescripts: path.join @application.distDir, "**", "*.coffee"
    sassfiles: path.join @application.distDir, "**", "*.sass"
    scssfiles: path.join @application.distDir, "**", "*.scss"
    models: path.join @application.distDir, "models", "**", "*"

  @application.compileProducts =
    models: path.join @application.distDir, "models", "models.js"

  @temporaryZip: path.join pathExtra.tempdir(), "steroids_project.zip"
  @vendor: path.join @npm, "vendor"

  @userHome: if process.platform == 'win32' then process.env.USERPROFILE else process.env.HOME
  @storedSettings: path.join @userHome, ".appgyver"
  @oauthTokenPath: path.join @storedSettings, "token.json"

  @rippleBinary: path.join @npm, "node_modules", "ripple-emulator", "bin", "ripple"

  @test:
    basePath: path.join @applicationDir, "test"
    unitTestPath: path.join @applicationDir, "test", "unit"
    functionalTestPath: path.join @applicationDir, "test", "functional"

  @test.karma =
    binaryPath: path.join @npm, "node_modules", "karma", "bin", "karma"
    configFilePath: path.join @test.basePath, "karma.coffee"
    singleConfigFilePath: path.join @test.basePath, "karmaSingle.coffee"
    singleConfigFileLastRunPath: path.join @test.basePath, "karmaSingle.lastrun.coffee"
    templates:
      configPath: path.join @npm, "templates", "tests", "karma", "karma.coffee"
      singleConfigPath: path.join @npm, "templates", "tests", "karma", "karmaSingle.coffee"
      exampleSpecPath: path.join @npm, "templates", "tests", "karma", "spec", "exampleSpec.coffee"

  @iosSim =
    path: path.join @npm, "node_modules", "ios-sim", "dist", "ios-sim"

module.exports = Paths
