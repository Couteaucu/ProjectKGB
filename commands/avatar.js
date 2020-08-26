module.exports = {
	name: 'avatar',
	description: 'Get the avatar URL of the tagged user(s), or your own avatar.',
	aliases: ['icon', 'pfp'],
	cooldown: 0,
    guildOnly: false,
    args: false,
	usage: '<@user or ID>',
	execute(message, args, client) {
		if (message.mentions.users.size) {
			const avatarList = message.mentions.users.map(user => {
				return `${user.displayAvatarURL({ format: "png", dynamic: true })}`;
			});
			message.channel.send(avatarList);
		}else{
			const userID = args[0];
			if(userID){
				client.users.fetch(userID)
				.then(user => {
					return message.channel.send(`${user.displayAvatarURL({ format: "png", dynamic: true })}`);
				})
				.catch(() => {return message.channel.send("error finding user, make sure you are sending an ID")});
			}else{
				return message.channel.send(`${message.author.displayAvatarURL({ format: "png", dynamic: true })}`);
			}
		}

	},
};