var gulp = require('gulp'),
    ngAnnotate = require('gulp-ng-annotate'),
    jsHint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    wrap = require('gulp-wrap'),
    concat = require('gulp-concat'),
    minifyHtml = require('gulp-minify-html'),
    inject = require('gulp-inject'),
    templateCache = require('gulp-angular-templatecache'),
    angularFilesort = require('gulp-angular-filesort'),
    less = require('gulp-less'),
    minifyCss = require('gulp-minify-css'),
    autoprefix = require('gulp-autoprefixer'),
    merge = require('merge-stream'),
    replace = require('gulp-replace'),
    livereload = require('gulp-livereload'),
    karma = require('karma').server,
    child_process = require('child_process'),

    vars = require('./build-vars.json'),
    VENDOR_SCRIPTS = vars.VENDOR_SCRIPTS,
    VENDOR_STYLES = vars.VENDOR_STYLES,
    BASE_HREF = vars.BASE_HREF;

gulp.task('app-scripts', function() {
    return gulp.src([
        '!src/**/*.spec.js',
        'src/**/*.js'
    ])
        .pipe(jsHint())
        .pipe(jsHint.reporter('jshint-stylish'))
        .pipe(wrap('(function(){\n"use strict";\n<%= contents %>\n})();'))
        .pipe(ngAnnotate())
        .pipe(gulp.dest('build/'))
        .pipe(livereload());
});

gulp.task('vendor-scripts', function() {
    return gulp.src(VENDOR_SCRIPTS)
        .pipe(gulp.dest('build/vendor/scripts'));
});

gulp.task('app-templates', function() {
    return gulp.src('src/app/**/*.html')
        .pipe(templateCache('templates.js', { module: 'meshAdminUi.templates', standalone: true }))
        .pipe(gulp.dest('build/app/'))
        .pipe(livereload());
});

gulp.task('app-styles', function() {
    return gulp.src('src/styles/app.less')
    /**
     * Dynamically injects @import statements into the main app.less file, allowing
     * .less files to be placed around the app structure with the component
     * or page they apply to.
     */
        .pipe(inject(gulp.src(['../**/*.less'], {read: false, cwd: 'src/styles/'}), {
            starttag: '/* inject:imports */',
            endtag: '/* endinject */',
            transform: function (filepath) {
                return '@import ".' + filepath + '";';
            }
        }))
        .pipe(less())
        .pipe(autoprefix())
        .pipe(gulp.dest('build/styles'))
        .pipe(livereload());
});

gulp.task('vendor-styles', function() {
    return gulp.src(VENDOR_STYLES)
        .pipe(gulp.dest('build/vendor/styles'));
});

gulp.task('build', ['app-scripts', 'app-templates', 'vendor-scripts', 'app-styles', 'vendor-styles'], function() {

    var vendorJs = gulp.src([
        'vendor/**/angular.js',
        'vendor/**/*.js'
    ], { cwd: 'build/'} );

    var appJs = gulp.src([
        'app/**/*.js'
    ], { cwd: 'build/'} )
        .pipe(angularFilesort());

    var css = gulp.src([
        '**/angular-material.css',
        '**/loading-bar.css',
        '**/*.css'
    ], { cwd: 'build/'} );

    return gulp.src('src/index.html')
        .pipe(inject(css, { addRootSlash: false }))
        .pipe(inject(vendorJs,  {
            addRootSlash: false,
            starttag: '<!-- inject:vendorjs -->',
            endtag: '<!-- endinject -->'
        }))
        .pipe(inject(appJs,  {
            addRootSlash: false,
            starttag: '<!-- inject:appjs -->',
            endtag: '<!-- endinject -->'
        }))
        .pipe(replace(/BASE_HREF/, BASE_HREF.build))
        .pipe(gulp.dest('build/'))
        .pipe(livereload());
});

gulp.task('static-assets', function() {
    return gulp.src([
        'src/.htaccess',
        'src/assets**/**/*'
    ])
        .pipe(gulp.dest('build/'))
        .pipe(livereload());
});

gulp.task('dist', ['karma-test', 'dist-assets', 'dist-css', 'dist-js'], function() {

    var css = gulp.src('app/app.css', { cwd: 'dist' });
    var js = gulp.src('app/app.js', { cwd: 'dist' });
    var empty = gulp.src('');

    return gulp.src('src/index.html')
        .pipe(inject(css, {
            addRootSlash: false
        }))
        .pipe(inject(empty,  {
            addRootSlash: false,
            starttag: '<!-- inject:vendorjs -->',
            endtag: '<!-- endinject -->'
        }))
        .pipe(inject(js,  {
            addRootSlash: false,
            starttag: '<!-- inject:appjs -->',
            endtag: '<!-- endinject -->'
        }))
        .pipe(replace(/BASE_HREF/, BASE_HREF.dist))
        .pipe(minifyHtml({ loose: true }))
        .pipe(gulp.dest('dist/'))
});

gulp.task('dist-assets', function() {
    return gulp.src([
        'src/.htaccess',
        'src/assets**/**/*'
    ])
        .pipe(gulp.dest('dist/'));
});

gulp.task('dist-css', ['build'], function() {
    return gulp.src([
            '**/angular-material.css',
            '**/loading-bar.css',
            '**/*.css'
        ], { cwd: 'build/'} )
        .pipe(concat('app.css'))
        // TODO: clean-css is breaking the icon font definition - investigate a fix and then enable
        //.pipe(minifyCss({ processImport: false, keepBreaks: true }))
        .pipe(gulp.dest('dist/app/'));
});

gulp.task('dist-js', ['build'], function() {
    var vendorJs = gulp.src([
        'vendor/**/angular.js',
        'vendor/**/*.js'
    ], { cwd: 'build/'} );

    var appJs = gulp.src([
        'app/**/*.js'
    ], { cwd: 'build/'} )
        .pipe(angularFilesort());

    var js = merge(vendorJs, appJs);

    return js
        .pipe(concat('app.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/app/'));
});


gulp.task('karma-watch', function() {
    karma.start({
        configFile: __dirname + '/karma.conf.js'
    });
});

/**
 * Single-run all the tests
 * */
gulp.task('karma-test', function() {
    karma.start({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    });
});

gulp.task('e2e', function() {
    var selenium = child_process.exec('webdriver-manager start');

    setTimeout(function() {
        child_process.exec('protractor e2e/protractor.conf.js', function (err, stdout, stderr) {
            selenium.kill();
            console.log(stdout);
            console.log(stderr);
        });
    }, 1000);
});

gulp.task('watch', ['default', 'karma-watch'], function() {
    livereload.listen({ quiet: true });
    gulp.watch('src/app/**/*.js', ['app-scripts']);
    gulp.watch('src/app/**/*.html', ['app-templates']);
    gulp.watch('src/**/*.less', ['app-styles']);
    gulp.watch('src/index.html', ['build']);
    gulp.watch('src/assets/**/*.*', ['static-assets']);
});

gulp.task('default', ['build', 'static-assets']);