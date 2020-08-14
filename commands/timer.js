const debuffList = require('../debuffList.json');

module.exports = {
	name: 'timer',
	description: 'list timers',
    cooldown: 1,
    guildOnly: true,
    args: true,
    usage: '<type>',
	execute (message, args, client) {
        const type = args[0].toLowerCase();

        if(type == "debuff"){
            debufftimers = client.debufftimers;
            const guild = message.guild.id;
            var output = "";
            output += `__Debuff Timers__`;
            output += "\n```";

            if (debufftimers[guild] == undefined) { //guild not in system
                message.channel.send("This server has no active debuffs.");
                return;
            }

            for (var user in debufftimers[guild]) {
                const target = message.guild.members.cache.find(member => member.id == user);
                output += `${target.user.tag}:\n`;

                for (var debuffID in debufftimers[guild][user]) {
                    const debuffTime = debufftimers[guild][user][debuffID].time;
                    const debuffName = debuffList[debuffID];
                    
                    var totaltime = ((debufftimers[message.guild.id][target.user.id][debuffID].time) / 3600).toFixed(); //get time in hours
                    output += (`\t${debuffName} | ${totaltime} hours\n`);
                }
            }

            output += "\n```";
            message.channel.send(output)
            return;
        }
	},
};

function prune(object){
    if(isEmpty(object)){
        delete object;
    }
}

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}