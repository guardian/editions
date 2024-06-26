/*
{
    key:
        name of the bundle. a-z, no spaces
    project:
        project folder in this monorepo
    watchPort:
        port the local dev server is running on
    watchScript:
        script that will start watching this project and spin up the dev server
    buildScript:
        script that will build the app down to static html and assets
    buildPath:
        directory where the built app goes, the build script will move it from there to the bundle
}
*/

module.exports = {
    crosswords: {
        key: 'crosswords',
        project: 'Apps/crosswords-bundle',
        watchPort: 3000,
        watchScript: 'yarn start',
        buildScript: 'yarn build',
        buildPath: 'build',
    },
}
