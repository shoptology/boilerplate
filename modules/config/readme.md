# Shoptology Node Config

Returns a config object using environment vars.
If a .env file exists at the root of the project,
it will load that to set environment vars.
Returns the nconf instance which has get/set/defaults/overrides.
[https://github.com/indexzero/nconf](https://github.com/indexzero/nconf)

Use two underscores `__` to nest paths and create sub-objects. So an envrionment var
`database__host=127.0.0.1` would cause
`require( '@shoptology/config' ).get( 'database' )`
to return `{ host: '127.0.0.1' }`.
