// Expands a hostname into decreasingly specific domain names
// finally ending in a blank string.
export default
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
