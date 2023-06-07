const redis = require('redis');

const client = redis.createClient({
    port: 6379,
    host: '127.0.0.1'
});

(async () => {
    await client.connect();
})();

client.on('connect', () => {
    console.log('Redis Client Connected')
})

client.on('error', (err) => {
    console.log('Redis Error', err.message)
})

client.on('ready', () => {
    console.log('Redis ready to use')
})

client.on('end', () => {
    console.log('Disconnected Client Redis')
})

process.on('SIGINT', () => {
    client.quit();
})

module.exports = client;