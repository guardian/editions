const { exec } = require('child_process')
const bundles = require('./manifest')
const fs = require('fs')
const { resolve } = require('path')
const kill = require('kill-port')

const chalkMessage = (message, colour) => {
    ;(async () => {
        try {
            const chalk = await import('chalk')
            switch (colour) {
                case 'green':
                    console.log(chalk.default.green(message))
                    break
                case 'red':
                    console.log(chalk.default.red(message))
                    break
                case 'yellow':
                    console.log(chalk.default.yellow(message))
                    break
                default:
                    console.log(chalk.default.white(message))
                    break
            }
        } catch (error) {
            console.error('Error loading module:', error)
        }
    })()
}

const watchHTML = () => {
    const startWatchers = async () => {
        for (const { project, watchScript, key, watchPort } of Object.values(
            bundles,
        )) {
            await kill(watchPort, 'tcp').catch(() => {})
            setTimeout(() => {
                chalkMessage(`Watching ${key}`, 'green')
                exec(
                    [`cd ../../${project}`, watchScript].join(' && '),
                    (err, stdout, stderr) => {
                        if (err || stderr) {
                            if (stderr.includes('SIGKILL')) {
                                console.log('Process replaced.')
                                process.exit(0)
                            }
                            console.error(
                                chalkMessage(
                                    'Failed watching bundle ' + key,
                                    'red',
                                ),
                            )
                            console.error(stderr)

                            fs.readFileSync(0) //Don't immediately exit, allow the user to read the message.
                            process.exit(1)
                            return
                        }
                    },
                )
            }, 2000)
        }
    }

    const main = async () => {
        fs.writeFileSync(
            resolve(__dirname, '..', 'src', 'html-bundle-info.json'),
            JSON.stringify(
                {
                    'hey!': `this file is generated at build time. do not edit manually. Bump up the version by editing ./VERSION`,
                    bundles,
                },
                undefined,
                '\t',
            ),
        )
        startWatchers()
    }
    main()
}

module.exports = { watchHTML }
