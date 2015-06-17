var gulp = require('gulp')
	, nodemon = require('gulp-nodemon');

gulp.task('start', function () {
  nodemon({
    script: 'src/node/minutedock.js'
  , ext: 'js html'
  , env: { 'NODE_ENV': 'development' }
  })
})