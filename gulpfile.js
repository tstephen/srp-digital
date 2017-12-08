var gulp        = require('gulp');
var jshint      = require('gulp-jshint');
var uglify      = require('gulp-uglify');
var concat      = require('gulp-concat');
var less        = require('gulp-less');
var minifyCSS   = require('gulp-minify-css');
var prefix      = require('gulp-autoprefixer');
var replace     = require('gulp-replace');

gulp.task('dev2prod', function() {
  gulp.src(['**/*.html'])
    .pipe(replace('http://localhost:8083', 'https://api.srp.digital'))
    .pipe(gulp.dest('.'));
  gulp.src(['sdu/sdu.json'])
    .pipe(replace('http://localhost:8083', 'https://api.srp.digital'))
    .pipe(gulp.dest('sdu/'));
});

gulp.task('prod2dev', function() {
  gulp.src(['**/*.html'])
    .pipe(replace('https://api.srp.digital', 'http://localhost:8083'))
    .pipe(gulp.dest('.'));
  gulp.src(['sdu/sdu.json'])
    .pipe(replace('https://api.srp.digital', 'http://localhost:8083'))
    .pipe(gulp.dest('sdu/'));
});

gulp.task('test', function() {
  console.log('Running test');
});

/*gulp.task('scripts',
  gulp.series('test', function scriptsInternal() {
    return gulp.src(['app/scripts/ ** / *.js', '!app/scripts/vendor/ ** / *.js'])
      .pipe(concat('main.min.js'))
      .pipe(uglify())
      .pipe(gulp.dest('dist/scripts'));
  })
);*/

gulp.task('styles', function() {
  return gulp.src('app/styles/main.less')
    .pipe(less())
    .pipe(minifyCSS())
    .pipe(prefix())
    .pipe(gulp.dest('dist/styles'));
});
