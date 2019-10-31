
const MongodbRecord = require("./main");
const mongodb = require("mongodb");
const variable = require("./main_test.json");
const mongodb_type = require('mongodb_type');


const main = async function()
{
    return new Promise(function (resolve, reason){
        const tests = variable;
        for (let test of tests)
        {
            var config = require(test.config_file);
            var dbconfig = require(test.dbconfig_file);
            const table = test.table_name;
            var rec = new MongodbRecord(dbconfig.tables[table], config.tables[table]);
            const commands = test.commands;
            for (let command of commands)
            {
                const name = command.name;
                const param = command.param;
                var result = rec[name](...param);
                if (typeof command.result === 'object')
                {
                    if (typeof command.result.as === 'string' ||
                        (typeof command.result.as === 'object' && command.result.as instanceof String))
                    {
                        if (typeof command.result.as == 'number')
                        {
                            result = mongodb_type.asNumber(result);
                        }
                        else if(typeof command.result.as == 'string')
                        {
                            result = mongodb_type.asString(result);
                        }
                        else if (typeof command.result.as == 'date')
                        {
                            result = mongodb_type.asDate(result);
                        }
                        else
                        {
                            reason(new Error("error field result.as in command : " + JSON.stringify(command)));
                            return;
                        }
                        if (result != command.result.value)
                        {
                            reason(new Error("fail test value of command "+ JSON.stringify(command) +
                                " and return value \"" + result +"\""));
                        }
                    }
                    else 
                    {
                        reason(new Error("error field result.as in command : " + JSON.stringify(command)));
                        return;
                    }
                }
                else if (typeof command.result !== 'undefined' && result != command.result)
                {
                    reason(new Error("fail test value of command "+ JSON.stringify(command) +
                        " and return value \"" + result +"\""));
                }

            }
        }
        resolve();
    });
}

main().catch(function(err){console.log(err)});
