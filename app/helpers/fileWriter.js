var fs = require('fs');
var path = require('path');

class FileWriter {
    constructor() {
        this.correctRows = []
        this.wrongRows = []
        this.aPath = "";
    }

    async WriteLoad(correctRows, badRows, aPath = "./.txt") {
       return new Promise((suc, err) => {
            this.correctRows = correctRows;
            this.wrongRows = badRows;
            this.path = aPath;
            if (!this.path.includes(".txt")) {
                this.path += ".txt"
            }
            this.writeWrong().then((res1) => this.writeCorrect().then((res2) => {
                suc(res1 + res2);
            }))
        }
        )


    }

    async writeWrong() {

        if (this.wrongRows.length > 0) {
            let fPath = path.resolve(this.path.replace(".txt", "Bad.txt"));
            return this.doWrite(this.wrongRows, fPath);
        }
        else {
            return false;
        }

    }

    async writeCorrect() {
        if (this.correctRows.length > 0) {
            let fPath = path.resolve(this.path.replace(".txt", "Correct.txt"));
            return this.doWrite(this.correctRows, fPath);
        }
        else {
            return false;
        }
    }

    async doWrite(data, aPath) {
        return new Promise((suc, fail) => {

            if (data.length > 0) {

                var file = fs.createWriteStream(aPath);
                data.map(row => {
                    file.write(row + "\r\n")
                })
                file.end();

                return suc("---->File Written:" + aPath + "\n")
            }
            else {
                suc("")
            }
        })
    }


}

module.exports = new FileWriter();