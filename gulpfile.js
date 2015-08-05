var gulp = require('gulp');
var fs = require('fs');
var connect = require('gulp-connect');
var watch = require('gulp-watch');
var requireDir = require('require-dir');
var gzip = require('gulp-gzip');
var rimraf = require('rimraf');
requireDir('./gulp-tasks');


gulp.task('clean', function() {
  var dirs = ['./dist', './build', './lib'];
  rimraf.sync('lib')
  dirs.forEach(function(dir) {
    try {
      fs.mkdirSync(dir);
    } catch(e) {
      if (e.code != 'EEXIST') {
        throw e;
      }
    }
  });
});

gulp.task('webserver', ['assets', 'scripts', 'watch', 'css', 'manifest'], function() {
  connect.server({
    livereload: true,
    root: 'build'
  });
});

gulp.task('watch', function() {
  watch(['./src/**', './images/**', './polyfills/**'], function() {
    gulp.start('reload')
  });
});

gulp.task('reload', ['assets', 'scripts', 'css', 'manifest'], function() {
  return gulp.src('./build/**/*')
    .pipe(connect.reload());
});

gulp.task('dev', ['clean'], function() {
  return gulp.start('webserver');
});

gulp.task('default', ['dev']);


gulp.task('dist', ['clean'], function() {
  return gulp.start('compress');
});

gulp.task('compress', ['uglify', 'css-min', 'assets', 'manifest-dist'], function() {
  return gulp.src('dist/**/*.{html,css,js,eot,svg,ttf}')
    .pipe(gzip({
      append: true,
      gzipOptions: {
        level: 6
      }
    }))
    .pipe(gulp.dest('dist'));
});