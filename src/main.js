import { exec } from 'child_process'
import { parse } from 'url'
import { fromNode } from 'creed'
import { compose, before, after, errorHandler } from './fn'
import { first } from './async'
import whois, { creationDate } from './whois'
import { expandDomains } from './domain'
import domainsJson from '../data/domains.json'
import { logistic } from './curve'

export const main =
    () => {
        // TODO: validate argument(s)
        const url = process.argv[2]
        // const url = 'http://blog.sciam.com/this-is-a-test'
        const hostname = extractHostname(url)
        const now = new Date()
        const ageValue = compose(ageSigmoid, yearsAgo(now))
        // const ageValue = yearsAgo(now)
        return Promise
            .all([
                // TODO: investigate generators instead of async ops
                getWhoisInfo(hostname)().then(creationDate).then(ageValue),
                getDomainInfo(hostname)()
            ])
            // TODO: transformToWeights
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
// const asyncLogger =
//     msg =>
//         adviceHandler(
//             (...x) => x.pop().then(result => console.log(msg, ...x, result))
//         )

const extractHostname = url => parse(url).hostname

// Compose some functions to iteratively try domains from a hostname.
const domainOps = op => hostname =>
    expandDomains(hostname)
        .map(domain => () => op(domain))
const isDefined = x => typeof x !== 'undefined'
const firstDefined = first(isDefined)

// Compose a function to lookup domain info for a hostname
const domainLookupOp =
    before(
        logger('Domain info lookup:'),
        domain => Promise.resolve(domainsJson[domain])
    )
const getDomainInfo = compose(firstDefined, domainOps(domainLookupOp))

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
const getWhoisInfo = compose(firstDefined, domainOps(whoisOp))
