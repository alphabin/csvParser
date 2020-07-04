//General Info:
//App Runner is the controller interface for our software, it dispatches a message to the worker to start processing. 
//It creates a worker to handle the processing just incase this application is used as  a multi threaded API. 
//The worker can be used to create a worker pool if this need to be extended 

//Messaging functions that will server as the way the app will display messages and get inputs
const {aMessageWithResponse, aMessage }  = require('../helpers/prompts')

//Worker thead we utilize in nodeframe work for performance and non blocking of the main thread
const { Worker } = require('worker_threads');

//Tell the worker where the worker js file is locates
const worker = new Worker('./app/worker/readerWriter.js');

//Start point of the app logic
async function start()
{
    aMessage("Welcome to the Tab/Comma seperate validator")

    //Async with promises resolving the inputs
    let filePath = await aMessageWithResponse("Where is the file located? ")
    let csvOrTab = await aMessageWithResponse("Is the file format CSV (comma-separated values) or TSV (tab-separated values)? ")
    let fieldCount = await aMessageWithResponse("How many fields should each record contain?")
   
    //Get a Object ready to pass to the worker with the inputs
    let aDataSet = {filePath ,csvOrTab ,fieldCount}
    
    //Send to the worker to process the input info
    worker.postMessage(aDataSet);

    //When the worker is complete it will send a message
    worker.once('message', (res)=>{
        aMessage("Quitting Program")
        //Exits the runtime of the node app
        process.exit()
    }) 
}

//We expose the Main fucntion to the index to stat the app
module.exports = function main(){
    start();
}


