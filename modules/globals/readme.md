# Shoptology Node Globals

Registers a couple minimal but handy global objects
that we want in all of our projects.

One is `requireLocal()` which we use to require files
within the current project. For example, `requireLocal( 'controllers/home' )`
would require from the project's code directory
(as set in `paths:code` in our `@shoptology/config` object - defaults
to `app`). This is nice because it removes the need for requiring
relative to the current file and then needing to update the reference
if you move any file locations. It lets the same require line be used
at any place in the codebase.

The other is `log()` which is the `@shoptology/log` instance.

Use `require( '@shoptology/globals' ).register( globals );` to put
them on the global space. Typically this is done right after requiring
`@shoptology/config` and setting up the config object.

