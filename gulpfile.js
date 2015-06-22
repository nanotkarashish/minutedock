var gulp = require('gulp')
	, nodemon = require('gulp-nodemon')
	, rjs = require('gulp-requirejs')
  , minifyCss = require('gulp-minify-css')
  , rename = require('gulp-rename')
  , uglify = require('gulp-uglify')
  , protractor = require('gulp-angular-protractor');

gulp.task('minify-js', function(){
	rjs({
    baseUrl : 'src/static/js',
    mainConfigFile: 'src/static/js/main.js',
    out: 'main.min.js',
    name: 'main',
    paths : {
        'angular': "empty:",
        'angular-route': "empty:",
        'jquery': "empty:",
        'bootstrap': "empty:"
    }
  })
  .pipe(uglify())
  .pipe(gulp.dest('src/static/js'));
});

gulp.task('minify-css', function() {
  return gulp.src('src/static/stylesheets/style.css')
    .pipe(minifyCss())
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('src/static/stylesheets'));
});

gulp.task('build', ['minify-js', 'minify-css']);

gulp.task('start', function () {
  return nodemon({
      script: 'src/node/minutedock.js'
      , ext: 'js html'
      , env: { 'NODE_ENV': 'test' }
    }).on('error', function(e) { console.error(e); });
});

gulp.task('start-api-stub', function () {
  return nodemon({
      script: 'test/minutedockStub/stub.js'
      , ext: 'js'
      , env: { 'NODE_ENV': 'test' }
    }).on('error', function(e) { console.error(e); });
});

gulp.task('test', function(){
  return gulp.src(['./test/**/*.js'])
    .pipe(protractor({
        'configFile': 'test/conf.js',
        'args': ['--baseUrl', ''],
        'autoStartStopServer': true,
        'debug': true
    }))
    .on('error', function(e) { throw e; })
});

gulp.task('default', ['build', 'start']);
