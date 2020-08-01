module.exports = {
    name: 'kgb',
    description: 'kgb responds to kgb',
    cooldown: 5,
    guildOnly: false,
    args: false,
	execute(message, args) {
		message.reply('The KGB\'s eyes are always watching');
	},
};