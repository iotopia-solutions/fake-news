import { coroutine } from 'creed'

// Given an array of async operations (promise-returning functions),
// returns a function that accepts an input value and pushes the value
// through the sequence of operations, returning a promise for the output
// of the last operation.
export const chain =
    ops =>
        coroutine(
            function* (value) {
                for (const op of ops) {
                    value = yield op(value)
                }
                return value
            }
        )

// Given a predicate and an async operation (promise-returning function),
// returna function that accepts values that will be sequenced as input
// to the operation, returning the first output that passes the predicate.
export const firstWhere =
    predicate => op =>
        coroutine(
            function* (values) {
                for (const value of values) {
                    const result = yield op(value)
                    if (predicate(result)) return result
                }
            }
        )

// const noop = () => Promise.resolve()
// const constant = val => () => Promise.resolve(val)
