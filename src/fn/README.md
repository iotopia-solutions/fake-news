# fn

Helper functions for functional programming.

`compose` is classical functional composition.

`before`, `after`, and `full` use AOP patterns to add side effects to
functions.  Very handy way to declaratively handle side effects.

If the side effects throw, they will fail silently.  To make them loud,
you must handle the errors in the side effects explicitly.  Here's how I
like to do it using the `errorHandler` function in this module:

```js
// Create a function that will handle errors by logging them:
const adviceHandler = errorHandler(console.error)
// Create a function that attempts to performa side effect (here, it
// prints a message and some params), but logs an error if it fails.
const logger = msg => adviceHandler((...x) => print(msg, ...x))
const operationThatAlsoLogs =
    before(
        logger('Look what I logged:'),
        myPureFunction
    )
```
