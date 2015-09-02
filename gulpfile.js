var gulp = require('gulp');
var fs = require('fs');
var watch = require('gulp-watch');
var requireDir = require('require-dir');
var gzip = require('gulp-gzip');
var rimraf = require('rimraf');
var runSequence = require('run-sequence');
requireDir('./gulp-tasks');


gulp.task('clean', function() {
  var dirs = ['dist', 'build', 'lib', 'build/temp', 'build/test', 'compiledSpecs', 'coverage'];
  dirs.forEach(function(dir) {
    try {
      rimraf.sync(dir);
      fs.mkdirSync(dir);
    } catch(e) {
      if (e.code != 'EEXIST') {
        throw e;
      }
    }
  });
});

gulp.task('dummy_dev_helper', ['assets', 'scripts', 'css', 'manifest']);

gulp.task('dummy_dev', function(done) {
  return runSequence('clean', 'dummy_dev_helper', done);
});



gulp.task('watch', function() {
  watch(['./src/**', './images/**', './polyfills/**', 'bower.json'], function() {
    gulp.start('reload');
  });
});



gulp.task('dev', function(done) {
  return runSequence('clean', 'webserver-watch', done);
});

gulp.task('build', ['dummy_dev']);

gulp.task('default', ['dev']);


gulp.task('dist', function(done) {
  return runSequence('clean', 'compress', done);
});

gulp.task('compress', ['uglify', 'css-min', 'assets', 'manifest-dist'], function() {
  return gulp.src('dist/**/*.{html,css,js,eot,svg,ttf,otf}')
    .pipe(gzip({
      append: true,
      gzipOptions: {
        level: 9
      }
    }))
    .pipe(gulp.dest('dist'));
});


gulp.task('rails:production', ['dist'], function() {
  return gulp.src('dist/**/*')
    .pipe(gulp.dest('../public'));
});

gulp.task('rails:dev', ['dummy_dev'], function() {
  return gulp.src('build/**/*')
    .pipe(gulp.dest('../public'));
});