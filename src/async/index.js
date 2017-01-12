export const sequence =
    ops =>
        ops.reduce(
            (prev, op) => () => prev().then(op),
            noop
        )

// Return a promise for the first resolved promise returned from an
// array of async operations.  Array is processed from left to right.
// Provide an optional rejecter function to transform a resolved value into
// a rejection.
export const first =
    predicate => ops => {
        const rejectFirst = ops.reduce(
            (prev, op) => () =>
                prev()
                    .then(op)
                    .then(x => { if (predicate(x)) throw x }),
            noop
        )
        return () => rejectFirst().catch(x => x)
    }

// const catchfirst =
//     predicate => ops => () =>
//         first(predicate)(ops)().catch(x=>x)

        // ops.reduce(
        //     (next, op) =>
        //         // TODO: is there a way to remove this Promise.resolve()?
        //         Promise.resolve(op()).then(x => predicate(x) ? x : next),
        //     noop
        // )

export const chain =
    ops =>
        ops.reduce(
            (prev, op) => x => prev(x).then(op),
            x => Promise.resolve(x)
        )

const noop = () => Promise.resolve()
const constant = val => () => Promise.resolve(val)
