
const readline = require('readline');

//Simple message no input
function aMessage(content)
{
    console.log("\n"+content+"\n");
}


//Message with input and return input
async function aMessageWithResponse(content)
{
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

    return new Promise((suc,err)=>
    {
      return rl.question("\n"+content+'\n', (answer) => {
        rl.close();
        suc(answer) 
      });
    })
}

//exports these helper functions
module.exports = { aMessageWithResponse, aMessage };