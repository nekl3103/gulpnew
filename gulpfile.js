const gulp = require('gulp'),
    prefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    include = require('gulp-include'),
    cleanCSS = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    sassGlob = require('gulp-sass-glob'),
    browserSync = require('browser-sync'),
    hash = require('gulp-hash'),
    plumber = require('gulp-plumber'),
    imageMin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    svgcss = require('gulp-svg-css'),
    svgmin = require('gulp-svgmin'),
    font64 = require('gulp-simplefont64');


const FILE_HASH_TEMPLATE = '<%= name %>.min<%= ext %>';



gulp.task('fonts', function () {
    return gulp.src(['./fonts/*.otf', './fonts/*.ttf', './fonts/**/*.otf', './fonts/**/*.ttf'])
        .pipe(font64())
        .pipe(gulp.dest('css/fonts'));
});

gulp.task('svg', function () {
    return gulp.src('images/svg/*.svg')
        .pipe(svgmin())
        .pipe(svgcss({
            fileName: 'icons',
            cssPrefix: 'icon-',
            addSize: false
        }))
        .pipe(gulp.dest('css'));
});

gulp.task('images', function () {
    return gulp.src('./gulp_img/*')
        .pipe(imageMin({
            progressive: true,
            svgoPlugins: [{ removeViewBox: false }],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest('images'))
        .pipe(browserSync.stream());

});

gulp.task('scripts', function () {
    gulp.src('./js/main.js')
        .pipe(plumber())
        .pipe(include())
        .pipe(uglify())
        .pipe(hash({ template: FILE_HASH_TEMPLATE }))
        .pipe(plumber.stop())
        .pipe(gulp.dest('js'))
        .pipe(browserSync.stream());
});

gulp.task('sass', function () {
    gulp.src('./css/main.scss')
        .pipe(plumber())
        .pipe(sassGlob())
        .pipe(sass({ errLogToConsole: true }))
        .pipe(prefixer())
        .pipe(cleanCSS())
        .pipe(rename({ suffix: '.min' }))
        .pipe(plumber.stop())
        .pipe(gulp.dest('css'))
        .pipe(browserSync.stream());
});


gulp.task('build', [
    'sass',
    'scripts',
    'images',
    'svg',
    'fonts',
]);

gulp.task('watch', function () {
    gulp.watch('css/**/*.scss', ['sass']);
    gulp.watch(['js/lib/**', 'js/partials/**'], ['scripts']);
    gulp.watch('gulp_img/*', ['images']);
    gulp.watch('images/svg/*', ['svg']);
    gulp.watch(['fonts/*', 'fonts/**/*'], ['fonts']);
});
gulp.task('default', ['build', 'watch']);