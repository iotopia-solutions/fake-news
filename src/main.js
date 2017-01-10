import { exec } from 'child_process'
import { parse } from 'url'
import { fromNode } from 'creed'
import whois, { creationDate } from './whois'
import { domainInfoFromUrl, reducingHostnameFinder } from './domain'
import domainsJson from './domain/domains.json'

export const main =
    () => {
        // TODO: validate argument(s)
        // TODO: reuse reducingHostnameFinder by allowing user to enter finder
        const url = process.argv[2]
        // const url = 'http://blog.sciam.com/this-is-a-test'
        const whoisCommand = whois(shellCommand)
        const extractHostname = url => parse(url).hostname
        const findDomainInfo = reducingHostnameFinder(domainsJson)
        const getDomainInfo = domainInfoFromUrl(findDomainInfo, extractHostname)
        return Promise
            .all([
                // TODO: whois command that tries most specific domain first.
                whoisCommand('sciam.com').then(creationDate),
                getDomainInfo(url)
            ])
            // TODO: transformToWeights
            // TODO: transform creationDate to age in range 0 to 1
            .then(
                ([creationDate, { veracity }]) =>
                    ({ creationDate, veracity })
            )
            .then(console.log, console.error)
    }

// Compose a function that can be used to call shell commands
const execTo2Arg =
    exec => (command, cb) =>
        exec(command, execCbHandler(cb))
const execCbHandler =
    cb => (err, stdout, stderr) =>
        err
            ? cb(err)
            : stderr ? cb(new Error(stderr)) : cb(undefined, stdout)
const shellCommand = fromNode(execTo2Arg(exec))
