var fs = require('fs');
var path = require('path');


//General Info:
//FileWriter Class handles writing of the parsed data
class FileWriter {
    constructor() {
        //Keep an internal list of what we will write out to a file
        this.correctRows = []
        this.wrongRows = []
        //Path of the original document, this where we will place the new files
        this.aPath = "";
    }

    //Load the data to start the writing process
    async WriteLoad(correctRows, badRows, aPath = "./.txt") {
       return new Promise((suc, err) => {
            this.correctRows = correctRows;
            this.wrongRows = badRows;
            this.path = aPath;
            //If the file is not a txt type we will make it that way
            if (!this.path.includes(".txt")) {
                this.path += ".txt"
            }
            //Promise chain to handle the writing of data
            this.writeWrong().then((res1) => this.writeCorrect().then((res2) => {
                suc(res1 + res2);
            }))
        }
        )


    }

    //Method responsible for writing the wrong rows
    async writeWrong() {

        //We only write if there is actually wrong rows
        if (this.wrongRows.length > 0) {
            let fPath = path.resolve(this.path.replace(".txt", "Bad.txt"));
            return this.doWrite(this.wrongRows, fPath);
        }
        else {
            return false;
        }

    }
   
    //Method responsible for writing the correct rows
    async writeCorrect() {
         //We only write if there is actually correct rows
        if (this.correctRows.length > 0) {
            let fPath = path.resolve(this.path.replace(".txt", "Correct.txt"));
            return this.doWrite(this.correctRows, fPath);
        }
        else {
            return false;
        }
    }

    //Does the implementation of writing the data array as a stream
    async doWrite(data, aPath) {
        return new Promise((suc, fail) => {
            //We only write if the data has entries
            if (data.length > 0) {

                var file = fs.createWriteStream(aPath);
                data.map(row => {
                    file.write(row + "\r\n")
                })
                file.end();
                //Return for the console.log to say what and where the file was written
                return suc("---->File Written:" + aPath + "\n")
            }
            else {
                suc("")
            }
        })
    }


}

//make the reader available
module.exports = new FileWriter();