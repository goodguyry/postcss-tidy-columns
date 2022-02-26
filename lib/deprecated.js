const deprecated = (old, current) => (`

Deprecated: \`${old}\` will be removed in a future version.
> Use \`${current}\` instead

`);

module.exports = deprecated;
