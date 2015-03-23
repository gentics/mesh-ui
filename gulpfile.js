var gulp = require('gulp'),
    ngAnnotate = require('gulp-ng-annotate'),
    jsHint = require('gulp-jshint'),
    inject = require('gulp-inject'),
    templateCache = require('gulp-angular-templatecache');


var VENDOR_SCRIPTS = [
    'bower_components/angular/angular.js',
    'bower_components/angular-animate/angular-animate.js',
    'bower_components/angular-aria/angular-aria.js',
    'bower_components/angular-material/angular-material.js',
    'bower_components/ui-router/release/angular-ui-router.js'
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

gulp.task('app-templates', function() {
    return gulp.src('src/app/**/*.html')
        .pipe(templateCache('templates.js', { module: 'caiLunAdminUi'}))
        .pipe(gulp.dest('build/app/'));
});

gulp.task('vendor-styles', function() {
    return gulp.src(VENDOR_STYLES)
        .pipe(gulp.dest('build/vendor/styles'));
});

gulp.task('index', ['app-scripts', 'app-templates', 'vendor-scripts', 'vendor-styles'], function() {
    return gulp.src('src/index.html')
        //.pipe(gulp.dest('build/'))
        .pipe(inject(gulp.src([
            'vendor/**/angular.js',
            'vendor/**/*.js',
            '**/app.js',
            '**/*.js',
            '**/*.css'
        ], { cwd: 'build/'} ),  { addRootSlash: false }))
        .pipe(gulp.dest('build/'));
});

gulp.task('static-assets', function() {
    return gulp.src([
        'src/.htaccess'
    ])
        .pipe(gulp.dest('build/'));
});

gulp.task('default', ['index', 'static-assets']);