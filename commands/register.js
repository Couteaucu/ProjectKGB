module.exports = {
	name: 'register',
	description: 'get or remove the registered voter role',
    aliases: ['deregister'],
    guildOnly: true,
    cooldown: 60,
    args: false,
	usage: '',
	execute(message) {
        const voterrole = message.guild.roles.cache.find(role => role.name === 'Registered Voter');
        if(!voterrole){
            message.channel.send('This server does not have the \'Registered Voter\' role.');
            return;
        }

        const user_has_role_voter = message.member.roles.cache.some(role => role.name === 'Registered Voter');

        if(user_has_role_voter){
            message.member.roles.remove(voterrole);
            message.reply('You have been removed from the voter registration.');
        }else{
            message.member.roles.add(voterrole);
            message.reply('You are now a registered voter.');
        }
	},
};