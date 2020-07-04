
//Used to read a file
const fs = require('fs')

//General Info:
//FileReader Class handles reading and validates the inputs and populates the arrays for later use
class FileReader{
    constructor() {
        //Path, Type, Fields variables will be set by the user of this class
        this.path = "";
        this.type = "";
        this.fields = 0;

        //Will be holdiong the raw array of the rows of the input file
        this.rawInputs = [];

        //This will rep the filterd list of the correct input rows
        this.correctInputs = [];

        //This will rep the filterd list of the wrong input rows
        this.wrongInputs = []; 

        //Will be used to parse tab style
        this.tabsSyntax = /\t/;
      }

    //Checks if the path of the file for this instance of the FileReader is correct
    async isValidPath(){
        return fs.existsSync(this.path)
    }

    //Checks if the type the file is in this instance of the FileReader is correct in either 'csv' or 'tsv'
    async isValidType(){
    
        switch(this.type.toLocaleLowerCase().trim())
        {
            case "csv":
            case "tsv":
                    return true;
  
            default:
                return false;
        }
    }

    //Checks if the field count is greater than zero
    async isValidFieldsCount()
    {
       if(this.fields > 0)
        {
            return true;
        }
        else
        {
            return false
        }
    }

    //After populating  this.path, this.type, this.fields we run this method to validate inputs and start the actual processing
    async startProcessing(){
        //Forces to gurantee the results by using await
        let fields = await this.isValidFieldsCount();
        let paths = await this.isValidPath();
        let type = await this.isValidType();

       //These all need to be true for us to parse the file
       if( fields &&  paths && type )
       {
        //Read and spilt into array using regex
        this.rawInputs = fs.readFileSync(this.path, 'utf-8').split(/\r\n|\n|\r/);
        
        //Once we have the rawInput array populated, we start the parsing
        return this.startParsing();
       }
       else
       {
        //This file is not meeting atleast one condition
        return false;
       }
    }

    //We validate an array of data form the file and populate the 
    async startParsing()
    {
       new Promise((succ,err)=>{
           let aType = this.type.toLocaleLowerCase().trim()
          switch(aType)
          {
           case 'tab':
           case 'tsv':
               //for tsv type 
               return succ(this.parseTab());
               
           case 'csv':
                 //for csv type 
               return succ(this.parseCsv());
              
       }}
       )
    }

    //Based on the type of file if csv or tsv we parse are resolve the promise
    async parse(fileData,splitCondition)
    {
       return new Promise((suc,fail)=>{
        //Skip the first row as it is the header
        for(var index = 1; index< fileData.length ;index++)
        {
            //Get the parsed row
            let aParsedRow = this.splitRow(fileData[index],splitCondition);
            //Make sure if the row has the same ammount of fields after the split
            if(aParsedRow.length == this.fields)
            {
                //If matches the field count then add to correct
                this.correctInputs.push(fileData[index]);
            }
            else
            {
                //If doesnt match the field count then add to wronginput
                this.wrongInputs.push(fileData[index]);
            }

        }
            ///Once complete with the array resolve the promise
            suc(true);
        })
    }

    //Spiter for a given row based on the condition
    splitRow(aRow,aCondition)
    {
        return aRow.split(aCondition)
    }
    
    //Handler for Tab type
    async parseTab()
    {
        //Pass in the regex for tabs
        this.parse(this.rawInputs,this.tabsSyntax )
    }

    //Handler for CSV Type
    async parseCsv()
    {
        //Pass in the comma
        this.parse(this.rawInputs,",")
    }
}

//Export the FileReader Class for use in other places in our app
module.exports = new FileReader();