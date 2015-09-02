var gulp = require('gulp');
var shell = require('gulp-shell');

gulp.task('rails-start', shell.task([
  'bundle exec rails s -p 3000 -d'
]));

gulp.task('rails-kill', shell.task([
  'kill `cat ../tmp/pids/server.pid`'
]));

gulp.task('setup-db', shell.task([
  'bundle exec rake --trace db:drop',
  'bundle exec rake --trace db:create',
  'bundle exec rake --trace db:migrate',
  'bundle exec rake --trace db:seed'
]));
