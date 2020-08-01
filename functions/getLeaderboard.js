const client = require('../index.js').client;

module.exports = {
    getLeaderboard() {
        const messageID = 736443329717469254; //bootleg workaround only works in ASG
        const textChannels = client.channels.filter((channel) => channel.type === 'text');
        return textChannels;
    },
};