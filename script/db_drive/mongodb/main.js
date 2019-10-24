const sleep = require("./../../sleep").sleep;

var MongoClient = require('mongodb').MongoClient;

module.exports = class Mongodb
{
    constructor()
    {
        this.is_connect = false;
        this.dbo = undefined;
        this.db = undefined;
        this.url = "";
        this.name = "";
        this.options = "";
        this.process_count = 0;
        this.is_process_connect = false;
    }
    async connect(url, name, options)
    {
        if (this.is_open) close();
        this.is_process_connect = true;
        var callback = function (err, result)
        {
            new Promise(function(resolve, reject){
                if (err) reject(err);
                resolve();
            }).catch(function(err) {
                this.is_process_connect = false;
                throw err;
            }.bind(this)).then(function(){
                this.db = result;
                this.dbo = result.db(name);
                this.url = url;
                this.name = name;
                this.options = options;
                this.is_connect = true;
                this.is_process_connect = false;
            }.bind(this));
        }
        MongoClient.connect(url, options, callback.bind(this));
        while(this.is_process_connect) await sleep(100);
    }
    async close()
    {
        while(this.process_count !== 0 &&
            !this.is_process_connect) await sleep(100);
        if (this.db !== undefined) this.db.close();
        this.is_connect = false;
        this.db = undefined;
        this.dbo = undefined;
        this.url = "";
        this.name = "";
        this.options = "";
        this.process_count = 0;
        this.is_process_connect = false;
    }
    async insert(table, value, callback = function(err, res){
        if (err) throw err;
    })
    {
        if (!Array.isArray(value))
            return this.insert(table, [value]);
        if (!this.is_connect) throw new Error("No connection to database!");
        this.process_count++;
        var col = this.dbo.collection(table);
        col.insertMany(value, function(err, res) {
            callback(err, res);
            this.process_count--;
        }.bind(this));
    }
};
