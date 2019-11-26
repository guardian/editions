const { exec } = require('child_process')
const bundles = require('./manifest')
const chalk = require('chalk')

const bundleHTML = (location = 'Mallard') => {
    for (const { project, buildScript, buildPath, key } of Object.values(
        bundles,
    )) {
        exec(
            [
                `cd ../../projects/${project}`,
                buildScript,
                `rm -rf ../../../projects/${location}/html/${key}.bundle`,
                `mv ./${buildPath} ../../../projects/${location}/html/${key}.bundle`,
            ].join(' && '),
            (err, _, stderr) => {
                if (err || stderr) {
                    console.error('Failed building bundle ' + key)
                    console.error(stderr)
                    return
                }
                console.log(chalk.green(`Bundled ${key}`))
            },
        )
    }
}

module.exports = { bundleHTML }
