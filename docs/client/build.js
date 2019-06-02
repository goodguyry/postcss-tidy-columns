const postcss = require('postcss');
const fs = require('fs');
const tidyColumns = require('../../');

fs.readFile('docs/client/styles.in.css', (err, css) => {
  postcss([
    tidyColumns({
      columns: 12,
      siteMax: '90rem',
      gap: '1.25rem',
      edge: '1.5rem',
      debug: true,
    }),
  ])
    .process(css, { from: 'docs/client/styles.in.css', to: 'docs/dist/styles.out.css' })
    .then((result) => {
      fs.writeFile('docs/dist/styles.out.css', result.css, () => true);
      if (result.map) {
        fs.writeFile('docs/dist/styles.out.css.map', result.map, () => true);
      }
    });
});
