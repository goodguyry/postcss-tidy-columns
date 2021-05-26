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
      mappings: 'AAAA;CACC,mCAAoB;CACpB;AAFD;CAAA;EACC,oBAAoB;EACpB;CAAA',
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
      mappings: 'AAAA;CACC,mCAAa;CAAb,sBAAa;CACb',
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
      mappings: 'AAAA;CACC,8BAA4B;CAA5B,sBAA4B;CAA5B,yCAA4B;CAA5B,oCAA4B;CAC5B;AAFD;CAAA;EACC,wBAA4B;EAA5B,qBAA4B;EAC5B;CAAA',
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
      mappings: 'AAAA;CACC,oCAAmB;CAAnB,0CAAmB;CACnB;AAFD;CAAA;EACC,wBAAmB;EAAnB,yBAAmB;EACnB;CAAA',
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
      mappings: 'AAAA;CACC,mCAAoB;CACpB,sBAA6B;CAC7B',
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
