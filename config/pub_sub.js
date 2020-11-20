const redis = require('redis');

function subscribe(topic, callback) {
    // const TOPIC = topic;
    const subscriber = redis.createClient(6379, 'localhost');
    subscriber.on('error', (error)=>{
        console.error(error);
        subscriber.unsubscribe();
    });
    subscriber.on('message', callback);
    subscriber.on('end', ()=>{
        subscriber.unsubscribe()
            .then(result=>{
                console.log(`one client is closed`);
            })
            .catch(error=>console.error(error));

    })
    subscriber.subscribe(topic);
}

function publish(topic, data) {
    console.log(`topic:${topic}, data: ${data}`);
    // const TOPIC = topic;
    const publisher = redis.createClient(6379, 'localhost');
    publisher.publish(topic, data);
}

module.exports = {
    subscribe : subscribe,
    publish : publish
}