const Discord = require('discord.js');

module.exports = {
    name: 'leaderboard',
    description: 'update the leaderboard',
    cooldown: 5,
    guildOnly: true,
    args: true,
    usage: '<user> <user> <win/lose> <win/lose>',
    async execute(message, args, client) {
        const guildID = message.guild.id;
        if (guildID != 693704390887866398) {
            return message.reply('This command only works in ASG');
        }

        /*if (message.mentions.users.size != 2) {
            return message.reply('You need two users');
        }*/

        if(message.mentions.users.size){
            return message.reply('Please do not mention the user, use a nickname.');
        }

        const regex_status = /^((win)|(lose)){1}$/i;

        const status_first = args[2];
        const status_second = args[3];

        if (!(regex_status.test(status_first) || regex_status.test(status_second))) {
            return message.reply('that doesn\'t seem to be a valid input. You must put win lose or lose win.');
        }

        /*const taggedUsers = message.mentions.users.first(2);
        const user_first = taggedUsers[0];
        const user_second = taggedUsers[1];*/
        const user_first = args[0];
        const user_second = args[1];

        const messageID = '736524916362313739'; //bootleg workaround only works in ASG
        client.channels.fetch('723612703058559078')
            .then(channel => {
                //primerMessage(channel);
                channel.messages.fetch(messageID).then(message => {
                    var split = message.content.split('\n');

                    var matchup = new Array(split.length);
                    var score = new Array(split.length);
                    for (var i = 0; i < matchup.length; i++) {
                        matchup[i] = [];
                        score[i] = [];
                    }

                    for (i = 1; i < split.length; i++) {
                        var n = i - 1;
                        var split2 = split[i].split('|');
                        var person = split2[0].split('-');
                        var splitscore = split2[1].split('-');
                        for (j = 0; j < 2; j++) {
                            person[j] = person[j].trim();
                            splitscore[j] = splitscore[j].trim();
                        }
                        matchup[n][0] = person[0];
                        matchup[n][1] = person[1];
                        score[n][0] = splitscore[0];
                        score[n][1] = splitscore[1];
                    }

                    var matchIndex = -1;

                    for (i = 0; i < matchup.length; i++) {
                        var person1 = matchup[i][0];
                        var person2 = matchup[i][1];
                        //var user1 = user_first.username;
                        //var user2 = user_second.username;
                        var user1 = user_first;
                        var user2 = user_second;
                        var score1 = score[i][0];
                        var score2 = score[i][1];

                        if ((user1 == person1 && user2 == person2) || (user1 == person2 && user2 == person1)) {
                            matchIndex = i;
                            break;
                        }
                    }

                    var newRecord = false;
                    if(matchIndex == -1){
                        matchIndex = matchup.length - 1;
                        newRecord = true;
                    }

                    var person1 = matchup[matchIndex][0];
                    var person2 = matchup[matchIndex][1];
                    //var user1 = user_first.username;
                    //var user2 = user_second.username;
                    var user1 = user_first;
                    var user2 = user_second;

                    if(newRecord){
                        matchup[matchIndex][0] = user1;
                        matchup[matchIndex][1] = user2;
                        if(status_first == 'win'){
                            score[matchIndex][0] = 1;
                            score[matchIndex][1] = 0;
                        }else{
                            score[matchIndex][0] = 0;
                            score[matchIndex][1] = 1;
                        }
                        
                        
                    }else if(user1 == person1){
                        if(status_first == 'win'){
                            score[matchIndex][0]++;
                        }else{
                            score[matchIndex][1]++;
                        }
                    }else if(user1 == person2){
                        if(status_first == 'win'){
                            score[matchIndex][1]++;
                        }else{
                            score[matchIndex][0]++;
                        }
                    }

                    var outputMessage = "Current Leaderboard:\n";
                    var combine = matchup.length-1;
                    if(newRecord){
                        combine = matchup.length;
                    }
                    for (var i = 0; i < combine; i++) {
                        outputMessage += matchup[i][0];
                        outputMessage += " - ";
                        outputMessage += matchup[i][1];
                        outputMessage += " | ";
                        outputMessage += score[i][0];
                        outputMessage += "-";
                        outputMessage += score[i][1];
                        outputMessage += "\n";
                    }

                    message.edit(outputMessage);
                })
                    .catch(console.error);
            })
            .catch(console.error);


        //message.channel.send("This command has not been actually made yet. :(");


        return;

        const messageExists = false;
        if (!messageExists) {
            const exampleEmbed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle('Leaderboard')
                .addFields(
                    { name: 'Chase', value: 'Some value here', inline: true },
                    { name: 'Inline field title', value: 'Some value here', inline: true },
                    { name: 'Inline field title', value: 'Some value here', inline: true },
                )
                .setTimestamp()

            message.channel.send(exampleEmbed);
        }
    },
};

function primerMessage(channel) {
    const send = "Current Leaderboard:\nChase - Zack | 3-1\nJustin - Zach | 1-9\nJustin - Bots  | 720-14";
    channel.send(send);
}