var redis = require("redis");
var util = require("util");
var CoreClient = require("./CoreClient.js");

function CoreManager() {
    this.clients = {};
    this.redis_client = redis.createClient(6379, "evedata.cloudapp.net");
    this.redis_client.auth("trasher03!", function (err, result) { if (err) { throw err; } });
    var that = this;


    this.redis_client.on("subscribe", function (channel, count) {
        console.log("subbed to: " + channel + " count: " + count + " id: " + that.id);
    });

    this.redis_client.on("message", function (channel, message) {
        console.log("spawning new client for id: " + message);
        that.clients[message] = new CoreClient(message);
    });

    this.redis_client.subscribe("connectionstream");
}

module.exports = CoreManager;