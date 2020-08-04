const fs = require('fs');
const Discord = require('discord.js');

//For seeing arguments
/*
process.argv.forEach(function (val, index, array) {
	console.log(index + ': ' + val);
});*/

var { prefix, token } = require('./config.json');
if (process.argv[2] == 'test') {
	var { prefix, token } = require('./configTest.json');
}

//dynamic command addition
const client = new Discord.Client();
client.commands = new Discord.Collection();

//generate variables
const cooldowns = new Discord.Collection();
const nekotimer = new Discord.Collection();

//regex
const regex_uwu = /((uwu)+)/i;
const regex_kgb = /((kgb)+)/i;
const regex_uwu_space = /u{1}\s+w{1}\s+u{1}/i;
const regex_kgb_space = /k{1}\s+g{1}\s+b{1}/i;
const regex_nyaa = /n{1}y{1}a{1,2}/i;
const regex_catgirl = /(cat){1}\s*(girl)+/i;
const regex_foxgirl = /(fox){1}\s*(girl)+/i;
const regex_neko = /(neko){1}(mimi)?/i;
const regex_chase = /(chase){1}/i;
const catRole = 'Nekomimi';

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	//console.log(command.name);
	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
}


//Bot start
client.on('ready', () => {
	console.log('Project: KGB is now active');
});

client.login(token);

//message/command handling
client.on('message', async message => {
	if (!message.content.startsWith(prefix)) {
		if (message.author.bot) {
			return;
		} else {
			if (message.channel.type == 'dm') {
				client.channels.fetch('739624963530555504') //bot_dms TestDiscord
					.then(channel => {
						const buildOuput = () => {
							var output = "";
							output += `**From: ${message.author.tag}**`;

							if (message.content != '') {
								output += "\n```";
								output += message.content;
								output += "```";
							}
							return output;
						}
						const sendfunction = async () => {
							try {
								const output = buildOuput();
								await channel.send(output);
								if (message.attachments.size > 0) {
									for (var object of message.attachments) {
										var object = object[1];
										await channel.send(object.proxyURL);
									}
								}
							} catch{
								errorNotify('Function: DM Pipeline\nError: sending the message', message.guild);
							}
						}
						sendfunction();
					})
					.catch(console.error);
			}
			if (regex_kgb.test(message.content)) {
				await message.reply('The KGB\'s eyes are always watching');
			} else if (regex_nyaa.test(message.content)) {
				await catgirlAdd(message).catch(() => { //call the function to deal with this
					message.channel.send("It looks like I don't have permission to add you to the catgirl clan nyaa");
				});
			} else if (regex_uwu.test(message.content)) {
				//await message.channel.send('UwU');
				await message.channel.send("Rawr x3 nuzzles how are you pounces on you you're so warm o3o notices you have a bulge o: someone's happy ;) nuzzles your necky wecky~ murr~ hehehe rubbies your bulgy wolgy you're so big :oooo rubbies more on your bulgy wolgy it doesn't stop growing ·///· kisses you and lickies your necky daddy likies (; nuzzles wuzzles I hope daddy really likes $: wiggles butt and squirms I want to see your big daddy meat~ wiggles butt I have a little itch o3o wags tail can you please get my itch~ puts paws on your chest nyea~ its a seven inch itch rubs your chest can you help me pwease squirms pwetty pwease sad face I need to be punished runs paws down your chest and bites lip like I need to be punished really good~ paws on your bulge as I lick my lips I'm getting thirsty. I can go for some milk unbuttons your pants as my eyes glow you smell so musky :v licks shaft mmmm~ so musky drools all over your cock your daddy meat I like fondles Mr. Fuzzy Balls hehe puts snout on balls and inhales deeply oh god im so hard~ licks balls punish me daddy~ nyea~ squirms more and wiggles butt I love your musky goodness bites lip please punish me licks lips nyea~ suckles on your tip so good licks pre of your cock salty goodness~ eyes role back and goes balls deep mmmm~ moans and suckles");
			} else if (regex_chase.test(message.content)) {
				await message.channel.send(quote('chase_attractive')).catch(() => errorNotify("regex_chase", message.guild));
			}

			if (regex_kgb_space.test(message.content)) {
				let kgbauthorized = message.guild.emojis.cache.find(emoji => emoji.name === 'kgbauthorized');
				await message.react(kgbauthorized);

			} if (regex_uwu_space.test(message.content)) {
				let uwu = message.guild.emojis.cache.find(emoji => emoji.name === 'uwu');
				await message.react(uwu);
			}
			return;
		}
	}

	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

	//prevent commands in DMs
	if (command.guildOnly && message.channel.type !== 'text') {
		return message.reply('I can\'t execute that command inside DMs!');
	}

	//check for argiments and supply usage
	if (command.args && !args.length) {
		let reply = `You seem to be missing some arguments, and a brain ${message.author}!`;

		if (command.usage) {
			reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
		}

		return message.channel.send(reply);
	}

	//cooldown
	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;

	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
		}
	}

	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

	try {
		//message.channel.send(command);
		if (command.name == 'leaderboard' || command.name == 'forceeditboard' || command.name == 'send' || command.name == 'senddm') {
			command.execute(message, args, client);
		} else {
			command.execute(message, args);
		}
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}

});

client.on('messageDelete', async message => {
	// ignore direct messages
	if (!message.guild) return;
	if (message.type === 'PINS_ADD') return;
	const fetchedLogs = await message.guild.fetchAuditLogs({
		limit: 1,
		type: 'MESSAGE_DELETE',
	});
	// Since we only have 1 audit log entry in this collection, we can simply grab the first one
	const deletionLog = fetchedLogs.entries.first();

	// Let's perform a sanity check here and make sure we got *something*
	if (!deletionLog) return console.log(`A message by ${message.author.tag} was deleted, but no relevant audit logs were found.`);

	// We now grab the user object of the person who deleted the message
	// Let us also grab the target of this action to double check things
	const { executor, target } = deletionLog;


	// And now we can update our output with a bit more information
	// We will also run a check to make sure the log we got was for the same author's message
	if (target.id === message.author.id) {
		console.log(`A message by ${message.author.tag} was deleted by ${executor.tag}.`);
	} else {
		console.log(`A message by ${message.author.tag} was deleted.`);
	}


	if (message.guild.id != 376183399792246785) {//Ignore testing discord
		client.channels.fetch('723363409243930684') //hidden-records Ahegao Support Group
			.then(channel => {
				const buildOuput = () => {
					var output = "";
					if (target.id === message.author.id) {
						output += `__Censored Message__\nAuthor: ${message.author.tag}\nCensor: ${executor.tag}`;
					} else {
						output += `__Deleted Message__\nAuthor: ${message.author.tag}`;
					}
					if (message.content != '') {
						output += "\n```";
						output += message.content;
						output += "```";
					}
					return output;
				}

				const ignoreAuthorized = async () => {
					try {
						const executorObject = await message.guild.members.fetch(executor.id);
						const user_has_role_WaifuHunter = executorObject.roles.cache.some(role => role.name === 'Waifu Hunter');
						if (message.channel.id == 723363409243930684 && user_has_role_WaifuHunter) {
							message.member.guild.owner.send('Ignoring deletion.');
							console.log('Ignoring deletion.');
							return true;
						} else {
							return false;
						}
					} catch{
						errorNotify('Function: ignoreAuthorized', message.guild);
					}
				}

				const sendfunction = async () => {
					try {
						const isAuthorized = await ignoreAuthorized();
						const output = buildOuput();
						if (isAuthorized) {
							return;
						}
						await channel.send(output);
						if (message.attachments.size > 0) {
							for (var object of message.attachments) {
								var object = object[1];
								await channel.send(object.proxyURL);
							}
						}
					} catch{
						errorNotify('Function: Censor Archiver\nError: sending the message', message.guild);
					}
				}
				sendfunction();
			})
			.catch(console.error);
	}
});

//Listener event: User joins the discord server.
client.on('guildMemberAdd', async member => {
	console.log('User ' + member.user.username + ' has joined the server.');
	const role = member.guild.roles.cache.find(role => role.name === 'Socialist Supporter');

	await member.roles.add(role).catch(() => {
		member.guild.owner.send(`Something went wrong with the autorole on user: ${member.user.username}`);
	});
});

//Emitted whenever a guild member changes - i.e. new role, removed role, nickname.
client.on('guildMemberUpdate', async (oldMember, newMember) => {
	const wasCatgirl = oldMember.roles.cache.some(role => role.name === catRole);
	const isCatgirl = newMember.roles.cache.some(role => role.name === catRole);

	const catgirlRole = newMember.guild.roles.cache.find(role => role.name === catRole);

	if (oldMember.nickname != newMember.nickname) {
		const name = newMember.nickname;
		if (regex_catgirl.test(name) || regex_neko.test(name) || regex_uwu.test(name) || regex_nyaa.test(name) || regex_foxgirl.test(name)) {
			await newMember.setNickname(name, "Is a catgirl");

			//give catgirl role
			await newMember.roles.add(catgirlRole).catch(() => { newMember.channel.send("Oopwu woopsy! something went wong") });
		}
	}

	if (isCatgirl) {

		//remove role if nickname doesnt have some variant of catgirl/nyaa/neko
		const name = newMember.nickname;
		if (!(regex_catgirl.test(name) || regex_neko.test(name) || regex_uwu.test(name) || regex_nyaa.test(name) || regex_foxgirl.test(name))) {
			await newMember.roles.remove(catgirlRole).catch(() => { newMember.channel.send("Oopwu woopsy! something went wong") });
		}
	}
});

//Emitted whenever a guild member changes speaking state
client.on('guildMemberSpeaking', async (member, state) => {
	username = member.user.username;
	console.log(`${username} ${state}`);
});

//*****************Functions****************** */

async function catgirlAdd(message) {
	await message.channel.send("N-Nya...~ Cat girls unite...~");
	await message.member.setNickname("Catgirl", "Is a catgirl");

	//give catgirl role
	const role = message.guild.roles.cache.find(role => role.name === catRole);
	await message.member.roles.add(role);


	//require refresh, have a tick
}

async function errorNotify(error, guild) {
	try {
		const botOwner = await client.users.resolve('211339931103002624');
		await botOwner.send(`__Error__\n${error}\nGuild: ${guild.name}`);
		console.log(`__Error__\n${error}\nGuild: ${guild.name}`);
		if (botOwner.id != guild.owner.id) {
			await guild.owner.send(`__Error__\n${error}\nPlease make sure you have the required roles/channels created for this function. Message ${botOwner.tag} if you have any questions.`);
			await botOwner.send(`${guild.owner.tag} notified.`);
			console.log(`${guild.owner.tag} notified.`);
		}
	} catch{
		console.log('big problem with errorNotify');
	}
}

function quote(choice) {
	var output = "";
	switch (choice) {
		case 'chase_attractive':
			output = "**From: God#5663**\n```be more attractive and i might be more susceptible to subjugation```";
			break;
		default:
			output = "error with quote input";
			console.log("Error with quote input");
			break;
	}
	return output;
}

function createDebuff(debuffName) {
	guild.roles.create({ data: { name: debuffName, position: 0, color: '#000000', } });
}

//have a gulag, probably shove someone into a channel and mute them for like 5 seconds
//probably need to have user profiles or something and have a variable for each