# whois

Functions to lookup whois information about domains.

`whois` accepts an async function that runs a shell command, passes a
whois script to it, and validates the result.

`creationDate` extracts the date a domain was first created from the
output of a whois call.
