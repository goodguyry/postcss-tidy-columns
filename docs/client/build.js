const fs = require('fs');
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');
const tidyColumns = require('../../');

fs.readFile('docs/client/styles.in.css', (err, css) => {
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
    .process(css, { from: 'docs/client/styles.in.css', to: 'docs/client/styles.out.css' })
    .then((result) => {
      fs.writeFile('docs/client/styles.out.css', result.css, () => true);
      if (result.map) {
        fs.writeFile('docs/client/styles.out.css.map', result.map, () => true);
      }
    });
});

fs.readFile('docs/client/layout.grid.css', (err, css) => {
  postcss([
    tidyColumns(),
    autoprefixer,
  ])
    .process(css, { from: 'docs/client/layout.grid.css', to: 'docs/css/layout.grid.css' })
    .then((result) => {
      fs.writeFile('docs/css/layout.grid.css', result.css, () => true);
      if (result.map) {
        fs.writeFile('docs/css/layout.grid.css.map', result.map, () => true);
      }
    });
});
