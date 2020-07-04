const {aMessageWithResponse, aMessage }  = require('../helpers/prompts')
const FileReader = require('../helpers/fileReader');
const FileWriter = require('../helpers/fileWriter');
const { Worker } = require('worker_threads');
const worker = new Worker('./app/worker/readerWriter.js');

async function start()
{
    aMessage("Welcome to the Tab/Comma seperate validator")

    let filePath = await aMessageWithResponse("Where is the file located? ")
    let csvOrTab = await aMessageWithResponse("Is the file format CSV (comma-separated values) or TSV (tab-separated values)? ")
    let fieldCount = await aMessageWithResponse("How many fields should each record contain?")
   
    let aDataSet = {filePath ,csvOrTab ,fieldCount}
    worker.postMessage(aDataSet);
    worker.once('message', (res)=>{
        aMessage("Quitting Program")
        process.exit()
    }) 
}

module.exports = function main(){
    start();
}


