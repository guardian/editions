const path = require('path')
const fs = require('fs')
const chalk = require('chalk')
const { convertFile } = require('convert-svg-to-png')

const svgFolder = path.resolve(__dirname, '..', 'src', 'assets', 'svgs')
const bitmapFolder = path.resolve(__dirname, '..', 'src', 'assets', 'images')

const convertSvg = (file, scale = 1) =>
    convertFile(path.resolve(svgFolder, file), {
        scale,
        outputFilePath: path.resolve(
            bitmapFolder,
            path.parse(file).name + (scale !== 1 ? `@${scale}x` : '') + '.png',
        ),
    })

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
