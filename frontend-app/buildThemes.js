const { kendoSassBuild } = require('@progress/kendo-theme-tasks/src/build/kendo-build');
const nodeSass = require('node-sass');

const themes = ['light', 'dark'];

function buildStyles(cb) {
  themes.forEach((theme) => {
    kendoSassBuild({
      file: `./src/sass/${theme}-theme.scss`,
      output: {
        path: './public/css',
      },
      sassOptions: {
        implementation: nodeSass,
        outputStyle: 'compressed'
      }
    });

    cb();

  });
}

buildStyles(() => { });

exports.buildStyles = buildStyles;