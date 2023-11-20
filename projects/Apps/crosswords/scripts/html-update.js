const fs = require('fs')
const { resolve } = require('path')

const filePath = resolve(__dirname, '..', 'dist', 'index.html')

// Read the content of the file
fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error(`Error reading file ${filePath}: ${err}`)
        return
    }

    // Replace "type='module'" with "type='text/javascript'"
    // This is because 'module' doesnt work when running a file without a browser
    const updatedContent = data.replace(
        'type="module"',
        'type="text/javascript"',
    )

    const updateAgain = updatedContent.replace('src="/', 'src="')

    // Overwrite the file with the updated content
    fs.writeFile(filePath, updateAgain, 'utf8', (err) => {
        if (err) {
            console.error(`Error writing file ${filePath}: ${err}`)
            return
        }

        console.log(`File ${filePath} has been updated successfully.`)
    })
})
