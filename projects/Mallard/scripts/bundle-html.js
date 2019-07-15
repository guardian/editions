const { exec } = require('child_process')
const bundles = require('../html/manifest')
const chalk = require('chalk')

for (const { project, buildScript, key } of Object.values(bundles)) {
    exec(
        [
            `cd ../../projects/${project}`,
            buildScript,
            `rm -rf ../../projects/Mallard/html/${key}.bundle`,
            `mv ./dist ../../projects/Mallard/html/${key}.bundle`,
        ].join(' && '),
        (err, stdout, stderr) => {
            if (err || stderr) {
                console.error('Failed building bundle ' + key)
                console.error(stderr)
                return
            }
            console.log(chalk.green(`Bundled ${key}`))
        },
    )
}
