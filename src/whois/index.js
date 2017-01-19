// Look up domain info via whois
export default
    shell => hostname =>
        shell(`whois ${hostname}`)
            .then(checkIfNoMatch(hostname))

// Extract the creation date from whois output text.
export const creationDate =
    whoisInfo => {
        const matches = whoisInfo.match(creationDateRx)
        if (!matches) {
            throw new Error(`Could not find creation date in ${whoisInfo}`)
        }
        const timestamp = Date.parse(matches[1])
        if (isNaN(timestamp)) {
            throw new Error(`Could not parse creation date: ${matches[1]}`)
        }
        return new Date(timestamp)
    }

const checkIfNoMatch =
    hostname => whoisInfo =>
        whoisInfo.match(nomatchRx)
            ? undefined
            : whoisInfo

// RegExps to find things in whois output text.
const nomatchRx = /^No match for/m
const creationDateRx = /^Creation Date:\s*(.*)\s*$/m
