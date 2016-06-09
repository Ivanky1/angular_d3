const gulp = require("gulp"),
    sass = require("gulp-sass"),
    browserify = require("browserify"),
    autoprefixer = require('gulp-autoprefixer'),
    plumber = require("gulp-plumber"),
    browserSync = require("browser-sync").create(),
    vinylSource = require("vinyl-source-stream"),
    rename = require("gulp-rename"),
    promise = require('es6-promise').Promise,
    notify = require("gulp-notify");


gulp.task('default', ['js', 'css', 'watch']);

gulp.task('js', function() {
    return browserify('./assets/js/bootstrap.js')
        .bundle().on('error', function(error) {
            console.log(error.toString());
            this.emit('end');
        })
        .pipe(vinylSource("combined.js")) // pipe - проброс поток вв/выв дальше (метод gulp), vinylSource - перемеинововывает файл на лету в памяти!
        .pipe(gulp.dest("./build"))
        .pipe(browserSync.stream());

});

gulp.task('css', function(){
    return gulp.src('./assets/css/app.scss')
        .pipe(sass({
            errLogToconsole: true
        }))
        .pipe(plumber({
            errorHandler: notify.onError('SASS error <%= error.message %>')
        }))
        .pipe(autoprefixer({
            browsers: ['last 10 versions']
        }))
        .pipe(rename('combined.css'))
        .pipe(gulp.dest("./build"))
        .pipe(browserSync.stream());

});

gulp.task('watch', function(){
    browserSync.init({
        proxy: 'localhost:4731',
        port: 3001,
        open: false,
        notify: false
    });

    gulp.watch([
        './views/**/*.jade'
    ], browserSync.reload);

    gulp.watch([
        './assets/css/**/*.scss'
    ], ['css']);

    gulp.watch([
        './assets/js/**/*.js',
    ], ['js']);

});

