const csv = require('csvtojson');
const fs = require('fs');
const path = require('path');
const sleep = require("./../sleep").sleep;

const csv_config = {delimiter:[";"]};

const main = async function()
{
    var args = process.argv.slice(2);
    var base_dirname = path.dirname(process.argv[1]);

    var config_path = "";
    if (args.length > 0)
    {
        config_path = args[0];
    }

    if (path.isAbsolute(config_path))
    {
        base_dirname = path.dirname(config_path);
    }
    else
    {
        config_path = path.normalize(path.join(base_dirname, config_path));
    }


    if (path.extname(config_path).toLowerCase() != '.json')
    {
        base_dirname = config_path;
        config_path = path.join(config_path, "config.json");
    }

    const config = require(config_path);

    var table_config_path = base_dirname;

    if(typeof config.table_config_file == 'string' ||
        (typeof config.table_config_file == 'object' && config.table_config_file instanceof String))
    {
        if (path.isAbsolute(config.table_config_file))
        {
            table_config_path = config.table_config_file;
        }
        else
        {
            table_config_path = path.normalize(path.join(base_dirname, config.table_config_file));
        }
    }

    if (path.extname(table_config_path).toLowerCase() != '.json')
    {
        table_config_path = path.join(table_config_path, "table_config.json");
    }
    
    const table_config = require(table_config_path);

    var table_dir = base_dirname;

    if(typeof config.table_dir == 'string' ||
        (typeof config.table_dir == 'object' && config.table_dir instanceof String))
    {
        if (path.isAbsolute(config.table_dir))
        {
            table_dir = config.table_dir;
        }
        else
        {
            table_dir = path.normalize(path.join(base_dirname, config.table_dir));
        }
    }

    var db_config_dir;

    if (path.isAbsolute(config.db_config_dir))
    {
        db_config_dir = path.normalize(path.join(config.db_config_dir, db_driver));
    }
    else
    {
        db_config_dir = path.normalize(path.join(base_dirname, config.db_config_dir, config.db_driver));
    }

    var db_config_path = path.join(db_config_dir, "config.json");

    const db_config = require(db_config_path);

    var db_table_config_path = path.join(db_config_dir, "table_config.json");

    const db_table_config = require(db_table_config_path);

    const driver_name = config.db_driver.substring(0, config.db_driver.lastIndexOf("_driver"));

    const Driver = require(config.db_driver);
    const Record = require(driver_name + "_record");

    var driver = new Driver();

    await driver.connect(db_config.url, config.db_name, db_config.options);

    for (let elem_table_config of table_config)
    {
        const elem_filename = elem_table_config.filename;
        const elem_path = path.join(table_dir, elem_filename);
        const elem_name = elem_table_config.name;
        const elem_config = elem_table_config.config;

        fs.access(elem_path, function (err){
            if (err) throw new Error("cannot access : " + elem_path);
            csv(csv_config).fromFile(elem_path).then(function(list){
                var rec = new Record(db_config[elem_name], elem_config);
                for (let elem of list)
                {
                    rec.insert(elem);
                }
                driver.insert(elem_name, rec.list);
            });
        });
    }

    await sleep(100);
    driver.close();

};

main();
