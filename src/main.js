import { exec } from 'child_process'
import { parse } from 'url'
import { fromNode } from 'creed'
import whois, { creationDate } from './whois'
import { domainInfo, findByReducingHostname } from './domain'
import domainsJson from './domain/domains.json'

export const main =
    () => {
        const url = 'http://blog.sciam.com/this-is-a-test'
        const whoisCommand = whois(shellCommand)
        const extractHostname = url => parse(url).hostname
        const findDomainInfo = findByReducingHostname(domainsJson)
        const getDomainInfo = domainInfo(findDomainInfo, extractHostname)
        return Promise
            .all([
                // TODO: whois command that tries most specific domain first.
                whoisCommand('sciam.com').then(creationDate),
                getDomainInfo(url)
            ])
            .then(console.log, console.error)
    }

// Compose a function that can be used to call shell commands
const execTo2Arg =
    exec => (command, cb) =>
        exec(
            command,
            (err, stdout, stderr) =>
                err
                    ? cb(err)
                    : stderr ? cb(new Error(stderr)) : cb(undefined, stdout)
        )
const shellCommand = fromNode(execTo2Arg(exec))
