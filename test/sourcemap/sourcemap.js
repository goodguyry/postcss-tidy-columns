/* eslint-disable max-len */
const path = require('path');
const { typical } = require('../sharedConfigs');

module.exports = [
  {
    description: 'Sourcemap fixture: offset-left.css',
    options: typical,
    map: {
      version: 3,
      sources: [
        'offset-left.css',
      ],
      names: [],
      mappings: 'AAAA;CACC,kFAAmB;AACpB',
      file: 'offset-left.generated.css',
      sourcesContent: [
        'div {\n\ttidy-offset-left: 1;\n}\n',
      ],
    },
    fixtures: {
      from: path.join(__dirname, 'offset-left.css'),
      to: path.join(__dirname, 'offset-left.generated.css'),
    },
  },
  {
    description: 'Sourcemap fixture: span.css',
    options: typical,
    map: {
      version: 3,
      sources: [
        'span.css',
      ],
      names: [],
      mappings: 'AAAA;CACC,kFAAY;AACb',
      file: 'span.generated.css',
      sourcesContent: [
        'div {\n\ttidy-span: 2;\n}\n',
      ],
    },
    fixtures: {
      from: path.join(__dirname, 'span.css'),
      to: path.join(__dirname, 'span.generated.css'),
    },
  },
  {
    description: 'Sourcemap fixture: column.css',
    options: typical,
    map: {
      version: 3,
      sources: [
        'column.css',
      ],
      names: [],
      mappings: 'AAAA;CACC,sFAA2B;CAA3B,4FAA2B;CAA3B,mFAA2B;AAC5B',
      file: 'column.generated.css',
      sourcesContent: [
        'div {\n\ttidy-column: 2 / span 3 / 1;\n}\n',
      ],
    },
    fixtures: {
      from: path.join(__dirname, 'column.css'),
      to: path.join(__dirname, 'column.generated.css'),
    },
  },
  {
    description: 'Sourcemap fixture: offset.css',
    options: typical,
    map: {
      version: 3,
      sources: [
        'offset.css',
      ],
      names: [],
      mappings: 'AAAA;CACC,4FAAkB;CAAlB,6FAAkB;AACnB',
      file: 'offset.generated.css',
      sourcesContent: [
        'div {\n\ttidy-offset: 3 / 4;\n}\n',
      ],
    },
    fixtures: {
      from: path.join(__dirname, 'offset.css'),
      to: path.join(__dirname, 'offset.generated.css'),
    },
  },
  {
    description: 'Sourcemap fixture: function-span.css',
    options: typical,
    map: {
      version: 3,
      sources: [
        'function-span.css',
      ],
      names: [],
      mappings: 'AAAA;CACC,kFAAmB;CACnB,sFAA4B;AAC7B',
      file: 'function-span.generated.css',
      sourcesContent: [
        'div {\n\twidth: tidy-span(2);\n\tmax-width: tidy-span-full(2);\n}\n',
      ],
    },
    fixtures: {
      from: path.join(__dirname, 'function-span.css'),
      to: path.join(__dirname, 'function-span.generated.css'),
    },
  },
];
