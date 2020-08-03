const { Channel } = require("discord.js");

module.exports = {
    name: 'senddm',
    description: '',
    aliases: [''],
    guildOnly: true,
    cooldown: 0,
    args: true,
    usage: '<userid> <message>',
    async execute(message, args, client) {
        const member = message.member;//just to avoid typing messsage

        const userid = args.shift();
        const output = args.join(" ");

        if (member.roles.cache.some(role => role.name === 'Waifu Hunter') || member.id == message.guild.ownerID) {
            const user = client.users.cache.find(user => user.id == userid);
            user.send(output);
            let kgbauthorized = message.guild.emojis.cache.find(emoji => emoji.name === 'kgbauthorized');
            await message.react(kgbauthorized).catch(() => message.channel.send("Acknowledged."));
        } else {
            return message.reply('You are not authorized to use this command.');
        }
    },
};