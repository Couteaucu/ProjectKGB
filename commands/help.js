const { prefix } = require('../config.json');
module.exports = {
    name: 'help',
    description: 'List all of my commands or info about a specific command.',
    aliases: ['command, commands, ?, info'],
    usage: '[command name]',
    cooldown: 0,
    execute(message, args) {
        const data = [];
        const { commands } = message.client;
        const filter = ['send', 'senddm'];

        if (!args.length) {
            data.push('Here\'s a list of all my commands:');
            var commandlist = commands.map(command => command.name);
            commandlist = commandlist.filter(c => { //purge any command from being mentioned if its in the filter. l o l
                var discard = false;
                filter.forEach(f => {
                    if (c == f) {
                        discard = true;
                    }
                });
                if (discard == true) {
                    return false;
                } else {
                    return true;
                }
            });
            data.push(commandlist.join(', '));
            data.push(`\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`);
            data.push("You can '@KGB-chan fuck off' and the bot will stop keyword replies. '@KGB-chan come back' will turn them back on.");

            //convert from DM to actual channel.
            return message.channel.send(data, { split: true });

            /*return message.author.send(data, { split: true })
                .then(() => {
                    if (message.channel.type === 'dm') return;
                    message.reply('I\'ve sent you a DM with all my commands!');
                })
                .catch(error => {
                    console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
                    message.reply('it seems like I can\'t DM you! Do you have DMs disabled?');
                });*/
        }

        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            return message.reply('that\'s not a valid command!');
        }

        data.push(`**Name:** ${command.name}`);

        if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
        if (command.description) data.push(`**Description:** ${command.description}`);
        if (command.usage) data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);

        data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);

        message.channel.send(data, { split: true });
    },
};