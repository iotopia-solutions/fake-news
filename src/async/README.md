# async

A collection of functions that help wrangle asynchronous operations (
functions that return promises).

Some of these functions use Brian Cavalier's creed for coroutines.

`chain` is useful for making a promise pipeline prettier:

```js
// op1 and op2 are equivalent
const op1 = chain(first, second, third)
const op2 = value => first(value).then(second).then(third)
```

`firstWhere` helped me sequence an operation over several possible inputs,
selecting the one whose async result satisfied a specific criteria.
Rather than use a naive `Promise.all(everyPossibleOperation)`, successive
operations are only tried if earlier ones fail to provide the desired output.

```js
const firstValidOutput = firstWhere(isValidOutput)
const getFirstValidOutput = firstValidOutput(myAsyncOp)
const value = getFirstValidOutput(['first', 'second', 'third'])
```
