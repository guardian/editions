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
                `rm -rf ../../projects/${location}/html/${key}.bundle`,
                `mv ./${buildPath} ../../projects/${location}/html/${key}.bundle`,
            ].join(' && '),
            (err) => {
                if (err) {
                    console.error('Failed building bundle ' + key)
                    console.error('err:', err)
                    return
                }
                console.log(chalk.green(`Bundled ${key}`))
            },
        )
    }
}

module.exports = { bundleHTML }
