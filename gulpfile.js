var gulp = require("gulp");
var sass = require('gulp-sass');
var pug = require('gulp-pug');
var plumber = require('gulp-plumber');
var browserSync = require('browser-sync').create();
 
gulp.task('serve', ['sass', "pug"], function() {

    browserSync.init({
        server: "./"
    });

    gulp.watch("scss/*.scss", ['sass']);
    gulp.watch("pug/*.pug", ['pug']);
    gulp.watch(["*.html", "css/*.css", "js/*.js"]).on('change', browserSync.reload);
});

gulp.task("pug", function() {
    return gulp.src("pug/*.pug")
        .pipe(plumber())
        .pipe(pug({"pretty": true}))
        .pipe(plumber.stop())
        .pipe(gulp.dest(""))
        .pipe(browserSync.stream());
})

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src("scss/*.scss")
        .pipe(plumber())
        .pipe(sass().on('error', sass.logError))
        .pipe(plumber.stop())
        .pipe(gulp.dest("css"))
        .pipe(browserSync.stream());
});

gulp.task('default', ['serve']);