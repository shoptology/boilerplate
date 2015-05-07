fs = require "fs"
paths = require "./paths"
Q = require "q"
chalk = require "chalk"
Help = require "./Help"
xml2js = require "xml2js"

module.exports = class ConfigXmlValidator

  check: (platform) ->

    deferred = Q.defer()

    parser = new xml2js.Parser()

    if platform is "ios"
      path = paths.application.configs.configIosXml
    else if platform is "android"
      path = paths.application.configs.configAndroidXml
    else
      deferred.reject()

    fs.exists path, (exists) ->
      if !exists
        deferred.resolve() # don't do anything if config.*.xml doesn't exist
      else
        fs.readFile path, (err, data) ->
          parser.parseString data, (err, result) ->
            if result is undefined
              msg =
                """
                #{chalk.red.bold("config.#{platform}.xml is not valid XML")}
                #{chalk.red.bold("==============================")}

                It looks like your #{chalk.bold("www/config.#{platform}.xml")} file is not valid XML. Please ensure its validity.

                If the file is beyond recovery, you can create a new project with

                  #{chalk.bold("$ steroids create projectName")}

                and copy the #{chalk.bold("www/config.#{platform}.xml")} over from the new project.

                """
              deferred.reject msg
            else if !result.widget?
              androidAddenum =
                """
                \nA project created with Steroids CLI 2.7.x will have a #{chalk.bold("<cordova>")} element as the root element of
                #{chalk.bold("www/config.android.xml")}. Make sure you replace the #{chalk.bold("<cordova>")} element with the #{chalk.bold("<widget>")} element.

                """

              msg =
                """
                  #{chalk.red.bold("No <widget> root element found in config.#{platform}.xml")}
                  #{chalk.red.bold("================================================")}

                  It looks like your #{chalk.bold("www/config.#{platform}.xml")} file has no #{chalk.bold("<widget>")} element at its root.
                  This element is required for Steroids to function. A proper #{chalk.bold("<widget>")} element looks something like:

                    #{chalk.bold("<widget id=\"com.appgyver.helloSteroids\" version=\"2.0.0\" xmlns=\"http://www.w3.org/ns/widgets\">")}
                  #{
                    if platform is "android"
                      androidAddenum
                    else
                      ""
                  }
                  Please ensure that your project's #{chalk.bold("www/config.#{platform}.xml")} is properly set up. You can run

                    #{chalk.bold("$ steroids create myProjectName")}

                  to create a new project to see how the #{chalk.bold("www/config.#{platform}.xml")} file should look like, or
                  take a look at

                    #{chalk.underline("http://guides.appgyver.com/steroids/guides/project_configuration/config-xml-#{platform}/")}

                  for an overview of the new #{chalk.bold("config.#{platform}.xml")} format.

                """
              deferred.reject msg
            else if result.widget.plugins?
              msg =
                """
                #{chalk.red.bold("<plugins> element found in config.#{platform}.xml")}
                #{chalk.red.bold("=========================================")}

                It looks like your #{chalk.bold("www/config.#{platform}.xml")} file has a #{chalk.bold("<plugins>")} element, which is deprecated as of Steroids
                CLI v3.1.0. This is likely because your project was built with a pre-3.1.0 Steroids CLI version.

                To get rid of this message, you need to remove the #{chalk.bold("<plugins>")} element (plus all subelements) from your
                #{chalk.bold("www/config.#{platform}.xml")}. The core plugins (and the necessary JavaScripts) are now included automatically.
                The same applies to any custom plugins installed via the Build Service. Read more in the migration guide
                linked below.

                While you're at it, you should also upgrade your #{chalk.bold("www/config.#{platform}.xml")} to match the
                new form introduced by Steroids CLI v3.1.0.

                To ensure we don't overwrite any of your custom configs, we won't upgrade your config file automatically.
                Instead, you should go through the migration steps at

                  #{chalk.underline("http://guides.appgyver.com/steroids/guides/steroids-js/cordova-3-1-migration/")}

                """
              deferred.reject msg
            else
              deferred.resolve()

    return deferred.promise
