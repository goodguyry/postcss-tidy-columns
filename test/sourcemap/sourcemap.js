/* eslint-disable max-len */
const path = require('path');
const { typical } = require('../sharedConfigs');

module.exports = [
  {
    description: 'Sourcemap fixture: function-span.css',
    options: typical,
    map: {
      version: 3,
      sources: [
        'function-span.css',
      ],
      names: [],
      mappings: 'AAAA;CACC,kFAAmB;AACpB',
      file: 'function-span.generated.css',
      sourcesContent: [
        'div {\n\twidth: tidy-span(2);\n}\n',
      ],
    },
    fixtures: {
      from: path.join(__dirname, 'function-span.css'),
      to: path.join(__dirname, 'function-span.generated.css'),
    },
  },
];
