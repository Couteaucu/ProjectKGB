module.exports = {
    name: 'forceeditboard',
    description: 'pass a string to force edit the leaderboard',
    cooldown: 5,
    guildOnly: false,
    args: true,
    usage: '<operation> <string>',
    async execute(message, args, client) {
        /*         const guildID = message.guild.id;
                if (guildID != 693704390887866398) {
                    return message.reply('This command only works in ASG');
                }
         */
        const member = message.member;

        //required roles in server
        const role_WaifuHunter = member.guild.roles.cache.find(role => role.name === 'Waifu Hunter');
        const role_Head = member.guild.roles.cache.find(role => role.name === 'Head of the Socialist Party');

        //does the caller of the command have these roles
        const user_has_role_WaifuHunter = member.roles.cache.some(role => role.name === 'Waifu Hunter');
        const user_has_role_Head = member.roles.cache.some(role => role.name === 'Head of the Socialist Party');


        if (user_has_role_WaifuHunter || user_has_role_Head || member.id == message.guild.ownerID) {

            const messageID = '736524916362313739'; //bootleg workaround only works in ASG

            client.channels.fetch('723612703058559078')
                .then(channel => {
                    channel.messages.fetch(messageID).then(leaderboard => {
                        if (args[0] == 'reset') {
                            const send = "Current Leaderboard:\nChase - Zack | 3-1\nJustin - Zach | 1-9\nJustin - Bots  | 720-14";
                            console.log("resetting leaderboard");
                            leaderboard.edit(send);
                        } else {
                            const output = args.join(" ");
                            leaderboard.edit(output);
                        }
<<<<<<< HEAD
                        const kgbauthorized = message.guild.emojis.cache.find(emoji => emoji.name === 'kgbauthorized');
                        message.react(kgbauthorized).catch(() => message.channel.send("Acknowledged."));
=======
                        await message.react(kgbauthorized).catch(() => message.channel.send("Acknowledged."));
>>>>>>> f6fc8de78dc31946dd1a418a36f2b0b3843d2454
                    })
                        .catch(console.error);
                })
                .catch(console.error);
        } else {
            return message.reply('You are not authorized to use this command.');
        }
    },
};