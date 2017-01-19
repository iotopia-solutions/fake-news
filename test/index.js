// Run all the tests
import reporter from './reporter'
import runner, { success, failure, failureWithStack, RunnerError }
    from './runner'
import assert from 'assert'
import { expandDomains } from './domain'
import whois from './whois'

const recordFailure =
    process.env.SHOW_STACK ? failureWithStack : failure

const runTests =
    runner(assert, success, recordFailure)

runTests({ expandDomains, whois })
    .then(reporter(console.log, console.error))

// TODO:
// 1. create a function that collects all tests (possibly across several files)
// 2. stream the tests one at a time through runner and reporter
// 3. remove loops from runner and reporter, yay
