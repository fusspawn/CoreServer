var redis = require("redis");
var util = require("util");

function CoreClient(id) {

    this.id = id;
    this.connection_ready = false;
    this.message_count = 0;

    this.redis_client = redis.createClient(6379, "evedata.cloudapp.net");
    this.redis_client.auth("trasher03!", function (err, result) { if (err) { throw err; } });


    this.redis_out_client = redis.createClient(6379, "evedata.cloudapp.net");
    this.redis_out_client.auth("trasher03!", function (err, result) { if (err) { throw err; } });


    var that = this;
    
    this.redis_client.on("subscribe", function (channel, count) {
        console.log("subbed to: " + channel + " count: " + count + " id: " + that.id);            
    });

    this.redis_client.on("message", function (channel, message) {

        console.log("got message for connection id: "
             + that.id + " on channel: " + channel
             + " message: " + util.inspect(message));

        that.redis_out_client.rpush("messagequeue." + that.id + ".out", message);
    });

    this.redis_client.subscribe("messagequeue." + this.id + ".in");
}

module.exports = CoreClient;