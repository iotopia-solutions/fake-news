// A simple test runner.
export default
    (assert, pass, fail) => {
        const runOne = testRunner(assert, pass, fail)
        const runObj = (tests, parentName) => {
            const results =
                Object.keys(tests).reduce(
                    (acc, name) => {
                        const dispName = parentName + '.' + name
                        return acc.concat(
                            typeof tests[name] === 'object'
                                ? runObj(tests[name], dispName)
                                : runOne(tests[name], dispName)
                        )
                    },
                    []
                )
            return results.length > 0
                ? results
                : fail(parentName, new RunnerError('No tests!'))
        }
        return tests => Promise.all(runObj(tests, '(main)'))
    }

export const testRunner =
    (assert, pass, fail) => (test, name) => {
        const [ assertCount, myAssert ] = assertCounter(assert)
        return Promise.resolve(myAssert)
            .then(test)
            .then(() => {
                const count = assertCount()
                if (count === 0) {
                    throw new RunnerError('No Assertions!')
                }
                return pass(name, count)
            })
            .catch((e) => fail(name, e))
    }

export const assertCounter =
    (assert, count=0) => {
        const getCount = () => count
        const withCount = f => (...x) => (++count, f(...x))
        const assertWithCount = withCount(assert)
        Object.keys(assert).forEach(
            key => assertWithCount[key] = withCount(assert[key])
        )
        return [ getCount, assertWithCount ]
    }

export const success =
    (name, assertions) =>
        ({ name, assertions })

export const failure =
    (name, e) =>
        ({ name, error: String(e) })

export const failureWithStack =
    (name, e) =>
        e instanceof RunnerError
            ? failure(name, e)
            : ({ name, error: String(e), stack: e.stack })

export class RunnerError extends Error {}
