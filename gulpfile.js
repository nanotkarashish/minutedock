var gulp = require('gulp')
	, nodemon = require('gulp-nodemon')
	, rjs = require('gulp-requirejs')
  , minifyCss = require('gulp-minify-css')
  , rename = require('gulp-rename')
  , uglify = require('gulp-uglify')
  , protractor = require('gulp-angular-protractor')
  , del = require('del')
  , shell = require('gulp-shell')
  , gutil = require('gulp-util')
  , rename = require("gulp-rename");

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
      , env: { 'NODE_ENV': 'test', 'NODE_CONFIG_DIR': 'config' }
    }).on('error', function(e) { console.error(e); });
});

gulp.task('start-api-stub', function () {
  return nodemon({
      script: 'test/minutedockStub/stub.js'
      , ext: 'js'
      , env: { 'NODE_ENV': 'test' }
    }).on('error', function(e) { console.error(e); });
});

gulp.task('test', ['build', 'start'], function(){
  return gulp.src(['./test/**/*.js'])
    .pipe(protractor({
        'configFile': 'test/conf.js',
        'args': ['--baseUrl', ''],
        'autoStartStopServer': true,
        'debug': true
    }))
    .on('error', function(e) { console.error(e); process.exit(1); })
    .on('end', function() { console.log("Done."); process.exit(); });
});

gulp.task('clean', function(){
  del('dist');
});

function string_src(filename, string) {
  var src = require('stream').Readable({ objectMode: true })
  src._read = function () {
    this.push(new gutil.File({ cwd: "", base: "", path: filename, contents: new Buffer(string) }))
    this.push(null)
  }
  return src
}

gulp.task('package-src', function(){
  var distFiles = [
    './LICENSE.txt',
    './src/**/*'];

  return gulp.src(distFiles, { base: './' })
  .pipe(gulp.dest('dist'));
});

gulp.task('package-config', function(){
  var configFiles = [
    'config/default.json',
    'config/production.json'
  ];

  return gulp.src(configFiles, { base: './' })
  .pipe(gulp.dest('dist'));
});

gulp.task('package-README', function(){
  var instructions = "1) Install foreverjs \n2) Set NODE_CONFIG with config vars\n3) Run 'npm start'";
  return string_src('README.txt', instructions)
  .pipe(gulp.dest('dist'));
});

gulp.task('package-dependencies', function(){
  var npm_pkg = require('./package.json');
  delete npm_pkg.scripts.test;
  delete npm_pkg.scripts.postinstall;
  delete npm_pkg.devDependencies;
  npm_pkg.scripts.start = 'ENV=production forever start -a -l minutedock.log -o ./logs/out.log -e ./logs/err.log src/node/minutedock.js';

  return string_src('_package.json', JSON.stringify(npm_pkg))
  .pipe(rename('package.json'))
  .pipe(gulp.dest('dist'));
});

gulp.task('package', ['package-src', 'package-config', 'package-dependencies', 'package-README'], shell.task(['cd dist && mkdir node_modules && mkdir logs && npm install --production']));

gulp.task('default', ['build', 'start']);
