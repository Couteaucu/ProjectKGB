module.exports = {
    name: 'passageofarms',
    description: 'protect',
    cooldown: 5,
    guildOnly: false,
    args: true,
    usage: '<person>',
    async execute(message, args, client) {
        /*         const guildID = message.guild.id;
                if (guildID != 693704390887866398) {
                    return message.reply('This command only works in ASG');
                }
         */
        const member = message.member;

        if (!message.mentions.users.size) {
            return message.reply('You need a target.');
        }

        const taggedUser = message.mentions.members.first();

        //required roles in server
        const role_WaifuHunter = member.guild.roles.cache.find(role => role.name === 'Waifu Hunter');
        const role_Head = member.guild.roles.cache.find(role => role.name === 'Head of the Socialist Party');
        const role_Passage = member.guild.roles.cache.find(role => role.name === 'Passage of Arms');

        //does the caller of the command have these roles
        const user_has_role_WaifuHunter = member.roles.cache.some(role => role.name === 'Waifu Hunter');
        const user_has_role_Head = member.roles.cache.some(role => role.name === 'Head of the Socialist Party');

        if (user_has_role_WaifuHunter || user_has_role_Head || member.id == message.guild.ownerID) {
            if(taggedUser.roles.cache.some(role => role.name === 'Passage of Arms')){
                await taggedUser.roles.remove(role_Passage).catch(() => { message.channel.send("Oopwu woopsy! something went wong") });
                message.channel.send("Passage of Arms removed");
            }else{
                await taggedUser.roles.add(role_Passage).catch(() => { message.channel.send("Oopwu woopsy! something went wong") });
                message.channel.send("RHEEEEEEEEEEEEEEEEE");
            }
            
        } else {
            return message.reply('You are not authorized to use this command.');
        }
    },
};