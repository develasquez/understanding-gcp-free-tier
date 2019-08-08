var express = require('express');
var router = express.Router();
var downloader = require('../controllers/download');
const { PubSub } = require(`@google-cloud/pubsub`);
var redis = require('../controllers/redis');
redis.init();

const pubsub = new PubSub({});
function sendToPubsub(data) {
    const dataBuffer = Buffer.from(data);
    const topicName = 'cache-mp3-file';
    pubsub.topic(topicName).publish(dataBuffer);
}

router.get('/', function (req, res) {
    var name = req.query.name;
    var url = req.query.url;

    redis.get(name).then((data) => {
        console.log("redis:data", data);
        if (data) {
            res.send(JSON.parse(data));
        } else {
            downloader.getUrl(url).then(function (url) {
                var result = {
                    url: url,
                    name: name
                };
                sendToPubsub(JSON.stringify(result));
                res.send(result);
            });
        }
    });
});

module.exports = router;