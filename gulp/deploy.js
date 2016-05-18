'use strict';

var gulp = require('gulp');
var ghPages = require('gulp-gh-pages');

var options = {
  force: true
};

gulp.task('deploy', function () {
  return gulp.src('./dist/**/*')
    .pipe(ghPages(options));
});
