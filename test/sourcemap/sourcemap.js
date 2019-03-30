/* eslint-disable max-len */
const path = require('path');

module.exports = [
  {
    description: 'Sourcemap fixture: offset-left.css',
    skip: false,
    options: {},
    map: {
      version: 3,
      sources: [
        'offset-left.css',
      ],
      names: [],
      mappings: 'AAAA;CACC,uEAAoB;CACpB;AAFD;CAAA;EACC,uEAAoB;EACpB;CAAA',
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
    skip: false,
    options: {},
    map: {
      version: 3,
      sources: [
        'span.css',
      ],
      names: [],
      mappings: 'AAAA;CACC,uEAAa;CAAb,2EAAa;CACb',
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
    skip: false,
    options: {},
    map: {
      version: 3,
      sources: [
        'column.css',
      ],
      names: [],
      mappings: 'AAAA;CACC,2EAA4B;CAA5B,+EAA4B;CAA5B,iFAA4B;CAA5B,wEAA4B;CAC5B;AAFD;CAAA;EACC,iFAA4B;EAA5B,wEAA4B;EAC5B;CAAA',
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
    skip: false,
    options: {},
    map: {
      version: 3,
      sources: [
        'offset.css',
      ],
      names: [],
      mappings: 'AAAA;CACC,iFAAmB;CAAnB,kFAAmB;CACnB;AAFD;CAAA;EACC,iFAAmB;EAAnB,kFAAmB;EACnB;CAAA',
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
    skip: false,
    options: {},
    map: {
      version: 3,
      sources: [
        'function-span.css',
      ],
      names: [],
      mappings: 'AAAA;CACC,uEAAoB;CACpB,2EAA6B;CAC7B',
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
