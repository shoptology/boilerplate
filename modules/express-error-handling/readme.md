# Shoptology Express Error Handling

This is a connect/express middleware to be added at the end
of the middleware chain for error handling.

Tries to detect if the current request is a json api
request of not. If it is, it will use our api-envelope
to return and error message. Otherwise, it will use
express' error template.

