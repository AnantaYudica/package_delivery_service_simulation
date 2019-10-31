
var _Mongodb = require('mongodb');
var mongodb_type = require('mongodb_type');

module.exports = class Mongodb
{
    constructor(dbConfig, config)
    {
        this.dbConfig = dbConfig;
        this.config = config;
        this.list = [];
        this.setter = {};
        this._primaryKey = "";
        this.instancePrimaryKey = undefined;
        this._columns = new Array(...Object.keys(config.columns));
        var keys = Object.keys(config.columns);
        const key_pk = this.config.primaryKey;
        if (typeof key_pk === 'string' || 
            (typeof key_pk === 'object' && key_pk instanceof String))
            this._primaryKey = key_pk;
        else 
        {
            this._primaryKey = '_id';
            keys.push('_id');
            if (this.dbConfig.primaryKey.instance.option === 'increment')
            {
                this.incrementPimaryKey = this.dbConfig.primaryKey.instance.start;
            }
        }

        for(let column of keys)
        {
            var column_type = config.columns[column].type;
            const column_default_type = config.columns[column].default_type;
            var column_db_type = undefined;
            if (column != '_id')
            {
                if (typeof dbConfig === 'object' &&
                    (typeof dbConfig.columns === 'object' && dbConfig instanceof Object))
                {
                    if (typeof dbConfig.columns[column] !== 'undefined')
                    {
                        column_db_type = dbConfig.columns[column].type;
                    }
                }
            }
            else
            {
                column_type = 'inheritance';
                column_db_type = dbConfig.primaryKey.type;
                column_default_type = 'mongodb.objectid';
            }

            if (column_type === 'inheritance')
            {
                if (typeof column_db_type === 'undefined' ||
                    (typeof column_db_type !== 'string' &&
                    !(typeof column_db_type === 'object' && column_db_type instanceof String)))
                    column_db_type = column_default_type;
                column_type = column_db_type;
            }
            this.setter[column] = this._setFunction(column_type);
        }

    }

    _instancePK()
    {
        if (this.dbConfig.primaryKey.instance.option === 'increment')
        {
            return this.incrementPimaryKey++;
        }
    }

    _setFunction(column_type)
    {
        if (column_type.toLowerCase() === 'mongodb.objectid')
        {
            return function(val) {
                return mongodb_type.isObjectId(val) ? val : 
                    mongodb_type.toObjectId(val);
            };
        }
        else if (column_type === 'integer')
        {
            return function(val){
                return mongodb_type.isInteger(val) ? val :
                    mongodb_type.toInteger(val);
            };
        }
        else if (column_type === 'string')
        {
            return function(val){
                return mongodb_type.isString(val) ? val : 
                    mongodb_type.toString(val);
            };
        }
        else if (column_type === 'float')
        {
            return function(val){
                return mongodb_type.isFloat(val) ? val :
                    mongodb_type.toFloat(val);
            };
        }
        else if (column_type === 'double')
        {
            return function(val){
                return mongodb_type.isDouble(val) ? val :
                    mongodb_type.toDouble(val);
            };
        }
        else if (column_type === 'boolean')
        {
            return function(val){
                return mongodb_type.isBoolean(val) ? val : 
                    mongodb_type.toBoolean(val);
            };
        }
        else if (column_type === 'date')
        {
            return function(val){
                return mongodb_type.isDate(val) ? val : 
                    mongodb_type.toDate(val)
            };
        }
        else if (column_type === 'timestamp')
        {
            return function(val){
                return mongodb_type.isTimestamp(val) ? val : 
                    mongodb_type.toTimestamp(val);
            };
        }
        else
            throw new Error("Error type column \""+ column +"\" not defined");
    }

    primaryKey()
    {
        return this._primaryKey;
    }

    columns()
    {
        return this._columns;
    }

    size()
    {
        return this.list.length;
    }

    get(row, col, as_return = undefined)
    {
        if (typeof as_return === 'undefined')
        {
            return this.list[row][(col == this.primaryKey()?'_id': col)];
        }
        else if (typeof as_return === 'string' ||
            (typeof as_return === 'object' && as_return instanceof String))
        {
            if (as_return == 'string')
            {
                return  mongodb_type.asString(this.list[row][(col == this.primaryKey()?'_id': col)]);
            }
            else if (as_return == 'number')
            {
                return  mongodb_type.asNumber(this.list[row][(col == this.primaryKey()?'_id': col)]);
            }
            else if (as_return == 'date')
            {
                return  mongodb_type.asDate(this.list[row][(col == this.primaryKey()?'_id': col)]);
            }
        }
    }

    set(row, col, value)
    {
        if (col == this.primaryKey()) 
            this.list[row]['_id'] = this.setter[col](value);
        else
            this.list[row][col] = this.setter[col](value);
    }
    
    insert(...objs)
    {
        var row;
        for (let obj of objs)
        {
            row = this.list.push(new Object()) - 1;
            for(let column of this.columns())
            {   
                this.set(row, column, obj[column]);
            }
            if (this.primaryKey() == '_id')
            {
                this.set(row, '_id', this._instancePK());
            }
        }
        return row + 1;
    }

};