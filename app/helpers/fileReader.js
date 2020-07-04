const fs = require('fs')

class FileReader{
    constructor() {
        this.path = "";
        this.type = "";
        this.fields = 0;
        this.rawInputs = [];
        this.correctInputs = [];
        this.wrongInputs = []; 
        this.tabsSyntax = /\t/;
      }

    async isValidPath(){
        return fs.existsSync(this.path)
    }

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

    async startProcessing(){
        let fields = await this.isValidFieldsCount();
        let paths = await this.isValidPath();
        let type = await this.isValidType();

       if( fields &&  paths && type )
       {
        //Read 
        this.rawInputs = fs.readFileSync(this.path, 'utf-8').split(/\r\n|\n|\r/);
        //Start Parse
        return this.startParsing(this.rawInputs);
       }
       else
       {
        return false;
       }
    }

    async startParsing(filedata)
    {
       new Promise((succ,err)=>{
           let aType = this.type.toLocaleLowerCase().trim()
          switch(aType)
          {
           case 'tab':
           case 'tsv':
               return succ(this.parseTab());
               
           case 'csv':
               return succ(this.parseCsv());
              
       }}
       )
    }

    async parse(fileData,splitCondition)
    {
       return new Promise((suc,fail)=>{
        for(var index = 1; index< fileData.length ;index++)
        {
            let aParsedRow = this.splitRow(fileData[index],splitCondition);
            if(aParsedRow.length == this.fields)
            {
                this.correctInputs.push(fileData[index]);
            }
            else
            {
                this.wrongInputs.push(fileData[index]);
            }

        }
            suc(true);
        })
    }

    splitRow(aRow,aCondition)
    {
        return aRow.split(aCondition)
    }
    
    async parseTab()
    {
       
        this.parse(this.rawInputs,this.tabsSyntax )
    }

    async parseCsv()
    {
        this.parse(this.rawInputs,",")
    }
}

module.exports = new FileReader();