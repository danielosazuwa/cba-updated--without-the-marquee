const { v4: uuidv4 } = require('uuid');
const Chance = require('chance');

module.exports = class UtilityFeature{
    static generateUniqueValue = (length = 35, num = false, prefix = null) => {
        const pool = num
            ? '0123456789'
            : 'abcdefghijklmnopqrstuvwxyz1234567890';
        const chance = new Chance();
        const uniqueValue = chance.string({ length, pool });
        return prefix ? `${prefix}_${uniqueValue}` : uniqueValue;
    };
}