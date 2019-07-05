const fs = require('fs')
const chalk = require('chalk')
const Git = require('nodegit')
const { resolve } = require('path')

const getVersion = () => {
    try {
        const [major, minor] = fs
            .readFileSync(resolve(__dirname, '..', 'VERSION'))
            .toString()
            .split('\n')
            .shift()
            .split('.')
        if (!major || !minor) throw Error()
        return [major, minor]
    } catch (e) {
        console.log(chalk.red('Malformed VERSION file'))
        process.exit()
    }
}

const getCommitId = async () => {
    const repo = await Git.Repository.open(resolve(__dirname, '..', '..', '..'))
    const head = await repo.getHeadCommit()
    return await head.sha()
}

const getData = async () => {
    const [major, minor] = getVersion()

    const version = [major, minor, Date.now()].join('.')
    const commitId = await getCommitId()
    return { version, commitId }
}

const main = async () => {
    fs.writeFileSync(
        resolve(__dirname, '..', 'src', 'version-info.json'),
        JSON.stringify(
            {
                'hey!': `this file is generated at build time. do not edit manually. Bump up the version by editing ./VERSION`,
                ...(await getData()),
            },
            undefined,
            '\t',
        ),
    )
}
main()
