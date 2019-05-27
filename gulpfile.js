const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const useref = require('gulp-useref');
const uglify = require('gulp-uglify');
const gulpIf = require('gulp-if');
const cssnano = require('gulp-cssnano');
const cache = require('gulp-cache');
const del = require('del');
const imagemin = require("gulp-imagemin");
const babel = require('gulp-babel');



function server(done) {
    return browserSync.init({
        watchOptions: {
            ignoreInitial: true,
            ignored: ['./node_modules', './dist', './static', 'gulpfile.js', './.history']
          },
        server: {
            baseDir: './'
        }
    });
    done();
};

function browserSyncReload(done) {
    browserSync.reload();
    done();
  }

gulp.task('sass', function() {
    return gulp.src('src/scss/style.scss')
        .pipe(sass())
        .pipe(gulp.dest('static/css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('useref', function() {
    return gulp.src('*.html')
        .pipe(useref())
        .pipe(gulp.dest('static'))
});

gulp.task('babel', () =>
    gulp.src('static/static/js/main.min.js')
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(gulp.dest('static/static/js/'))
);

gulp.task('images', function() {
    return gulp.src('src/images/**/*.+(png|jpg|gif|svg)')
        .pipe(cache(imagemin({
            interlaced: true
        })))
        .pipe(gulp.dest('static/images'))
});

gulp.task('fonts', function() {
    return gulp.src('src/fonts/**/*')
        .pipe(gulp.dest('static/fonts'))
});

gulp.task('clean', function() {
    return del(['dist', 'static']);
});

gulp.task('clearCache', function (callback) {
    return cache.clearAll(callback)
});

// Production 

gulp.task('productionFonts', function() {
    return gulp.src('static/fonts/**/*')
        .pipe(gulp.dest('dist/static/fonts'))
});

gulp.task('productionImages', function() {
    return gulp.src('static/images/**/*')
        .pipe(gulp.dest('dist/static/images'))
});

gulp.task('productionCss', function() {
    return gulp.src('static/static/css/styles.min.css')
        .pipe(gulpIf('*.css', cssnano()))
        .pipe(gulp.dest('dist/static/css'))
});

gulp.task('productionJs', function() {
    return gulp.src('static/static/js/main.min.js')
        .pipe(gulpIf('*.js', uglify()))
        .pipe(gulp.dest('dist/static/js'))
});

gulp.task('productionHtml', function() {
    return gulp.src('static/**/*.html')
        .pipe(gulp.dest('dist'))
});

//Main tasks

gulp.task('build', gulp.series(['clean', 'sass', 'useref', 'babel', 'images', 'fonts']));

gulp.task('default', gulp.series(['build']));

gulp.task('production', gulp.series(['build', 'productionFonts', 'productionImages', 'productionCss', 'productionJs', 'productionHtml']));

gulp.task('watch', gulp.series(['default'], function watch() {
    gulp.watch('src/scss/**/*.scss', gulp.series(['sass']));
    gulp.watch('src/js/**/*.js', gulp.series(browserSyncReload));
    gulp.watch('*.html', gulp.series(browserSyncReload));
    return server();
}));