 
const { parentPort } = require('worker_threads'); 

//Message class
const {aMessage}  = require('../helpers/prompts')

//Our main utility classes
const FileReader = require('../helpers/fileReader');
const FileWriter = require('../helpers/fileWriter');

//When a message is sent fromt the main thread we start processing
parentPort.on('message', async (aDataSet) => {
    
    //Intialize the read writers
    let aFileReader = FileReader;
    let aFileWriter = FileWriter;

    //Populate the reader, and unwrap 
    aFileReader.path = aDataSet.filePath;
    aFileReader.type = aDataSet.csvOrTab;
    aFileReader.fields = aDataSet.fieldCount;

    //Start Processing the reader
    aFileReader.startProcessing().then(async(res)=>{

        //Once the reader is done processing the reading
        let error = false;

        //Get errors that we faced in pocessing
        let fields = await aFileReader.isValidFieldsCount();
        let paths = await aFileReader.isValidPath();
        let type = await aFileReader.isValidType();

        //Print the erros and set flag to signify the error flag to not write
        if(!paths)
        {
            aMessage("**Invalid Path**");
            error = true;
        }
        
        if(!type){
            aMessage("**Invalid Type of Doc**");
            error = true;
        }

        if(!fields)
        {
            aMessage("**Invalid Fields Count**");
            error = true;
        }
       
       
        //If no errors
        if(!error)
        {
            //Load the writerClass
            aFileWriter.WriteLoad(aFileReader.correctInputs,aFileReader.wrongInputs,aFileReader.path).then((res)=>{
                //Print the paths of the files
                aMessage(res);
                //Send a message to main thread to say we are done
                parentPort.postMessage(error)  
            })
            
        }
         else
         {
            //Send a message to main thread to say we are done
            parentPort.postMessage(error)            
         }

    })

})