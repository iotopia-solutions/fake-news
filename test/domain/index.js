import {
    domainInfoFromUrl, reducingHostnameFinder, expandDomains, prependNextDomain,
    nextDomain, join
} from '../../src/domain'

export default
    {
        domainInfoFromUrl: {
            'should compose two args': assert => {
                // TODO: this is pretty lame. we need some spies!
                const f = x => x
                const g = x => x
                const token = {}
                assert(domainInfoFromUrl(g, f)(token) === token)
            }
        },
        reducingHostnameFinder: {
            'should find the most specific domain': assert => {
                const domains = {
                    'a.b.c': {},
                    'b.c': {},
                    'c': {},
                    'foo': {},
                    '': {}
                }
                const find = reducingHostnameFinder(domains)
                assert(find('foo') === domains['foo']) // exact match
                assert(find('a.b.c') === domains['a.b.c']) // exact match
                assert(find('foo.b.c') === domains['b.c']) // subdomain
                assert(find('foo.c') === domains['c']) // subdomain
            },
            'should return value for "" if domain not found': assert => {
                const domains = {
                    'a.b.c': {},
                    'b.c': {},
                    'c': {},
                    'foo': {},
                    '': {}
                }
                const find = reducingHostnameFinder(domains)
                assert(find('bar') === domains['']) // missing
            }
        },
        expandDomains: {
            'should expand a hostname to a list of domains': assert => {
                const hostname = 'a.b.c'
                const domains = [ 'a.b.c', 'b.c', 'c', '' ]
                assert.deepEqual(expandDomains(hostname), domains)
            }
        },
        prependNextDomain: {
            'should construct next domain and prepend it': assert => {
                const domains = [ 'a.b.c', 'b.c', 'c' ]
                assert.deepEqual(
                    prependNextDomain(domains.slice(2), 'b'),
                    domains.slice(1)
                )
                assert.deepEqual(
                    prependNextDomain(domains.slice(1), 'a'),
                    domains
                )
            }
        },
        join: {
            'should join two strings with a dot': assert => {
                assert(join('a', 'b') === 'a.b', 'join(\'a\', \'b\')')
                assert(join('', 'b') === '.b', 'join(\'\', \'b\')')
            },
            'should omit second arg if blank or missing': assert => {
                assert(join('a') === 'a', 'join(\'a\',)')
                assert(join('a', '') === 'a', 'join(\'a\', \'\')')
            }
        },
        nextDomain: {
            'should be an alias of join': assert => {
                assert(nextDomain === join)
            }
        }
    }
