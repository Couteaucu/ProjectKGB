const debuffList = require('../debuffList.json');
/*const fs = require('fs');
const fileName = '../debuffTime.json';
const debuffTime = require(fileName);*/
//console.log(debuffList);
module.exports = {
    name: 'debuff',
    description: 'assign a role that is a debuff',
    cooldown: 1,
    guildOnly: true,
    args: true,
    usage: '<debuff> <user>',
    execute(message, args) {
        const debuff = args[0].toLowerCase();

        if (debuff == "list") {
            var debuffString = "";
            for (var debuffid in debuffList) {
                debuffString = debuffString.concat(debuffid, "\n");
            }
            message.channel.send(debuffString);
            return;
        } else if (!message.mentions.users.size) {
            return message.reply('YOU CANT DEBUFF AIR, select a target');
        }

        if (debuff in debuffList) {
            const taggedUser = message.mentions.users.first();

            //Ask for a vote, add reaction
            const upvote = message.guild.emojis.cache.find(emoji => emoji.name === 'upvote');
            const downvote = message.guild.emojis.cache.find(emoji => emoji.name === 'downvote');
            //console.log(upvote.name);
            const filter = (reaction) => {
                return ['upvote', 'downvote'].includes(reaction.emoji.name);
                //return reaction.emoji.name === downvote.name;
            };

            //const vote_time = 3600000; //1 hour
            const vote_time = 900000; //15 minutes
            const requiredVotes = 3;
            message.channel.send(`Give ${taggedUser.username} the \'${debuff}\' debuff? ${requiredVotes} needed to pass. (Vote resolves in ${vote_time / 1000} seconds)`).then(async sentReact => {
                for (emoji of [upvote, downvote]) await sentReact.react(emoji);

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
                
                //for (emoji of [upvote]) await sentReact.react(emoji);
                //sentReact.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
                sentReact.awaitReactions(filter, { maxUsers: 7, time: vote_time })
                    .then(collected => {
                        let upvoteCount = parseInt(collected.filter(u => u.emoji.name === 'upvote').map(u => u.count), 10) - 1;
                        let downvoteCount = parseInt(collected.filter(u => u.emoji.name === 'downvote').map(u => u.count), 10) - 1;

                        if (isNaN(upvoteCount)) { //for some reason if a user doesnt upvote, it is not registered
                            upvoteCount = 0;
                        } else if (isNaN(downvoteCount)) {
                            downvoteCount = 0;
                        }
                        //console.log(downvoteCount);
                        //console.log(upvoteCount);
                        //console.log(downvoteCount>upvoteCount);

                        if (downvoteCount >= upvoteCount) {
                            message.channel.send(`The council has voted to spare ${taggedUser.username} with a vote of ${upvoteCount}-${downvoteCount}`);
                        } else {
                            console.log(upvoteCount);
                            if (upvoteCount < requiredVotes) {
                                message.channel.send(`The vote to debuff ${taggedUser.username} with ${debuffList[debuff]} failed with Only ${upvoteCount} upvotes out of ${requiredVotes}.`);
                            } else {
                                //Apply the debuff
                                const debuffRole = message.guild.roles.cache.find(role => role.name === debuffList[debuff]);
                                const debuffTarget = message.mentions.members.first();

                                if (debuffTarget.roles.cache.some(role => role.name !== debuffList[debuff])) {
                                    debuffTarget.roles.add(debuffRole);
                                    //add them to time list
                                }
                                //time debuff
                                switch (upvoteCount) {
                                    case 3:
                                    case 4:
                                    case 5:
                                    default:
                                    /*fs.writeFile(fileName, JSON.stringify(debuffTime), function writeJSON(err) {
                                        if (err) return console.log(err);
                                        console.log(JSON.stringify(debuffTime, null, 2));
                                        console.log('writing to ' + fileName);
                                      });*/
                                }

                                message.channel.send(`${taggedUser.username} has been given ${debuffRole.name} with a vote of ${upvoteCount}-${downvoteCount}`);
                            }
                        }

                        sentReact.unpin().catch(() => console.log('error unpinning'));
                        this.cooldown = 64800;
                    })
                    .catch(collected => {
                        console.log(collected);
                        console.log('Something fucked up')
                    });
            });
        } else {
            return message.reply('That is not a valid debuff, remember <debuff> <user>, use !debuff list');
        }
    },
};