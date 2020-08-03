module.exports = {
    name: 'send',
    description: '',
    aliases: [''],
    guildOnly: true,
    cooldown: 0,
    args: true,
    usage: '<channelid> <message>',
    async execute(message, args, client) {
        const member = message.member;//just to avoid typing messsage

        const channelid = args.shift();
        const output = args.join(" ");

        if (member.roles.cache.some(role => role.name === 'Waifu Hunter') || member.id == message.guild.ownerID) {
            const channel = client.channels.cache.find(channel => channel.id == channelid);
            channel.send(output);
            let kgbauthorized = message.guild.emojis.cache.find(emoji => emoji.name === 'kgbauthorized');
            await message.react(kgbauthorized).catch(() => message.channel.send("Acknowledged."));
        } else {
            return message.reply('You are not authorized to use this command.');
        }
    },
};