const fs = require('fs');
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');
const tidyColumns = require('../../');

fs.readFile('docs/css/input.flexbox.css', (err, css) => {
  postcss([
    tidyColumns({
      columns: 12,
      siteMax: '80rem',
      gap: '1.25rem',
      edge: '1.875rem',
      debug: true,
    }),
    autoprefixer,
  ])
    .process(css, { from: 'docs/css/input.flexbox.css', to: 'docs/css/output.flexbox.css' })
    .then((result) => {
      fs.writeFile('docs/css/output.flexbox.css', result.css, () => true);
      if (result.map) {
        fs.writeFile('docs/css/output.flexbox.css.map', result.map, () => true);
      }
    });
});

fs.readFile('docs/css/input.grid.css', (err, css) => {
  postcss([
    tidyColumns(),
    autoprefixer,
  ])
    .process(css, { from: 'docs/css/input.grid.css', to: 'docs/css/output.grid.css' })
    .then((result) => {
      fs.writeFile('docs/css/output.grid.css', result.css, () => true);
      if (result.map) {
        fs.writeFile('docs/css/output.grid.css.map', result.map, () => true);
      }
    });
});
