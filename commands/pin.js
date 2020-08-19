module.exports = {
	name: 'pin',
	description: 'pin/unpin a message',
	aliases: 'unpin',
	cooldown: 0,
    guildOnly: true,
    args: true,
	usage: '<messageid>',
	async execute(message, args) {
        const member = message.member;//just to avoid typing messsage
        const messageID = parseInt(args[0]);

        if(isNaN(messageID)){
            return message.channel.send("That is not a valid messageID");
        }

        if (member.roles.cache.some(role => role.name === 'Waifu Hunter') || member.id == message.guild.ownerID) {        
            const pinFunction = async () => {
                try {
                    const pinMessage = await message.channel.messages.fetch(messageID);
                    await pinMessage.pin();
                } catch{
                    console.log('Error in pinning message');
                    message.reply("Unable to pin mesasge.");
                }
            }
            pinFunction();
        } else {
            return message.reply('You are not authorized to use this command.');
        }
        
        
	},
};