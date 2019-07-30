const redis = require('redis');
const REDISHOST = process.env.REDISHOST || '34.66.216.52';
const REDISPORT = process.env.REDISPORT || 6379;
console.log(process.env.REDISCREDENTIALS);
const client = redis.createClient(REDISPORT, REDISHOST, {password: process.env.REDISCREDENTIALS || 'Devenew1.,A'});

//const {promisify} = require('util');
//const getAsync = promisify(client.get).bind(client);
async function init() {
    return new Promise((resolve, reject) => {
        client.on('connect', () => {
            console.error('OK:REDIS:');
            resolve(true);
        });
        client.on('error', (err) => {
            console.error('ERR:REDIS:', err);
            reject(err);
        });

    });
}


async function set(key, value) {
    return new Promise((resolve, reject) => {
        let time1 = new Date();
        client.set(key, value, (err, data) => {
            if (err) {
                reject(err);
                return;
            }
            let time2 = new Date();
            console.log(`Redis Get in ${time2 - time1} ms`);
            resolve(data);
        });
    });
}

async function get(key) {
    
    return new Promise((resolve, reject) => {
        let time1 = new Date();
        client.get(key, (err, data) => {
            if (err) {
                reject(err);
                return;
            }
            let time2 = new Date();
            console.log(`Redis Get in ${time2 - time1} ms`);
            resolve(data);
        });
    });
}

module.exports = {
    get,
    set,
    init,
    client
}