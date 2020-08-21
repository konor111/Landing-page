
// let preprocessor = 'sass';

const { src, dest, parallel, series, watch } = require('gulp');
const browserSync   = require('browser-sync').create();
const concat        = require('gulp-concat');
const uglify        = require('gulp-uglify-es').default;
const  sass         = require('gulp-sass');
const  less         = require('gulp-less');
const  scss         = require('gulp-scss') ;
const  autoprefixer = require('gulp-autoprefixer');
const  cleancss     = require('gulp-clean-css');
const  imagemin     = require('gulp-imagemin');
const  newer        = require('gulp-newer');
const  del          = require('del');
const  notify       = require('gulp-notify');
const  plumber      = require('gulp-plumber');
const  clean        = require('gulp-clean');

function browsersync() {
    browserSync.init({
        server: {baseDir: 'app/'},
        notify: false,
        online: false,
        port: 3000
    })
}

function scripts(){
    return src([
        'node_modules/jquery/dist/jquery.min.js',
        'app/js/app.js',
    ])
        .pipe(plumber({
            errorHandler: notify.onError(function (err){
                return{
                    message: err.message,
                }
            })
        }))

        .pipe(concat('app.min.js'))
        .pipe(uglify())
        .pipe(dest('app/js/'))
        .pipe(browserSync.stream())
}

function styles() {
    return src('app/scss/main.scss')
        .pipe(plumber({
            errorHandler: notify.onError(function (err){
                return{
                    message: err.message,
                }
            })
        }))
        .pipe(sass())
        .pipe(concat('app.min.css'))
        .pipe(autoprefixer({overrideBrowserslist: ['last 10 versions'], grid: true}))
        .pipe(cleancss(({ level: { 1: { specialComents: 0 }}/*, format: 'beautify' */})))
        .pipe(dest('app/css/'))
        .pipe(browserSync.stream())
}

function images() {
    return src('app/img/src/**/*')
        .pipe(newer('app/img/'))
        .pipe(imagemin())
        .pipe(dest('app/img/'))
}

function cleanimg() {
    return del('app/img/**/*', { force: true })
}

function cleandist() {
    return del('dist/**/*', { force: true })
}

function buildcopy() {
    return src([
        'app/css/**/*.min.css',
        'app/js/**/*.min.js',
        'app/img/**/*',
        "app/**/*.html",
    ], { base: 'app'})
        .pipe(dest('dist'))
}

function startwatch() {
    watch('app/**/scss/**/*', styles);
    watch(['app/**/*.js', '!app/**/*.min.js'], scripts);
    watch('app/**/*.html').on('change', browserSync.reload);
    watch('app/img/src/**/*');
}

exports.browsersync = browsersync;
exports.scripts     = scripts;
exports.styles      = styles;
exports.images      = images;
exports.cleanimg    = cleanimg;

exports.build       = series(cleandist, styles, scripts, images, buildcopy);
exports.default     = parallel(styles, scripts, browsersync, startwatch);