/**
 * Mesh Build Script
 *
 * Using pure JS functions and built-in ES6 Promises where possible as in http://stackoverflow.com/a/29722640/772859
 * Native promises require Node >= v0.12.x
 *
 * @type {gulp.Gulp}
 */

var gulp = require('gulp'),
    del = require('del'),
    ts = require('gulp-typescript'),
    ngAnnotate = require('gulp-ng-annotate'),
    tslint = require('gulp-tslint'),
    uglify = require('gulp-uglify'),
    wrap = require('gulp-wrap'),
    concat = require('gulp-concat'),
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
    VENDOR_STYLES = vars.VENDOR_STYLES;

/**
 * Completely remove the build/ and /dist folders
 */
function clean() {
    console.log('cleaning build & dist folders');

    return new Promise(function(resolve) {
        del([
            'build',
            'dist'
        ], resolve);
    });
}

function compile_appScripts() {
    return gulp.src([
            'typings/**/*.ts',
            '!src/app/common/aloha/**/*.ts',
            'src/app/**/*.ts'
        ])
        /*.pipe(tslint())
         .pipe(tslint.report('prose'))*/
        .pipe(ts({
            declarationFiles: true,
            noExternalResolve: false,
            target: 'ES5'
        })).js
        .pipe(angularFilesort())
        .pipe(ngAnnotate())
        .pipe(concat('app.js'));
}

function compile_aloha_plugins() {
    console.log('compile_aloha_plugins');
    return new Promise(function(resolve, reject) {
        gulp.src([
                'src/app/common/aloha/**/*.ts'
            ])
            .pipe(ts({
                declarationFiles: true,
                noExternalResolve: false,
                target: 'ES5'
            })).js
            .pipe(gulp.dest('build/assets/vendor/aloha-editor/plugins/mesh'))
            .pipe(livereload())
            .on('end', resolve)
            .on('error', reject);
    });
}

function build_appScripts() {
    console.log('build_appScripts');

    return new Promise(function(resolve, reject) {
        return compile_appScripts()
            .pipe(gulp.dest('build/app'))
            .pipe(livereload())
            .on('end', resolve)
            .on('error', reject);
    });
}

function build_vendorScripts() {
    console.log('build_vendorScripts');

    return new Promise(function(resolve, reject) {
        return gulp.src(VENDOR_SCRIPTS)
            .pipe(gulp.dest('build/vendor/scripts'))
            .on('end', resolve)
            .on('error', reject);
    });
}

function compile_Templates() {
    return gulp.src('src/app/**/*.html')
        .pipe(templateCache('templates.js', {module: 'meshAdminUi.templates', standalone: true}));
}

function build_appTemplates() {
    console.log('build_appTemplates');

    return new Promise(function(resolve, reject) {
        return compile_Templates()
            .pipe(gulp.dest('build/app/'))
            .pipe(livereload())
            .on('end', resolve)
            .on('error', reject);
    });
}

function build_appStyles() {
    console.log('build_appStyles');

    return new Promise(function(resolve, reject) {
        /**
         * Dynamically injects @import statements into the main app.less file, allowing
         * .less files to be placed around the app structure with the component
         * or page they apply to.
         */
        return gulp.src('src/styles/app.less')
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
            .pipe(livereload())
            .on('end', resolve)
            .on('error', reject);
    });
}

function build_vendorStyles() {
    console.log('build_vendorStyles');

    return new Promise(function(resolve, reject) {
        return gulp.src(VENDOR_STYLES)
            .pipe(gulp.dest('build/vendor/styles'))
            .on('end', resolve)
            .on('error', reject);
    });
}

function build_staticAssets() {
    console.log('build_staticAssets');

    return new Promise(function(resolve, reject) {
        return gulp.src([
            'src/assets**/**/*'
        ])
            .pipe(gulp.dest('build/'))
            .pipe(livereload())
            .on('end', resolve)
            .on('error', reject);
    });
}

function build_index() {
    console.log('build_index');

    return new Promise(function(resolve, reject) {

        var vendorJs = gulp.src([
            'vendor/**/angular.js',
            'vendor/**/*.js'
        ], {cwd: 'build/'});

        var appJs = gulp.src([
            'app/**/*.js'
        ], {cwd: 'build/'});

        var css = gulp.src([
            '**/angular-material.css',
            'vendor/**/*.css',
            '!assets/vendor/**/*.css',
            '**/*.css'
        ], {cwd: 'build/'});

        return gulp.src(['src/index.html', 'src/meshConfig.js'])
            .pipe(inject(css, {addRootSlash: false}))
            .pipe(inject(vendorJs, {
                addRootSlash: false,
                starttag: '<!-- inject:vendorjs -->',
                endtag: '<!-- endinject -->'
            }))
            .pipe(inject(appJs, {
                addRootSlash: false,
                starttag: '<!-- inject:appjs -->',
                endtag: '<!-- endinject -->'
            }))
            .pipe(gulp.dest('build/'))
            .pipe(livereload())
            .on('end', resolve)
            .on('error', reject);
    });
}

gulp.task('build', function() {

    return clean()
        .then(function() {
            return Promise.all([
                build_appScripts(),
                compile_aloha_plugins(),
                build_appTemplates(),
                build_vendorScripts(),
                build_appStyles(),
                build_vendorStyles(),
                build_staticAssets()
            ]);
        })
        .then(build_index)
        .catch(function(err) {
            console.log(err);
        });
});


function dist_assets() {
    console.log('dist_assets');

    return new Promise(function(resolve, reject) {
        return gulp.src([
            'src/assets**/**/*'
        ])
            .pipe(gulp.dest('dist/'))
            .on('end', resolve)
            .on('error', reject);
    });
}

function dist_css() {
    console.log('dist_css');

    return new Promise(function(resolve, reject) {
        return gulp.src([
            '**/angular-material.css',
            '**/loading-bar.css',
            'styles/app.css'
        ], {cwd: 'build/'})
            .pipe(concat('app.css'))
            // piping through the less plugin forces the font @imports to the top of the file.
            .pipe(less())
            // TODO: clean-css is breaking the icon font definition - investigate a fix and then enable
            //.pipe(minifyCss({ processImport: false, keepBreaks: true }))
            .pipe(gulp.dest('dist/app/'))
            .on('end', resolve)
            .on('error', reject);
    });
}

function dist_js() {
    console.log('dist_js');

    return new Promise(function(resolve, reject) {
        var vendorJs = gulp.src(VENDOR_SCRIPTS);
        var appTemplates = compile_Templates();
        var appJs = compile_appScripts();

        var js = merge(vendorJs, appJs, appTemplates);

        return js
            .pipe(concat('app.js'))
//            .pipe(uglify())
            .pipe(gulp.dest('dist/app/'))
            .on('end', resolve)
            .on('error', reject);
    });
}

function dist_index() {
    console.log('dist_index');

    return new Promise(function(resolve, reject) {
        var css = gulp.src('app/app.css', {cwd: 'dist'});
        var js = gulp.src('app/app.js', {cwd: 'dist'});
        var empty = gulp.src('');

        return gulp.src(['src/index.html', 'src/meshConfig.js'])
            .pipe(inject(css, {
                addRootSlash: false
            }))
            .pipe(inject(empty, {
                addRootSlash: false,
                starttag: '<!-- inject:vendorjs -->',
                endtag: '<!-- endinject -->'
            }))
            .pipe(inject(js, {
                addRootSlash: false,
                starttag: '<!-- inject:appjs -->',
                endtag: '<!-- endinject -->'
            }))
            //.pipe(minifyHtml({loose: true}))
            .pipe(removeHtmlComments())
            .pipe(gulp.dest('dist/'))
            .on('end', resolve)
            .on('error', reject);
    });
}

function removeHtmlComments() {
    return replace(/<!--[\s\S]*?-->/g, '');
}

gulp.task('dist', ['karma-test'], function() {
    return Promise.all([
        dist_assets(),
        dist_css(),
        dist_js()
    ])
        .then(dist_index);
});



gulp.task('karma-app-templates', function() {
    return build_appTemplates();
});

function karmaWatch() {
    karma.start({
        configFile: __dirname + '/karma.conf.js'
    });
}

gulp.task('karma-watch', ['karma-app-templates'], function() {
    karmaWatch();
});

/**
 * Single-run all the tests
 * */
gulp.task('karma-test', ['build'], function() {
    return new Promise(function(resolve, reject) {
        karma.start({
            configFile: __dirname + '/karma.conf.js',
            singleRun: true
        }, resolve);
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

gulp.task('watch', ['default'], function() {
    karmaWatch();
    livereload.listen({ quiet: true });
    gulp.watch(['src/app/**/*.js', 'src/app/**/*.ts', '!src/app/common/aloha/**/*.ts'], build_appScripts);
    gulp.watch('src/app/common/aloha/**/*.ts', compile_aloha_plugins);
    gulp.watch('src/app/**/*.html', build_appTemplates);
    gulp.watch('src/**/*.less', build_appStyles);
    gulp.watch('src/index.html', build_index);
    gulp.watch('src/assets/**/*.*', build_staticAssets);
});

gulp.task('default', ['build']);

