const path = require('path')
const fs = require('fs')

const pathFromFile = path.resolve(__dirname, 'styles')
const pathForBundleFile = path.resolve(__dirname, 'project-dist', 'bundle.css')
const output = fs.createWriteStream(pathForBundleFile)

fs.readdir(pathFromFile, (err, styles) => {
    styles.forEach(style => {
        const filePath = path.join(pathFromFile, style)
        const fileExt = path.extname(filePath)
        if (fileExt.slice(1) === 'css') {
            const input = fs.createReadStream(filePath)
            let data = ''
            input.on('data', chunk => data += (chunk + '\n'))
            input.on('end', () => output.write(data))
        }
    })
})