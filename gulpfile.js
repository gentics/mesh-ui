var gulp = require('gulp'),
    ngAnnotate = require('gulp-ng-annotate'),
    jsHint = require('gulp-jshint'),
    inject = require('gulp-inject');


var VENDOR_SCRIPTS = [
    'bower_components/angular/angular.js',
    'bower_components/angular-animate/angular-animate.js',
    'bower_components/angular-aria/angular-aria.js',
    'bower_components/angular-material/angular-material.js'
];

var VENDOR_STYLES = [
    'bower_components/angular-material/angular-material.css'
];

gulp.task('app-scripts', function() {
   return gulp.src([
       'src/**/*.js'
   ])
       .pipe(jsHint())
       .pipe(ngAnnotate())
       .pipe(gulp.dest('build/app'));
});

gulp.task('vendor-scripts', function() {
    return gulp.src(VENDOR_SCRIPTS)
        .pipe(gulp.dest('build/vendor/scripts'));
});

gulp.task('vendor-styles', function() {
    return gulp.src(VENDOR_STYLES)
        .pipe(gulp.dest('build/vendor/styles'));
});

gulp.task('index', ['app-scripts', 'vendor-scripts', 'vendor-styles'], function() {
    return gulp.src('src/index.html')
        //.pipe(gulp.dest('build/'))
        .pipe(inject(gulp.src([
            'vendor/**/angular.js',
            'vendor/**/*.js',
            '**/*.js',
            '**/*.css'
        ], { cwd: 'build/'} ),  { addRootSlash: false }))
        .pipe(gulp.dest('build/'));
});

gulp.task('default', ['index']);