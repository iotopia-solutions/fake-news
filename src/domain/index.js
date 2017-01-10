// Given a function that finds retrieves domain info from a domain and a
// function that extracts a hostname from a url, returns a function that
// returns the domain info for the url.
// Note: can has JavaScript function composition?
export const domainInfoFromUrl =
    (domainInfo, extractHostname) => url =>
        domainInfo(extractHostname(url))

// Given an JSON object whose keys are domain names, returns a function that
// searches through the keys by trying the most specific domain first,
// then successivley less-specific domains, finally trying a blank string,
// and returns the domain info.
export const reducingHostnameFinder =
    domainsJson => hostname => {
        const domain =
            expandDomains(hostname)
                .find(name => name in domainsJson)
        return domainsJson[domain]
    }

export const expandDomains =
    hostname =>
        hostname
            .split('.')
            .reduceRight(prependNextDomain, [''])

export const prependNextDomain =
    (domains, part) =>
        [nextDomain(part, domains[0])].concat(domains)

export const join =
    (name1, name2) =>
        name2 ? name1 + '.' + name2 : name1

export const nextDomain = join
