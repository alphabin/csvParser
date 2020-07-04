const readline = require('readline');
 

function aMessage(content)
{
    console.log("\n"+content+"\n");
}


async function aMessageWithResponse(content)
{
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

    return new Promise((suc,err)=>
    {
      return rl.question(content+'\n', (answer) => {
        rl.close();
        suc(answer) 
      });
    })
}

module.exports = { aMessageWithResponse, aMessage };