const { exec } = require('child_process')
const bundles = require('./manifest')

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
                ;(async () => {
                    try {
                        const chalk = await import('chalk')

                        console.log(chalk.default.green(`Bundled ${key}`))
                    } catch (error) {
                        console.error('Error loading module:', error)
                    }
                })()
            },
        )
    }
}

module.exports = { bundleHTML }
