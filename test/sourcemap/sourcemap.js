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
      mappings: 'AAAA;CACC,kCAAmB;AACpB;AAFA;CAAA;EACC,mBAAmB;CACpB;AAAA',
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
      mappings: 'AAAA;CACC,kCAAY;CAAZ,qBAAY;AACb',
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
      mappings: 'AAAA;CACC,6BAA2B;CAA3B,qBAA2B;CAA3B,wCAA2B;CAA3B,mCAA2B;AAC5B;AAFA;CAAA;EACC,uBAA2B;EAA3B,oBAA2B;CAC5B;AAAA',
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
      mappings: 'AAAA;CACC,mCAAkB;CAAlB,yCAAkB;AACnB;AAFA;CAAA;EACC,uBAAkB;EAAlB,wBAAkB;CACnB;AAAA',
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
      mappings: 'AAAA;CACC,kCAAmB;CACnB,qBAA4B;AAC7B',
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
