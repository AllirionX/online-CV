var gulp = require('gulp'),
    watch = require("gulp-watch"),
    less = require('gulp-less'),
    cssmin = require('gulp-cssmin'),
    rename = require('gulp-rename'),
    jsmin = require('gulp-uglify'),
    browserSync = require('browser-sync').create();


gulp.task('callback', function () {
    // Callback mode, useful if any plugin in the pipeline depends on the `end`/`flush` event
    return watch('css/**/*.css', function () {
        gulp.src('css/**/*.css')
            .pipe(gulp.dest('build'));
    });
});

// Task to generate css from less
gulp.task('less', function () {
  return gulp.src('./css/*.less')
    .pipe(less())
    .pipe(gulp.dest('./css/'));
});

// Task to minify css files into ./dist/css/ folder
gulp.task('minify-css', gulp.series('less',function(done) {
	return gulp.src('./css/*.css')
		.pipe(cssmin())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('./dist/css/'))
}));

// Task to minify js files into ./dist/js/ folder
gulp.task('minify-js', function() {
	return gulp.src('./js/*.js')
		.pipe(jsmin())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('./dist/js/'))
});

//Call back to reload browser when Js is updated
gulp.task('reload', gulp.series(['minify-js','minify-css'], function (done) {
    browserSync.reload();
    done();
}));

// Static server
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
});

// Default task
gulp.task('default', function () {

    // Serve files from the root of this project
    browserSync.init({
        server: {
            baseDir: "./",
            index: "index.html"
        },
        browser: "firefox",
        reloadOnRestart: true
    });

    browserSync.reload();
    // add browserSync.reload to the tasks array to make
    // all browsers reload after tasks are complete.
    gulp.watch(['./css/*.less', './js/*.js', 'index.html'])
      .on('change', gulp.series('reload'));
});