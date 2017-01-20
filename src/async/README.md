# async

A collection of functions that help wrangle asynchronous operations (
functions that return promises).

Some of these functions use Brian Cavalier's creed to implement coroutines.

`chain` is useful for making a promise pipeline prettier:

```js
// op1 and op2 are equivalent
const op1 = chain(first, second, third)
const op2 = value => first(value).then(second).then(third)
```

`firstWhere` helped me sequence an operation over several possible inputs,
selecting the one whose async result satisfied a specific criteria.
Since JavaScript's promises are eager, rather than lazy, a naive use of
`Promise.all(everyPossibleOperation)` would launch all operations at once.
I only want to perform later operations if the earlier ones don't
satisfy the criteria.

```js
// Compose a function that tries the inputs 'first', 'second', and 'third'
// one at a time, until the output of `myAsyncOp` returns a truthy value
// from `isValidOutput`:
const firstValidOutput = firstWhere(isValidOutput)
const getFirstValidOutput = firstValidOutput(myAsyncOp)
const value = getFirstValidOutput(['first', 'second', 'third'])
```
