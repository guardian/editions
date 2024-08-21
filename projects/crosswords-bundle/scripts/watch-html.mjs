import { exec } from 'child_process'
import { bundles } from './manifest.mjs'
import fs from 'fs'
import chalk from 'chalk'
import kill from 'kill-port'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const watchHTML = () => {
    const startWatchers = async () => {
        for (const { project, watchScript, key, watchPort } of Object.values(
            bundles,
        )) {
            await kill(watchPort, 'tcp').catch(() => {})
            setTimeout(() => {
                console.log(chalk.green(`Watching ${key}`))
                exec(
                    [`cd ../../${project}`, watchScript].join(' && '),
                    (err, stdout, stderr) => {
                        if (err || stderr) {
                            if (stderr.includes('SIGKILL')) {
                                console.log('Process replaced.')
                                process.exit(0)
                            }
                            console.error(
                                chalk.red('Failed watching bundle ' + key),
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
