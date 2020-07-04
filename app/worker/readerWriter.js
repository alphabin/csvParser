 
const { parentPort } = require('worker_threads'); 
const {aMessage}  = require('../helpers/prompts')
 
const FileReader = require('../helpers/fileReader');
const FileWriter = require('../helpers/fileWriter');

parentPort.on('message', async (aDataSet) => {
    
    let aFileReader = FileReader;
    let aFileWriter = FileWriter;
    aFileReader.path = aDataSet.filePath;
    aFileReader.type = aDataSet.csvOrTab;
    aFileReader.fields = aDataSet.fieldCount;

    aFileReader.startProcessing().then(async(res)=>{
        let error = false;

        let fields = await aFileReader.isValidFieldsCount();
        let paths = await aFileReader.isValidPath();
        let type = await aFileReader.isValidType();
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
       
       
        if(!error)
        {
            aFileWriter.WriteLoad(aFileReader.correctInputs,aFileReader.wrongInputs,aFileReader.path).then((res)=>{
                aMessage(res);
                parentPort.postMessage(error)  
            })
            
        }
         else
            parentPort.postMessage(error)            

    })

})