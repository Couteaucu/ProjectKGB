const debuffList = require('../debuffList.json');
module.exports = {
    name: 'forcecleanse',
    description: 'emergency action, only Heads of the Socialist Party may use and vote',
    cooldown: 0,
    guildOnly: true,
    args: true,
    usage: '<user>',
    execute(message, args, client) {
        const member = message.member;

        //required roles in server
        const role_WaifuHunter = member.guild.roles.cache.find(role => role.name === 'Waifu Hunter');
        const role_Head = member.guild.roles.cache.find(role => role.name === 'Head of the Socialist Party');

        //does the caller of the command have these roles
        const user_has_role_WaifuHunter = member.roles.cache.some(role => role.name === 'Waifu Hunter');
        const user_has_role_Head = member.roles.cache.some(role => role.name === 'Head of the Socialist Party');
        

        if (user_has_role_WaifuHunter || user_has_role_Head || member.id == message.guild.ownerID) {

            if (!message.mentions.users.size) {
                return message.reply('No cleanse target selected.');
            }

            const taggedUser = message.mentions.users.first();

            //Ask for a vote, add reaction
            const upvote = message.guild.emojis.cache.find(emoji => emoji.name === 'upvote');
            const downvote = message.guild.emojis.cache.find(emoji => emoji.name === 'downvote');
            //console.log(upvote.name);

            const filter = (reaction, user) => {
                var checkUser = message.guild.member(user.id); //this was a wild ride to get
                var isAuthorized = checkUser.roles.cache.some(role => role.name === 'Head of the Socialist Party');
                return ['upvote', 'downvote'].includes(reaction.emoji.name) && isAuthorized;
            };

            //const vote_time = 3600000; //1 hour
            //const vote_time = 900000; //15 minutes
            const vote_time = 180000; //3 minutes
            //const vote_time = 3600;
            const requiredVotes = 2;

            message.channel.send(`Forcecleanse ${taggedUser.username}? ${requiredVotes} needed to pass. (Vote resolves in ${vote_time / 1000} seconds)`).then(async sentReact => {
                const pinFunction = async () => {
                    try{
                        const pinMessage = await sentReact.pin();
                        const nextMessage = await message.channel.messages.fetch({after:pinMessage.id});
                        await nextMessage.first().delete();
                    }catch{
                        console.log('Error in pinning message');
                    }
                }
                pinFunction();
                
                for (emoji of [upvote, downvote]) await sentReact.react(emoji);
                //for (emoji of [upvote]) await sentReact.react(emoji);
                //sentReact.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
                sentReact.awaitReactions(filter, { maxUsers: 2, time: vote_time }) //only need two users since the BOT doesnt count with this filter on
                    .then(collected => {
                        let upvoteCount = parseInt(collected.filter(u => u.emoji.name === 'upvote').map(u => u.count), 10) - 1;
                        let downvoteCount = parseInt(collected.filter(u => u.emoji.name === 'downvote').map(u => u.count), 10) - 1;

                        if (isNaN(upvoteCount)) { //for some reason if a user doesnt upvote, it is not registered
                            upvoteCount = 0;
                        } else if (isNaN(downvoteCount)) {
                            downvoteCount = 0;
                        }

                        if (downvoteCount >= upvoteCount) {
                            message.channel.send(`The council has voted to not esuna ${taggedUser.username} with a vote of ${upvoteCount}-${downvoteCount}`);
                        } else {
                            if (upvoteCount < requiredVotes) {
                                message.channel.send(`The force cleanse on ${taggedUser.username} failed. Only ${upvoteCount} upvotes out of ${requiredVotes} were made.`);
                            } else {
                                //Apply the esuna
                                const esunaTarget = message.mentions.members.first();

                                for (var debuff in debuffList) {
                                    if (esunaTarget.roles.cache.some(role => role.name === debuffList[debuff])) {
                                        const debuffRole = message.guild.roles.cache.find(role => role.name === debuffList[debuff]);
                                        esunaTarget.roles.remove(debuffRole);
                                        debuffTimerRemove(client, debuffTarget, debuff);
                                        message.channel.send(`${taggedUser.username} has been force cleanse'd from ${debuffRole.name} with a vote of ${upvoteCount}-${downvoteCount}`);
                                    }
                                }
                            }
                        }
                        sentReact.unpin().catch(() => console.log('error unpinning'));
                        //this.cooldown = 64800;
                    })
                    .catch(collected => {
                        console.log(collected);
                        console.log('Something fucked up')
                    });
            });

        } else {
            const debuffTarget = message.member;
            const debuffRole = message.guild.roles.cache.find(role => role.name === "Debuff: Gay");
            //message.member.roles.add(debuffRole);
            return message.reply('You are not authorized to use this command.');
        }

    },
};

function debuffTimerRemove(client, user, debuff) {
    const debufftimers = client.debufftimers;
    const target = user.user.id;

    delete debufftimers[target][debuff];

    fs.writeFile('./debuffTime.json', JSON.stringify(debufftimers, null, 4), err => {
        if (err) return console.log('debufftimerremove failed');
    });
}