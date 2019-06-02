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
