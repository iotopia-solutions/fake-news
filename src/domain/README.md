# domain

Functions to help with www domains.

`expandDomains` takes a hostname and expands it into hostnames of decreasing
specificity.  For example, blog.iotopia-solutions.com will be expanded
to `['blog.iotopia-solutions.com', 'iotopia-solutions.com', 'com', '']`.
The blank string on the end is intentional, but is admittedly a leak in
my abstraction.  I should fix that. :)
