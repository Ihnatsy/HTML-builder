const fs = require('fs')
const path = require('path')
const {stdin, stdout} = process
const output = fs.createWriteStream(path.join(__dirname, 'textFile.txt'));

stdout.write('Здравствуйте!!!\n')
stdout.write('Вы можете ввести текст\n')
stdin.on('data', data => {
    if (data.toString().trim() === 'exit') {
        process.exit();
    }
    output.write(data);
    stdout.write('Вы можете ввести ещё больше текста!!!\n')
});

process.on('exit', () => stdout.write('Спасибо! До свидания))'));
process.on("SIGINT", () => process.exit());