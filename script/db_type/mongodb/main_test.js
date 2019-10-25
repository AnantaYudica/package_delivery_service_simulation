
const MongodbType = require("./main");
const mongodb = require("mongodb");
const variable = require("./main_test.json");

const cast = function(arr, config)
{
    var res = new Array();
    for(let i = 0; i < arr.length; ++i)
    {
        const type = config[i];
        const elem = arr[i];
        if (type === 'number' || type === 'string' || type === 'boolean')
            res.push(elem);
        else if (type === 'date')
            res.push(new Date(elem));
        else if (type === 'mongodb.Int32')
            res.push(new mongodb.Int32(elem));
        else if (type === 'mongodb.Double')
            res.push(new mongodb.Double(elem));
        else if (type === 'mongodb.Timestamp')
            res.push(mongodb.Timestamp.fromNumber(elem));
    }
    return res;
}

const main = async function()
{
    return new Promise(function (resolve, reason){
        const keys = Object.keys(variable);
        for(let key of keys)
        {
            const tests = variable[key];
            for (let test of tests)
            {
                var result = "";
                var retval = MongodbType[key](...cast(test.param, test.type_param));
                if (typeof test.result === 'string')
                {
                    if (typeof retval === 'number' || 
                        (typeof retval === 'object' && retval instanceof Number))
                        result = new String(retval);
                    else
                        result = MongodbType.asString(retval);
                }
                else
                {
                    reason(new Error("Result undefined"));
                }
                if (result != test.result)
                {
                    reason(new Error("fail test "+ key +" with "+ JSON.stringify(test) +" as configure "+
                        "and return value \"" + result +"\""));
                }
            }
        }
        resolve();
    });
}

main().catch(function(err){console.log(err)});

