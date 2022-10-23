const fs = require('fs');
const sass = require('sass');
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');
const tidyColumns = require('../..');

sass.render({
  file: '_scss/index.scss',
  includePaths: ['_scss'],
  outputStyle: 'expanded',
}, (error, output) => {
  if (error) {
    console.error(error);
  }
  if (!error) {
    postcss([
      tidyColumns,
      autoprefixer,
    ])
      .process(output.css, { from: '_scss/index.scss', to: 'css/main.css' })
      .then((result) => {
        fs.writeFile('css/main.css', result.css, () => true);
        if (result.map) {
          fs.writeFile('css/main.css.map', result.map, () => true);
        }
        console.log('\nbuild.js: css/main.css written from _scss/index.scss');
      });
  }
});
