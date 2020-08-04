module.exports = {
	name: 'makewife',
	description: 'Create wife.',
	usage: '<user>',
	async execute(message) {
        
        splitmessage = message.content.slice(9).split(" ", 4);

        client.waifus[message.author.username] = {
            name: splitmessage[0],
            image: splitmessage[1],
            health: splitmessage[2],
            attack: splitmessage[3],
        }
        fs.writeFile("./waifus.json",JSON.stringify(client.waifus,null,4), err => {
            if (err) throw err;
            message.channel.send("Wife made.");
        });
        
	},
};

module.exports = {
	name: 'postwife',
	description: 'Post wife.',
	usage: '<user>',
	async execute(message) {
        
        const wifeEmbed = new Discord.MessageEmbed()
            .setTitle(client.waifus[message.author.username].name)
            .setThumbnail(client.waifus[message.author.username].image)
            .addFields(
                {name: 'Health', value: client.waifus[message.author.username].health},
                {name: 'Attack', value: client.waifus[message.author.username].attack},
            )
        message.channel.send(wifeEmbed);
        
	},
};