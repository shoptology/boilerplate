# Shoptology API Envelope

Provides a configurable object to return a standarized
API response format following emerging standards and best practices.

Foursquare is one of the sites that follows these best practices,
so we can use them as our main point of reference.

[https://developer.foursquare.com/overview/responses](https://developer.foursquare.com/overview/responses)

```
{
    "meta": {
        "code": 200,
        ...errorType and errorDetail...
    },
    "notifications": {
        ...notifications...
    },
    "response": {
        ...results...
    }
}
```
