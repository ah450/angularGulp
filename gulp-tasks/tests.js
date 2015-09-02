var gulp = require('gulp');
var concat = require('gulp-concat');
var mainBowerFiles = require('main-bower-files');
var watch = require('gulp-watch');
var coffee = require('gulp-coffee');
var coffeelint = require('gulp-coffeelint');
var stylishCoffee = require('coffeelint-stylish');
var gutil = require('gulp-util');
var runSequence = require('run-sequence');
var karma = require('karma').server;


gulp.task('test-deps', ['bower-install', 'modernizr'], function() {
  var srcs = mainBowerFiles({
      includeDev: 'inclusive'
    }).filter(function(s) {
      return s.endsWith('.js');
    });
    srcs = srcs.concat(['build/temp/modernizr.js']);
    return gulp.src(srcs)
      .pipe(concat('app-deps.js'))
      .pipe(gulp.dest('build/test'));
});

gulp.task('app-test-src', ['src-coffee', 'src-js', 'test-deps', 'templates'], function() {
  return gulp.src(['build/templates/*.js',
    'build/temp/app-src.js', 'build/temp/coffee.js', 'build/test/ngMock.js'])
    .pipe(concat('app-testing.js'))
    .pipe(gulp.dest('build/test'));
});

gulp.task('spec-src', function() {
  return gulp.src('spec/**/*.coffee')
    .pipe(coffeelint())
    .pipe(coffeelint.reporter(stylishCoffee))
    .pipe(coffee().on('error', gutil.log))
    .pipe(gulp.dest('compiledSpecs'));
});

gulp.task('testActual', ['app-test-src', 'spec-src'], function() {
  karma.start({
    configFile: __dirname + '/../karma.conf.js',
    singleRun: true
  });

});

gulp.task('test', function(done) {
  return runSequence('clean', 'webserver', 'testActual', 'rails-kill', done);
});

gulp.task('tdd', function() {
  watch(['./src/**', './images/**', './polyfills/**', './spec/**'], function() {
    gulp.start('test');
  });
});
