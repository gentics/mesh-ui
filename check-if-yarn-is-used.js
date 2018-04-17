const isInstallingViaYarn = process.env.npm_execpath
    && process.env.npm_execpath.indexOf('yarn') > 0;

if (!isInstallingViaYarn) {
    console.error('\nPlease use yarn (https://yarnpkg.com) to install and build this package.\n');
    process.exit(1);
}
