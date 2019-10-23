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
        this.is_process = false;
    }
    async connect(url, name, options)
    {
        if (this.is_open) close();
        this.is_process = true;
        var callback = function (err, result)
        {
            new Promise(function(resolve, reject){
                if (err) reject(err);
                resolve(result, result.db(name));
            }).catch(function(err) {
                console.log(err);
                this.is_process = false;
            }.bind(this)).then(function(db, dbo){
                if (db === undefined || dbo === undefined) return;
                this.db = db;
                this.dbo = dbo;
                this.url = url;
                this.name = name;
                this.options = options;
                this.is_process = false;
                this.is_connect = true;
            }.bind(this));
        }
        MongoClient.connect(url, options, callback.bind(this));
        while(this.is_process) await sleep(100);
    }
    close()
    {
        if (this.db !== undefined) this.db.close();
        this.is_connect = false;
        this.db = undefined;
        this.dbo = undefined;
        this.url = "";
        this.name = "";
        this.options = "";
        this.is_process = false;
    }
};
