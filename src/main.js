import { exec } from 'child_process'
import { parse } from 'url'
import { fromNode } from 'creed'
import { compose, before, after, errorHandler } from './fn'
import { firstWhere } from './async'
import whois, { creationDate } from './whois'
import { expandDomains } from './domain'
import domainsJson from '../data/domains.json'
import { logistic } from './curve'

export const main =
    () => {
        // TODO: validate argument(s)
        const url = process.argv[2]
        if (!url) throw new Error('Please specify a url.')
        // const url = 'http://blog.sciam.com/this-is-a-test'
        const hostname = extractHostname(url)
        const domains = expandDomains(hostname)
        const now = new Date()
        const ageValue = compose(ageSigmoid, yearsAgo(now))
        // const ageValue = yearsAgo(now)
        return Promise
            .all([
                getWhoisInfo(domains).then(creationDate).then(ageValue),
                getDomainInfo(domains)
            ])
            // TODO: transformToWeightedScore
            .then(
                ([creationDate, { veracity }]) => ({ creationDate, veracity })
            )
            .then(console.log, console.error)
    }

// Functions to convert creation date to a value
const yearsAgo =
    recentDate => oldDate =>
        Math.max(0, recentDate - oldDate) / 1000 / 60 / 60 / 24 / 365
const ageSigmoid = logistic(0, 4, 1, -3)

// Compose some logging functions
const adviceHandler = errorHandler(console.error)
const logger = msg => adviceHandler((...x) => console.log(msg, ...x))

const extractHostname = url => parse(url).hostname

// Compose some functions to iteratively try domains from a hostname.
const domainOps = op => hostname =>
    expandDomains(hostname)
        .map(domain => () => op(domain))
const isDefined = x => typeof x !== 'undefined'
const firstDefined = firstWhere(isDefined)

// Compose a function to lookup domain info for a hostname
const domainLookupOp =
    before(
        logger('Domain info lookup:'),
        domain => Promise.resolve(domainsJson[domain])
    )
// const getDomainInfo = compose(firstDefined, domainOps(domainLookupOp))
const getDomainInfo = firstDefined(domainLookupOp)

// Compose a function that can be used to call shell commands
// TODO: move this to its own module
class ShellError extends Error {}
const execTo2Arg = exec => (command, cb) => exec(command, execCbHandler(cb))
const execCbHandler =
    cb => (err, stdout, stderr) =>
        err ? cb(err) : stderr ? cb(new ShellError(stderr)) : cb(undefined, stdout)
const shellCommand = fromNode(execTo2Arg(exec))

// Compose a function to lookup whois info for a hostname
const whoisCommand = whois(shellCommand)
const whoisOp =
    before(
        logger('Whois:'),
        domain => whoisCommand(domain)
    )
const getWhoisInfo = firstDefined(whoisOp)
