// A simple test reporter.
export default
    (stdout, stderr) => results => {
        results.forEach(reporterForOne(stdout, stderr))
        return results
    }

const reporterForOne =
    (stdout, stderr) => result =>
        result.error
            ? stderr(formatFail(result))
            : stdout(formatPass(result))

export const formatName =
    name =>
        name.replace(/^\(main\)\./, '').replace(/\./g, ' ')

export const formatPass =
    result => {
        const name = formatName(result.name)
        return `${name}\n  OK (${result.assertions} asserts)`
    }

export const formatFail =
    result => {
        const name = formatName(result.name)
        return result.stack
            ? `${name}\n  FAILED:\n${result.error}\n${result.stack}`
            : `${name}\n  FAILED: ${result.error}`
    }
