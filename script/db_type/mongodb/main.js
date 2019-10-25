
var _Mongodb = require('mongodb');

module.exports = class Mongodb
{
    static toInteger(value)
    {
        if (typeof value === 'number' ||
            (typeof value === 'object' && value instanceof Number))
            return new _Mongodb.Int32(value);
        else if (typeof value === 'string' || 
            (typeof value === 'object' && value instanceof String))
            return new _Mongodb.Int32(Number.parseInt(value));
    }

    static toString(value)
    {
        if (typeof value === 'number' ||
            (typeof value === 'object' && value instanceof Number))
            return new String(value);
        else if (typeof value === 'boolean' ||
            (typeof value === 'object' && value instanceof Boolean))
            return new String(value);
        else if (typeof value === 'string' || 
            (typeof value === 'object' && value instanceof String))
            return new String(value);
        else if (typeof value === 'object' && value instanceof Date)
            return new String(value.toDateString());
    }

    static toFloat(value)
    {
        return this.toDouble(value);
    }

    static toDouble(value)
    {
        if (typeof value === 'number' || 
            (typeof value === 'object' && value instanceof Number))
            return new _Mongodb.Double(value);
        else if (typeof value === 'string' || 
            (typeof value === 'object' && value instanceof String))
            return new _Mongodb.Double(Number.parseFloat(value));
    }

    static toBoolean(value)
    {
        if (typeof value === 'number' || 
            (typeof value === 'object' && value instanceof Number))
            return new Boolean(value);
        else if (typeof value === 'string' || 
            (typeof value === 'object' && value instanceof String))
            return new Boolean(value);
    }

    static toDate(value)
    {
        if (typeof value === 'number' ||
            (typeof value === 'object' && value instanceof Number))
            return new Date(value);
        else if (typeof value === 'string' || 
            (typeof value === 'object' && value instanceof String))
            return new Date(value);
        else if (typeof value === 'object' && value instanceof Date)
            return new Date(value);
    }

    static toTimestamp(value)
    {
        if (typeof value === 'number' ||
            (typeof value === 'object' && value instanceof Number))
            return _Mongodb.Timestamp.fromNumber(value);
        else if (typeof value === 'string' || 
            (typeof value === 'object' && value instanceof String))
            return _Mongodb.Timestamp.fromString(value);
        else if (typeof value === 'object' && value instanceof Date)
            return _Mongodb.Timestamp.fromNumber(value.getTime());
    }

    static asString(value, def = "")
    {
        if (typeof value === 'object' && value instanceof _Mongodb.Int32)
            return new String(value.valueOf());
        else if (typeof value === 'string' || 
            (typeof value === 'object' && value instanceof String))
            return new String(value);
        else if (typeof value === 'object' && value instanceof _Mongodb.Double)
            return new String(value.valueOf());
        else if (typeof value === 'boolean' || 
            (typeof value === 'object' && value instanceof Boolean))
            return new String(value);
        else if (typeof value === 'object' && value instanceof Date)
            return new String(value.toDateString());
        else if (typeof value === 'object' && value instanceof _Mongodb.Timestamp)
            return new String(value.toString());
        return def;
    }

    static asNumber(value, def = 0)
    {
        if (typeof value === 'object' && value instanceof _Mongodb.Int32)
            return new Number(value.valueOf());
        else if (typeof value === 'string' || 
            (typeof value === 'object' && value instanceof String))
            return new Number(Number.parseInt(value));
        else if (typeof value === 'object' && value instanceof _Mongodb.Double)
            return new Number(value.valueOf());
        else if (typeof value === 'boolean' || 
            (typeof value === 'object' && value instanceof Boolean))
            return new Number(value);
        else if (typeof value === 'object' && value instanceof Date)
            return new Number(value.getTime());
        else if (typeof value === 'object' && value instanceof _Mongodb.Timestamp)
            return new Number(value.toNumber());
        return def;
    }

    static asDate(value, def = new Date())
    {
        if (typeof value === 'object' && value instanceof _Mongodb.Int32)
            return new Date(value.valueOf());
        else if (typeof value === 'string' || 
            (typeof value === 'object' && value instanceof String))
            return new Date(value);
        else if (typeof value === 'object' && value instanceof Date)
            return new Date(value);
        else if (typeof value === 'object' && value instanceof _Mongodb.Timestamp)
            return new Date(value.toNumber());
        return def;
    }

    static isInteger(value)
    {
        return typeof value === 'object' && value instanceof _Mongodb.Int32;
    }

    static isString(value)
    {
        return typeof value === 'string' || 
            (typeof value === 'object' && value instanceof String);
    }

    static isFloat(value)
    {
        return this.isDouble(value);
    }

    static isDouble(value)
    {
        return typeof value === 'object' && value instanceof _Mongodb.Double;
    }

    static isBoolean(value)
    {
        return typeof value === 'boolean' || 
            (typeof value === 'object' && value instanceof Boolean)
    }

    static isDate(value)
    {
        return typeof value === 'object' && value instanceof Date;
    }

    static isTimestamp(value)
    {
        return typeof value === 'object' && value instanceof _Mongodb.Timestamp;
    }
};