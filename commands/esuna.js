const debuffList = require('../debuffList.json');
module.exports = {
	name: 'esuna',
	description: 'clear one random debuff',
    cooldown: 1,
    guildOnly: true,
    args: true,
    usage: '<user>',
	execute (message, args) {
        if (!message.mentions.users.size) {
            return message.reply('YOU CANT CURE AIR, select a target');
        }
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
		const requiredVotes = 5;
        message.channel.send(`Esuna ${taggedUser.username}? ${requiredVotes} needed to pass. (Vote resolves in ${vote_time/1000} seconds)`).then(async sentReact => {
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
            sentReact.awaitReactions(filter, {maxUsers: 9, time: vote_time})
                    .then(collected =>{
                        let upvoteCount = parseInt(collected.filter(u=> u.emoji.name === 'upvote').map(u => u.count), 10) - 1;
                        let downvoteCount = parseInt(collected.filter(u=> u.emoji.name === 'downvote').map(u => u.count),10) - 1;

                        if(isNaN(upvoteCount)){ //for some reason if a user doesnt upvote, it is not registered
                            upvoteCount = 0;
                        }else if(isNaN(downvoteCount)){
                            downvoteCount = 0;
                        }
                        //console.log(downvoteCount);
                        //console.log(upvoteCount);
                        //console.log(downvoteCount>upvoteCount);
                        
                         if(downvoteCount >= upvoteCount){
                             message.channel.send(`The council has voted to not esuna ${taggedUser.username} with a vote of ${upvoteCount}-${downvoteCount}`);
                         }else{
                            console.log(upvoteCount);
                            if(upvoteCount < requiredVotes){
                                message.channel.send(`The esuna on ${taggedUser.username} failed. Only ${upvoteCount} upvotes out of ${requiredVotes} were made.`);
                            }else{
								//Apply the esuna
								//console.log(debuffList);
								const esunaTarget = message.mentions.members.first();

								for(var debuff in debuffList){
									if (esunaTarget.roles.cache.some(role => role.name === debuffList[debuff])) {
										const debuffRole = message.guild.roles.cache.find(role => role.name === debuffList[debuff]);
										esunaTarget.roles.remove(debuffRole);
										message.channel.send(`${taggedUser.username} has been esuna'd from ${debuffRole.name} with a vote of ${upvoteCount}-${downvoteCount}`);
										break; //this makes only one get removed, simply remove this and it should remove all debuffs
									}
								}
                            }
                         }
                         sentReact.unpin().catch(() => console.log('error unpinning'));
                         this.cooldown = 64800;
                    })
	                .catch(collected => {
                        console.log(collected);
                        console.log('Something fucked up')});
        });
	},
};