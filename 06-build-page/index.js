const path = require('path')
const fs = require('fs')

const pathToNewFile = path.join(__dirname, 'project-dist')
const pathToAssets = path.join(__dirname, 'assets')
const pathToNewAssets = path.join(__dirname, 'project-dist', 'assets')
const pathToStyles = path.join(__dirname, 'styles')
const pathToNewStyle = path.join(__dirname, 'project-dist', 'style.css')
const pathToTemplate = path.join(__dirname, 'template.html')
const pathToIndex = path.join(__dirname, 'project-dist', 'index.html')
const pathToComponents = path.join(__dirname, 'components')

fs.access(pathToNewFile, (error) => {
    if (error) {
        createDir()
        addStyles()
        copyDir(pathToAssets, pathToNewAssets)
        addIndex()
    } else {
        updateDir()
    }
})

async function createDir() {
    await fs.promises.mkdir(pathToNewFile, { recursive: true })
    await fs.promises.mkdir(pathToNewAssets, { recursive: true })
}

function addStyles() {
    const output = fs.createWriteStream(pathToNewStyle)
    fs.readdir(pathToStyles , (error, styles) => {
        styles.forEach(style => {
            const filePath = path.join(pathToStyles, style)
            const fileExt = path.extname(filePath)
            if(fileExt.slice(1) === 'css') {
                const input =  fs.createReadStream(filePath)
                let data = ''
                input.on('data', chunk => data += (chunk + '\n'))
                input.on('end', () => output.write(data))
            }
        })
    })
}

async function updateDir() {
    await fs.promises.rm(pathToNewFile, {recursive:true});
    await fs.promises.mkdir(pathToNewFile, { recursive: true });
    await fs.promises.mkdir(pathToNewAssets, { recursive: true });
    addStyles();
    copyDir(pathToAssets, pathToNewAssets);
    addIndex();
}

function copyDir (oldPathOfFile, newPathOfFile) {
    fs.readdir(oldPathOfFile, {withFileTypes: true}, (error, files) => {
        files.forEach(file => {
            if(file.isDirectory()) {
                const newDir = path.join(newPathOfFile, file.name);
                fs.mkdir(newDir, { recursive: true }, (error) => {
                    if (error) {
                        console.log(error.message)
                    }
                })
                const fromPath = path.join(oldPathOfFile, file.name)
                const toPath = path.join(newPathOfFile, file.name)
                copyDir(fromPath, toPath)
            } else {
                const fromPath = path.join(oldPathOfFile, file.name)
                const toPath = path.join(newPathOfFile, file.name)
                fs.copyFile(fromPath, toPath, error => {
                    if (error) {
                        console.log(error.message)
                    }
                })
            }
        })
    })
}

function addIndex() {
    const input =  fs.createReadStream(pathToTemplate)
    let data = ''
    input.on('data', chunk => data += chunk)
    input.on('end', () => {
        getIndex(data)
    })
}

function getIndex(template) {
    fs.readdir(pathToComponents,{withFileTypes:true},(error,files)=>{
        if (error) {
            console.log(error.message)
        }
        replaceTags(files, template)
    })
}

function  replaceTags(files, indexContent) {
    files.forEach(file => {
        const filePath = path.resolve(pathToComponents, file.name)
        const fileExt = path.extname(filePath)
        if(fileExt.slice(1) === 'html') {
            const output = fs.createWriteStream(pathToIndex)
            const input =  fs.createReadStream(filePath)
            let data = ''
            input.on('data', chunk => data += chunk)
            input.on('end', () => {
                const fileName =  path.basename(filePath, fileExt)
                indexContent =  indexContent.replace(`{{${fileName}}}`, data)
                output.write(indexContent);
            })
        }
    })
}