const fs = require('fs')
const path = require('path')

const pathToOldFile = path.join(__dirname, 'files')
const pathToNewFile = path.join(__dirname, 'files-copy')

fs.access(pathToNewFile, (error) => {
    if (error) {
        createDir()
        copyDir(pathToOldFile, pathToNewFile)
    } else {
        updateDir()
    }
});

async function createDir() {
    await fs.promises.mkdir(pathToNewFile, {recursive: true})

}

async function updateDir() {
    await fs.promises.rm(pathToNewFile, {recursive: true})
    await fs.promises.mkdir(pathToNewFile, {recursive: true})
    copyDir(pathToOldFile, pathToNewFile)

}

function copyDir(oldPathOfFile, newPathOfFile) {
    fs.readdir(oldPathOfFile, {withFileTypes: true}, (error, files) => {
        files.forEach(file => {
            if (file.isDirectory()) {
                const newDir = path.join(newPathOfFile, file.name)
                fs.mkdir(newDir, {recursive: true}, (error) => {
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


