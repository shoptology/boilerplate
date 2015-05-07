# Shoptology Express Init

This bootstraps an express instance in a standard way
but also exposes each of the bootstrapping methods
if you want to call them in a different way.

Here's the typical usage:

```
var initExpress, app, server;

initExpress = require( 'init-express' );
app = initExpress.app();
requireLocal( 'routes' )( app );
server = initExpress.listen( app );
initExpress.gracefulShutdown( server );
```

