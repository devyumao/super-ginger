var gulp = require('gulp');
var amdOptimizer = require('gulp-amd-optimizer');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var del = require('del');

var requireConfig = {
    baseUrl: 'src'
};

var options = {
    umd: false
};

gulp.task('script:src', function () {
    return gulp.src('src/**/*.js', {base: requireConfig.baseUrl})
        .pipe(amdOptimizer(requireConfig, options))
        .pipe(concat('game.js'))
        // .pipe(uglify({mangle: false}))
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
    return gulp.src(['src/img/**/*', '!src/img/psd', '!src/img/psd/**/*'])
        .pipe(gulp.dest('dist/asset/img'));
});

gulp.task('default', [
    'script:dep',
    'script:src',
    'clean:image',
    'image'
]);
