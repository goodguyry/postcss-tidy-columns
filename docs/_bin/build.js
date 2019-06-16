const fs = require('fs');
const sass = require('node-sass');
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');
const units = require('postcss-units');
const tidyColumns = require('../../');

sass.render({
  file: 'docs/_scss/index.scss',
  includePaths: ['docs/_scss'],
  outputStyle: 'expanded',
}, (error, output) => {
  if (!error) {
    postcss([
      units({
        precision: 4,
      }),
      tidyColumns({
        columns: 8,
        gap: '0.5rem',
        edge: '0.75rem',
        breakpoints: {
          '64rem': {
            columns: 12,
            gap: '1.25rem',
            edge: '1.875rem',
            siteMax: '80rem',
          },
        },
      }),
      autoprefixer,
    ])
      .process(output.css, { from: 'docs/_scss/index.scss', to: 'docs/css/main.css' })
      .then((result) => {
        fs.writeFile('docs/css/main.css', result.css, () => true);
        if (result.map) {
          fs.writeFile('docs/css/main.css.map', result.map, () => true);
        }
      });
  }
});
