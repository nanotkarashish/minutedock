var gulp = require('gulp')
	, nodemon = require('gulp-nodemon')
	, rjs = require('gulp-requirejs')
  , minifyCss = require('gulp-minify-css')
  , rename = require('gulp-rename')
  , uglify = require('gulp-uglify');

gulp.task('minify-js', function(){
	rjs({
    baseUrl : 'src/static/js',
    out: 'main.min.js',
    name: 'main',
    paths : {
      'jquery' : '//code.jquery.com/jquery-2.1.1.min',
      'angular' : '//ajax.googleapis.com/ajax/libs/angularjs/1.2.14/angular.min',
      'angular-route' : '//ajax.googleapis.com/ajax/libs/angularjs/1.2.14/angular-route.min',
      'angular-storage' : './lib/ngStorage',
      'bootstrap' : '//netdna.bootstrapcdn.com/bootstrap/3.0.1/js/bootstrap.min',
      'quickdate' : './lib/ng-quick-date'
    },
    shim : {
      'angular-storage' : {
        'exports' : 'angular-storage',
        'deps' : ['angular']  
      },
      'angular-route' : {
        'exports' : 'angular-route',
        'deps' : ['angular']  
      },
      'quickdate' : {
        'exports' : 'quickdate',
        'deps' : ['angular']  
      },
      'angular' : {
        'exports' : 'angular'
      },
      'bootstrap' : {
        'exports' : 'bootstrap',
        'deps' : ['jquery']
      }
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
  nodemon({
    script: 'src/node/minutedock.js'
  , ext: 'js html'
  , env: { 'NODE_ENV': 'development' }
  })
});

gulp.task('test', ['start', 'start-minutedock-stub'], function(){

});

gulp.task('default', ['build', 'start']);