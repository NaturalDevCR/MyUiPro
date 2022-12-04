let gulpfile = require('gulp');
// import gulpfile from 'gulp'
// import inline from 'gulp-inline'
let inline = require('gulp-inline');
// let del = require('del');
// import del from 'del'

gulpfile.task('inline', function (done) {
  gulpfile.src('dist/spa/index.html')
    .pipe(inline({
      base: 'dist/spa',
      disabledTypes: 'css, svg, img'
    }))
    .pipe(gulpfile.dest('dist/spa').on('finish', function(){
      done()
    }));
});

gulpfile.task('clean', function (done) {
  // del(['dist/*.js'])
  done()
});

gulpfile.task('bundle-for-local', gulpfile.series('inline', 'clean'))
