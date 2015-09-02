var gulp = require('gulp');
var gulp = require('gulp');
var concat = require('gulp-concat');
var templateCache = require('gulp-angular-templatecache');
var minifyHtml = require('gulp-minify-html');

var templateOptions = {
   standalone: true,
   module: 'appTemplates'
};

gulp.task('templates', function() {
  // Turns templates to html
  return gulp.src('src/views/**/*.html')
    .pipe(templateCache('templates.js', templateOptions))
    .pipe(gulp.dest('./build/templates'));
});

gulp.task('templates-min', function() {
  return gulp.src('src/views/**/*.html')
    .pipe(minifyHtml({
      empty: true
    }))
    .pipe(templateCache('templates.min.js', templateOptions))
    .pipe(gulp.dest('./build/temp/'));
});
