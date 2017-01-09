// Look up domain info via whois
export default
    cmd => hostname =>
        cmd(`whois ${hostname}`)
            .then(rejectIfNoMatch(hostname))

export const rejectIfNoMatch =
    hostname => whoisInfo => {
        const matches = whoisInfo.match(nomatchRx)
        if (matches) {
            throw new Error(`No whois information for ${hostname}`)
        }
        return whoisInfo
    }

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

const nomatchRx = /^No match for/m
const creationDateRx = /^Creation Date:\s*(.*)\s*$/m
