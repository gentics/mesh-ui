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
    concat = require('gulp-concat'),
    inject = require('gulp-inject'),
    templateCache = require('gulp-angular-templatecache'),
    angularFilesort = require('gulp-angular-filesort'),
    less = require('gulp-less'),
    minifyCss = require('gulp-minify-css'),
    autoprefix = require('gulp-autoprefixer'),
    merge = require('merge-stream'),
    gulpif = require('gulp-if'),
    replace = require('gulp-replace'),
    livereload = require('gulp-livereload'),
    KarmaServer = require('karma').Server,
    child_process = require('child_process'),
    bump = require('gulp-bump'),
    tap = require('gulp-tap'),
    sourcemaps = require('gulp-sourcemaps'),
    filter = require('gulp-filter'),
    debug = require('gulp-debug'),

    vars = require('./build-vars.json'),
    VENDOR_SCRIPTS = vars.VENDOR_SCRIPTS,
    VENDOR_STYLES = vars.VENDOR_STYLES,
    KARMA_FILES_BUILD = VENDOR_SCRIPTS.concat(vars.KARMA_FILES_BUILD),
    KARMA_FILES_DIST = vars.KARMA_FILES_DIST;

/**
 * Log to console with current time.
 * @param {string} message
 */
function log(message) {
    var now = new Date();
    var timeString = now.toTimeString().split(' ')[0];
    console.log('[' + timeString + '] ' +message);
}

/**
 * Completely remove the build/ and /dist folders
 */
function clean() {
    log('cleaning build & dist folders');

    return new Promise(function(resolve) {
        del([
            'build',
            'dist'
        ], resolve);
    });
}

function compile_appScripts(uiVersion) {
    return gulp.src([
            'typings/**/*.ts',
            '!src/app/common/aloha/**/*.ts',
            'src/app/**/*.ts'
        ])
        .pipe(sourcemaps.init())
        .pipe(ts({
            declarationFiles: true,
            noExternalResolve: false,
            target: 'ES5'
        })).js
        .pipe(replace('/*injectCurrentVersion*/', 'window.meshUiVersion = "' + uiVersion + '";'))
        .pipe(angularFilesort())
        .pipe(ngAnnotate())
        .pipe(concat('app.js'))
        .pipe(sourcemaps.write('.'))
}

function transpile_aloha_plugins() {
    return gulp.src([
            'src/app/common/aloha/**/*.ts'
        ])
        .pipe(ts({
            declarationFiles: true,
            noExternalResolve: false,
            target: 'ES5'
        })).js;
}

function build_aloha_plugins() {
    log('build_aloha_plugins');
    return new Promise(function(resolve, reject) {
        transpile_aloha_plugins()
            .pipe(gulp.dest('build/assets/vendor/aloha-editor/plugins/mesh'))
            .pipe(livereload())
            .on('end', resolve)
            .on('error', reject);
    });
}

function dist_aloha_plugins() {
    log('dist_aloha_plugins');
    return new Promise(function(resolve, reject) {
        transpile_aloha_plugins()
            .pipe(uglify())
            .pipe(gulp.dest('dist/assets/vendor/aloha-editor/plugins/mesh'))
            .on('end', resolve)
            .on('error', reject);
    });
}

function compile_microschema_controls(dest) {
    log('compile_microschema_controls');
    return new Promise(function(resolve, reject) {

        var tsFiles = gulp.src(['src/microschemaControls/**/*.ts'])
            .pipe(ts({
                declarationFiles: true,
                noExternalResolve: false,
                target: 'ES5'
            })).js;

        var jsFiles = gulp.src('src/microschemaControls/**/*.js');

        return merge(tsFiles, jsFiles)
            .pipe(gulpif(dest === 'dist', uglify()))
            .pipe(gulp.dest(dest + '/microschemaControls'))
            .pipe(livereload())
            .on('end', resolve)
            .on('error', reject);
    });
}

function copy_microschema_controls(dest) {
    log('copy_microschema_controls');
    dest = typeof dest === 'string' ? dest : 'build';
    return new Promise(function(resolve, reject) {
        compile_microschema_controls(dest)
            .then(function() {
                gulp.src([
                        '!src/microschemaControls/**/*.ts',
                        '!src/microschemaControls/**/*.js',
                        'src/microschemaControls/**/*.*'
                    ])
                    .pipe(gulp.dest(dest + '/microschemaControls'))
                    .on('end', resolve)
                    .on('error', reject);
            });
    });
}

function build_appScripts() {
    log('build_appScripts');

    getUiVersion(false)
        .then(function(version) {
            return new Promise(function(resolve, reject) {
                return compile_appScripts(version)
                    .pipe(gulp.dest('build/app'))
                    .pipe(livereload())
                    .on('end', resolve)
                    .on('error', reject);
            });
        });
}

function build_vendorScripts() {
    log('build_vendorScripts');

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
    log('build_appTemplates');

    return new Promise(function(resolve, reject) {
        return compile_Templates()
            .pipe(gulp.dest('build/app/'))
            .pipe(livereload())
            .on('end', resolve)
            .on('error', reject);
    });
}

/**
 * Dynamically injects @import statements into the main app.less file, allowing
 * .less files to be placed around the app structure with the component
 * or page they apply to.
 */
function build_app_less() {
    return gulp.src('src/styles/app.less')
        .pipe(inject(gulp.src(['../**/*.less'], {read: false, cwd: 'src/styles/'}), {
            starttag: '/* inject:imports */',
            endtag: '/* endinject */',
            transform: function (filepath) {
                return '@import ".' + filepath + '";';
            }
        }))
        .pipe(less())
        .pipe(autoprefix());
}

function build_appStyles() {
    log('build_appStyles');

    return new Promise(function(resolve, reject) {
        build_app_less()
            .pipe(gulp.dest('build/styles'))
            .pipe(livereload())
            .on('end', resolve)
            .on('error', reject);
    });
}

function build_vendorStyles() {
    log('build_vendorStyles');

    return new Promise(function(resolve, reject) {
        return gulp.src(VENDOR_STYLES)
            .pipe(gulp.dest('build/vendor/styles'))
            .on('end', resolve)
            .on('error', reject);
    });
}

function build_staticAssets() {
    log('build_staticAssets');

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
    log('build_index');

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

        return gulp.src(['src/index.html', 'src/mesh-ui-config.js'])
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

/**
 * Returns a promise resolving to the current version of the MeshUI. If `bumpPatch` is true, then the
 * version patch will be incremented first and then the new value returned.
 */
function getUiVersion(bumpPatch){
    bumpPatch = bumpPatch === undefined ? false : bumpPatch;
    var uiVersion;

    return new Promise(function(resolve, reject) {
        if (bumpPatch) {
            return gulp.src('./build-vars.json')
                .pipe(bump({key: 'VERSION'}))
                .pipe(gulp.dest('./'))
                .pipe(tap(function (file) {
                    var json = JSON.parse(String(file.contents));
                    uiVersion = json.VERSION;
                }))
                .on('end', function() {
                    resolve(uiVersion)
                })
                .on('error', reject);
        } else {
            resolve(vars.VERSION);
        }
    });
}

gulp.task('build', function() {

    return clean()
        .then(function() {
            return Promise.all([
                build_appScripts(),
                build_aloha_plugins(),
                copy_microschema_controls('build'),
                build_appTemplates(),
                build_vendorScripts(),
                build_appStyles(),
                build_vendorStyles(),
                build_staticAssets()
            ]);
        })
        .then(build_index)
        .catch(function(err) {
            log(err);
        });
});


function dist_assets() {
    log('dist_assets');

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
    log('dist_css');

    return new Promise(function(resolve, reject) {
        var vendorCss = gulp.src(VENDOR_STYLES);
        var appCss = build_app_less();

        return merge(vendorCss, appCss)
            .pipe(concat('app.css'))
                // TODO: this has been disabled due to this bug introduced by the latest version
                // of angular-material: https://github.com/angular/material/issues/6304
                // Should be re-enabled once bug is fixed.
            // piping through the less plugin forces the font @imports to the top of the file.
            //.pipe(less())
            // TODO: clean-css is breaking the icon font definition - investigate a fix and then enable
            //.pipe(minifyCss({ processImport: false, keepBreaks: true }))
            .pipe(gulp.dest('dist/app/'))
            .on('end', resolve)
            .on('error', reject);
    });
}

function dist_js() {
    log('dist_js');

    return getUiVersion(false)
        .then(function(uiVersion) {
            return new Promise(function(resolve, reject) {
                var vendorJs = gulp.src(VENDOR_SCRIPTS);
                var appTemplates = compile_Templates();
                var appJs = compile_appScripts(uiVersion);

                var js = merge(vendorJs, appJs, appTemplates);

                return js
                    .pipe(filter(['**/*.js']))
                    .pipe(concat('./app.js'))
                    .pipe(uglify({}).on('error', function(err) {
                        console.error(err.toString());
                        this.emit('end');
                    }))
                    .pipe(gulp.dest('dist/app/'))
                    .on('end', resolve)
                    .on('error', reject);
            });
    });
}

/**
 * The ACE code editor (used to edit the schema JSON) uses some kind of lazy-loading to start up a web worker
 * thread. Just including the worker-json.js file in the dist bundle therefore does not work. We need to make
 * it available as a standalone file in the dist build, and point to it wherever we use the ui-ace directive.
 * See https://github.com/angular-ui/ui-ace#support-for-concatenated-bundles
 */
function dist_ace_worker() {
    log('dist_ace_worker');

    return new Promise(function(resolve, reject) {
        return gulp.src('bower_components/ace-builds/src-min-noconflict/worker-json.js')
            .pipe(gulp.dest('dist/vendor/scripts'))
            .on('end', resolve)
            .on('error', reject);
    });
}

function dist_index() {
    log('dist_index');

    return new Promise(function(resolve, reject) {
        var css = gulp.src('app/app.css', {cwd: 'dist'});
        var js = gulp.src('app/app.js', {cwd: 'dist'});
        var empty = gulp.src('');

        return gulp.src(['src/index.html', 'src/mesh-ui-config.js'])
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
            dist_js(),
            dist_aloha_plugins(),
            dist_ace_worker(),
            copy_microschema_controls('dist')
        ])
        .then(dist_index)
        .then(karma_dist);
});

/**
 * Bumps the version patch number in the build-vars.json file. Should be run after each feature is added / bug fixed.
 */
gulp.task('bump-version', function() {
    return getUiVersion(true);
});


gulp.task('karma-app-templates', function() {
    return build_appTemplates();
});

function karmaWatch() {
    var server = new KarmaServer({
        configFile: __dirname + '/karma.conf.js',
        files: KARMA_FILES_BUILD,
        junitReporter: { outputFile: 'build/junit.xml' }
    });
    server.start();
}

gulp.task('karma-watch', ['karma-app-templates'], function() {
    karmaWatch();
});

/**
 * Single-run all the tests on the dev version of the scripts
 * */
gulp.task('karma-test', ['build'], function() {
    log('running tests against development build code...');
    return new Promise(function(resolve, reject) {
        var server = new KarmaServer({
            configFile: __dirname + '/karma.conf.js',
            singleRun: true,
            files: KARMA_FILES_BUILD,
            junitReporter: { outputFile: 'build/junit.xml' }
        }, function(exitCode) {
            handleKarmaExitCode(exitCode, resolve, reject);
        });
        server.start();
    });
});

/**
 * Single-run all the tests on the production, minified version of the scripts
 * */
function karma_dist() {
    log('running tests against minified production code...');
    return new Promise(function(resolve, reject) {
        var server = new KarmaServer({
            configFile: __dirname + '/karma.conf.js',
            singleRun: true,
            files: KARMA_FILES_DIST,
            reporters: ['progress']
        }, function(exitCode) {
            handleKarmaExitCode(exitCode, resolve, reject);
        });
        server.start();
    });
}
gulp.task('karma-dist', function() {
    return karma_dist();
});

/**
 * Ensure that the build fails if any tests do not pass.
 */
function handleKarmaExitCode(exitCode, resolve, reject) {
    if (exitCode === 0) {
        resolve(0);
    } else {
        reject(exitCode);
    }
}

gulp.task('e2e', function() {
    var selenium = child_process.exec('webdriver-manager start');

    setTimeout(function() {
        child_process.exec('protractor e2e/protractor.conf.js', function (err, stdout, stderr) {
            selenium.kill();
            log(stdout);
            log(stderr);
        });
    }, 1000);
});

gulp.task('watch', ['default'], function() {
    karmaWatch();
    livereload.listen({ quiet: true });
    gulp.watch(['src/app/**/*.js', 'src/app/**/*.ts', '!src/app/common/aloha/**/*.ts'], build_appScripts);
    gulp.watch('src/app/common/aloha/**/*.ts', build_aloha_plugins);
    gulp.watch('src/microschemaControls/**/*.*', copy_microschema_controls);
    gulp.watch('src/app/**/*.html', build_appTemplates);
    gulp.watch('src/**/*.less', build_appStyles);
    gulp.watch(['src/index.html', 'src/mesh-ui-config.js'], build_index);
    gulp.watch('src/assets/**/*.*', build_staticAssets);
});

gulp.task('default', ['build']);
gulp.task('test', function() {
    return dist_js();
});

