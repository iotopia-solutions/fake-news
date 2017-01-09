import whois, { rejectIfNoMatch, creationDate } from '../../src/whois'

export default
    {
        whois: {
            'should compose a command with hostname': assert => {
                const cmdParams = []
                const cmdStub =
                    (...x) => {
                        cmdParams.push(x)
                        return Promise.resolve(whoisOutput)
                    }
                const hostname = 'foo.com'
                return whois(cmdStub)(hostname)
                    .then(
                        result => {
                            assert.equal(result, whoisOutput)
                            assert(cmdParams.length === 1, 'cmd called once')
                            assert(cmdParams[0][0].match(hostname))
                        }
                    )
            }
        },
        rejectIfNoMatch: {
            'should throw if whois did not find domain': assert => {
                assert.throws(
                    () => rejectIfNoMatch('foo')('No match for')
                )
            },
            'should return whois text otherwise': assert => {
                assert.equal(whoisOutput, rejectIfNoMatch('foo')(whoisOutput))
            }
        },
        creationDate: {
            'should extract creation date from whois output': assert => {
                const date = creationDate(whoisOutput)
                assert.equal(date.getTime(), cDate.getTime())
            },
            'should throw if whois output does not contain creation date': assert => {
                assert.throws(
                    () => creationDate('foo')
                )
            },
            'should throw if whois output contains invalid creation date': assert => {
                assert.throws(
                    () => creationDate('Creation Date: 1992-06-26XXXX')
                )
            }
        }
    }

const cDateString = '1992-06-26T04:00:00Z'
const cDate = new Date(cDateString)
const whoisOutput = `
Registrar URL: http://networksolutions.com
Updated Date: 2016-04-28T07:37:19Z
Creation Date: ${cDateString}
Registrar Registration Expiration Date: 2021-06-25T04:00:00Z
`
