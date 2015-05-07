# Shoptology Logger

Returns a log object. Outputs json logs.
This is intended to be combined with the
`@shoptology/globals` and `@shoptology/config`
packages to add a global `log` object so
writing to the log is as simple as
`log.info( 'my message' );`

The object that is returned is an instance
of a bunyan log. You'll want to have
`npm i -g bunyan` and pipe the node process
output to `bunyan` to convert json to a more
human readable format.

You can create child loggers from this log
to set default vars on all of the child
logs which can be pretty useful for adding
a request id or setting the type of data
being logged for real-time processing
of a unified logging layer.
