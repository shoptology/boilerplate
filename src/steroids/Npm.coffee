sbawn = require "./sbawn"
chalk = require "chalk"
Q = require "q"

class Npm

  install: (args)->
    deferred = Q.defer()

    if args?
      argsString = args.join(" ")
      console.log(
        """
        \n#{chalk.bold.green("Installing npm package")}
        #{chalk.bold.green("======================")}

        Running #{chalk.bold("npm install #{argsString}")} to install a project dependency...
        If this fails, try running the command manually in the project directory.
        """
      )
    else
      console.log(
        """
        \n#{chalk.bold.green("Installing npm dependencies")}
        #{chalk.bold.green("===========================")}

        Running #{chalk.bold("npm install")} to install project npm dependencies...
        If this fails, try running the command manually.

        """
      )

    argsToRun = ["install"]

    if args?
      argsToRun = argsToRun.concat(args)

    npmRun = sbawn
      cmd: "npm"
      args: argsToRun
      stdout: true
      stderr: true

    npmRun.on "exit", =>
      deferred.resolve()

    return deferred.promise

module.exports = Npm
