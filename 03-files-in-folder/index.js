const fs = require('fs')
const path = require('path')
const {stat} = require("fs");
const {rejects} = require("assert");

fs.promises.readdir(path.join(__dirname, 'secret-folder'), {withFileTypes: true})
    .then(files => files.forEach(file => {
            if (!file.isDirectory()) {
                const filePath = path.join(__dirname, 'secret-folder', file.name)
                const fileExt = path.extname(filePath)
                const fileName = path.basename(filePath, fileExt)
                fs.promises
                    .stat(filePath)
                    .then(res => console.log(`${fileName} - ${fileExt.slice(1)} - ${+(res.size)}kb`))
            }
        }
    ))
    .catch(error =>
        console.log(error.message))

