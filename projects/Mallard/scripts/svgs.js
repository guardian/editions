const path = require('path')
const fs = require('fs')
const chalk = require('chalk')

const svgFolder = path.resolve(__dirname, '..', 'src', 'assets', 'svgs')
const bitmapFolder = path.resolve(__dirname, '..', 'src', 'assets', 'images')

// We can't guarantee these have been installed before running this script,
// e.g. if it's the first run.
// So if they have not been installed already, quickly install them locally.
// They should be specified as a depenency, so this will almost never be a problem.
const installIfNecessary = (...packages) =>
    new Promise(resolve => {
        try {
            resolve(packages.map(require))
        } catch (e) {
            childProcess
                .spawn('yarn', ['global add', ...packages], {
                    stdio: 'inherit',
                })
                .on('close', code => {
                    if (code !== 0) process.exit(code)
                    resolve(packages.map(require))
                })
        }
    })

const convertSvg = async (file, scale = 1) => {
    const [{ convertFile }] = await installIfNecessary('convert-svg-to-png')
    return convertFile(path.resolve(svgFolder, file), {
        scale,
        outputFilePath: path.resolve(
            bitmapFolder,
            path.parse(file).name + (scale !== 1 ? `@${scale}x` : '') + '.png',
        ),
    })
}

fs.readdir(svgFolder, async (err, files) => {
    const svgs = files.filter(file => path.parse(file).ext === '.svg')
    console.info(chalk.blue(`${svgs.length} svgs to convert`))
    for (const file of svgs) {
        await Promise.all([
            convertSvg(file, 1),
            convertSvg(file, 2),
            convertSvg(file, 3),
        ])
        console.log(chalk.green(`converted ${file}`))
    }
})
