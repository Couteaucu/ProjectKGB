const debuffList = require('../debuffList.json');
const fs = require('fs');

module.exports = {
    name: 'timer',
    description: 'list timers',
    cooldown: 1,
    guildOnly: true,
    args: true,
    usage: '<type>',
    execute(message, args, client) {
        const type = args[0].toLowerCase();
        var isData = false;
        var writeFile = false;

        if (type == "debuff") {
            debufftimers = client.debufftimers;
            const guild = message.guild.id;
            var output = "";
            output += `__Debuff Timers__`;
            output += "\n```";

            if (isEmpty(debufftimers[guild])) {//This tiered delete system will leave behind the empty guild object if there is an empty user object in it until the command is run a second time.
                delete debufftimers[guild];
                message.channel.send("This server has no active debuffs.");
                writeFile = true; //done with the intent to reduce the amount of times file is written to
            } else {
                for (var user in debufftimers[guild]) {
                    const target = message.guild.members.cache.find(member => member.id == user);
                    if (isEmpty(debufftimers[guild][user])) {
                        delete debufftimers[guild][user];
                        writeFile = true;
                    } else {
                        isData = true; //used later to determine if output should be used or not
                        output += `${target.user.tag}:\n`;
                    }

                    for (var debuffID in debufftimers[guild][user]) {
                        const debuffTime = debufftimers[guild][user][debuffID].time;
                        const debuffName = debuffList[debuffID];

                        var totaltime = ((debufftimers[message.guild.id][target.user.id][debuffID].time) / 3600).toFixed(); //get time in hours
                        if(totaltime > 48){
                            totaltime = (totaltime/24).toFixed(2);
                            output += (`\t${debuffName} | ${totaltime} days\n`);
                        }else{
                            output += (`\t${debuffName} | ${totaltime} hours\n`);
                        }
                        
                    }
                }
                output += "\n```";

                if (isData) {
                    message.channel.send(output);
                } else {
                    message.channel.send("This server has no active debuffs.");
                }
            }

            if (writeFile) {
                fs.writeFile('./debuffTime.json', JSON.stringify(debufftimers, null, 4), err => {
                    if (err) return console.log('debufftimer prune failed');
                });
            }

            return;
        }
    },
};

function isEmpty(obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
}