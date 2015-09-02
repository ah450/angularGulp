var gulp = require('gulp');
var connect = require('gulp-connect');
var modRewrite = require('connect-modrewrite');


gulp.task('webserver-watch', ['webserver', 'watch']);

gulp.task('webserver', ['dummy_dev'], function() {
  connect.server({
    livereload: true,
    root: 'build',
    port: 8000,
    middleware: function() {
      return [
        modRewrite([
          '^/api/(.*)$ http://localhost:3000/api/$1 [P]'
        ])
      ];
    }
  });
});

gulp.task('reload', ['dummy_dev_helper'], function() {
  return gulp.src('./build/**/*')
    .pipe(connect.reload());
});