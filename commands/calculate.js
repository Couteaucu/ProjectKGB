module.exports = {
    name: 'calculate',
    description: 'Calculate debuff time',
    aliases: ['formula', 'algorithim'],
    cooldown: 0,
    guildOnly: false,
    args: true,
    usage: '<upvote> <downvote>',
    execute(message, args) {
        const upvoteCount = parseInt(args[0]);
        const downvoteCount = parseInt(args[1]);

        if (isNaN(upvoteCount)) { //if arguments are missing
            message.channel.send("Missing arguments. !calculate <upvote> <downvote>");
            return;
        } else if (isNaN(downvoteCount)) {
            message.channel.send("Missing arguments. !calculate <upvote> <downvote>");
            return;
        }

        const debufftimehours = (formula(0, upvoteCount, downvoteCount) / 3600).toFixed(); //time in hours
        const debufftimedays = (debufftimehours / 24).toFixed(2);
        message.channel.send(`${debufftimedays} days (${debufftimehours} hours)`);
    },
};

function formula(currentDebuffTime, upvoteCount, downvoteCount) {
    const multiplier_time = 0.3;
    var voteratio = Math.pow(upvoteCount + 0.5, 2) - Math.pow(downvoteCount + 0.2, 2.25);
    if (voteratio < 0) { //who knows lol, hopefully this'll do something interesting in an edge case.
        voteratio = Math.sqrt(Math.abs(voteratio));
    }
    return currentDebuffTime + Math.round(((86400 * multiplier_time) * voteratio));
}