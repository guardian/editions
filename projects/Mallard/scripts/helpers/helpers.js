const path = require('path')
const fs = require('fs')

const NEWLINE = '\n'
const removeWhiteSpace = s => s.trim()
const isNonEmpty = s => s
const getValueFromKey = map => key => {
    const value = map[key]
    if (!value) throw new Error(`Could not find ${key}`)
    return `${key}=${value}`
}
const writeToEnvFileinCWD = data =>
    fs.writeFileSync(path.join(process.cwd(), '.env'), data)

const fetchRequiredEnvVars = strings =>
    writeToEnvFileinCWD(
        strings[0]
            .split(NEWLINE)
            .map(removeWhiteSpace)
            .filter(isNonEmpty)
            .map(getValueFromKey(process.env))
            .join(NEWLINE),
    )

module.exports = { fetchRequiredEnvVars }
