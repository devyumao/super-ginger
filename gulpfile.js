var gulp = require('gulp');
var amdOptimizer = require('gulp-amd-optimizer');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var del = require('del');
var replace = require('gulp-replace');

var requireConfig = {
    baseUrl: 'src'
};

var options = {
    umd: false
};

var timestamp = (new Date().valueOf() + '').slice(0, -3);

gulp.task('index', function () {
    return gulp.src('dist/index.php')
        .pipe(replace(/(game\.js\?v=)\d+/g, '$1' + timestamp))
        .pipe(gulp.dest('dist'));
});

gulp.task('script:src', function () {
    return gulp.src('src/**/*.js', {base: requireConfig.baseUrl})
        .pipe(replace(/\*TIMESTAMP\*/g, timestamp))
        .pipe(amdOptimizer(requireConfig, options))
        .pipe(concat('game.js'))
        .pipe(uglify({mangle: false}))
        .pipe(gulp.dest('dist/asset'));
});

gulp.task('script:dep', function () {
    return gulp.src('dep/*.js')
        .pipe(gulp.dest('dist/dep'));
});

gulp.task('clean:image', function () {
    del.sync(['dist/asset/img']);
});

gulp.task('image', function () {
    return gulp.src(['src/img/**/*.png', '!src/img/psd', '!src/img/psd/**/*'])
        .pipe(gulp.dest('dist/asset/img'));
});

gulp.task('default', [
    'index',
    'script:dep',
    'script:src',
    'clean:image',
    'image'
]);
