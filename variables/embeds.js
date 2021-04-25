const Discord = require('discord.js')

const tagHelp = new Discord.MessageEmbed()
.setColor('#ED820E ')
.setTitle('Tag Help')
.setDescription('Here are all valid commands:')
.setAuthor('SENTENCIA | Skyblock Guild')
.setThumbnail('https://cdn.discordapp.com/attachments/832714326258614326/834808899717955584/SENTENCIA.png')
.addFields(
    { name: 's!tag new (tag name) (tag content)', value: 'Creates a new tag' },
    { name: 's!tag call (tag name)', value: 'Calls the tag name' },
    { name: 's!tag edit (tag name) (edited tag content)', value: 'Edits your tag' },
    { name: 's!tag (tag name)', value: 'Same as s!tag call, but just shorter' },
    { name: 's!tag all', value: 'Shows all tags' }
)
.setTimestamp()
.setFooter('Sentencia Bot', 'https://cdn.discordapp.com/attachments/832714326258614326/834808899717955584/SENTENCIA.png');


const guildroleHelp = new Discord.MessageEmbed()
.setColor('#ED820E ')
.setAuthor('SENTENCIA | Skyblock Guild')
.setThumbnail('https://cdn.discordapp.com/attachments/832714326258614326/834808899717955584/SENTENCIA.png')
.setTitle('Role-ing Help')
.setDescription('Here are all valid commands:')
.addFields(
    { name: 's!guildrole inferior @user', value: 'Adds the tagged user with the Sentencia Inferior guild role. Alias: s!guildrole i' },
    { name: 's!guildrole eternal @user', value: 'Adds the tagged user with the Sentencia Eternal guild role. Alias: s!guildrole e' }
)
.setTimestamp()
.setFooter('Sentencia Bot', 'https://cdn.discordapp.com/attachments/832714326258614326/834808899717955584/SENTENCIA.png');



const verifyHelp = new Discord.MessageEmbed()
.setColor('#ED820E')
.setTitle('Verify Help')
.setDescription('Here are all valid commands:')
.addFields(
    { name: 's!verify (your minecraft name)', value: 'Verifies you. Changes nick to your IGN, and adds the supporting roles' },
    { name: 's!unverify', value: 'Unverifies you, removing your nick and roles.' },
    { name: 'verify help', value: 'Tells you how to verify properly' },
)
.setTimestamp()
.setAuthor('SENTENCIA | Skyblock Guild')
.setThumbnail('https://cdn.discordapp.com/attachments/832714326258614326/834808899717955584/SENTENCIA.png')
.setFooter('Sentencia Bot', 'https://cdn.discordapp.com/attachments/832714326258614326/834808899717955584/SENTENCIA.png');

const syncHelp = new Discord.MessageEmbed()
.setColor('#ED820E')
.setTitle('Sync Help')
.setDescription('Here are all valid commands:')
.addFields(
    { name: 's!sync', value: 'Syncs your roles with your rank and if your in any of our guilds' }
)
.setTimestamp()
.setAuthor('SENTENCIA | Skyblock Guild')
.setThumbnail('https://cdn.discordapp.com/attachments/832714326258614326/834808899717955584/SENTENCIA.png')
.setFooter('Sentencia Bot', 'https://cdn.discordapp.com/attachments/832714326258614326/834808899717955584/SENTENCIA.png');

const greqHelp = new Discord.MessageEmbed()
.setColor('#ED820E')
.setTitle('Guild Requirements Command Help')
.setDescription('Here are all valid commands:')
.addFields(
    { name: 's!greq (username)', value: 'Checks if the user meets the reqs of Sentencia Eternal. WIP: Can switch profiles using the <:NoU:834150570389929984> reaction' }
)
.setTimestamp()
.setAuthor('SENTENCIA | Skyblock Guild')
.setThumbnail('https://cdn.discordapp.com/attachments/832714326258614326/834808899717955584/SENTENCIA.png')
.setFooter('Sentencia Bot', 'https://cdn.discordapp.com/attachments/832714326258614326/834808899717955584/SENTENCIA.png');

const suggesstionHelp = new Discord.MessageEmbed()
.setColor('#ED820E')
.setTitle('Suggest Command Help')
.setDescription('Here are all valid commands:')
.addFields(
    { name: 's!suggest (suggestion)', value: 'Suggests a suggestion to the discord-suggestions channel' },
    { name: 's!suggest accept (suggestionID) (reason)', value: 'Accepts a suggestion. Note: Suggestion ID can be found in the footer of the suggestion embed.' },
    { name: 's!suggest deny (suggestionID) (reason)', value: 'Denies a suggestion' },
    { name: 's!suggest delete (suggestion ID)', value: 'Deletes the suggestion' },
)
.setTimestamp()
.setAuthor('SENTENCIA | Skyblock Guild')
.setThumbnail('https://cdn.discordapp.com/attachments/832714326258614326/834808899717955584/SENTENCIA.png')
.setFooter('Sentencia Bot', 'https://cdn.discordapp.com/attachments/832714326258614326/834808899717955584/SENTENCIA.png');


// Embeds when stuff goes wrong

const wrongusername = new Discord.MessageEmbed()
.setColor('#ff0000 ')
.setAuthor('SENTENCIA | Skyblock Guild')
.setThumbnail('https://cdn.discordapp.com/attachments/832714326258614326/834808899717955584/SENTENCIA.png')
.setTitle('Invalid username')
.setDescription("The entered username does not exist!")
.addFields(
    { name: 'Please check if the username is your *in game name*', value: 'Run the command once more after you check!' }
)
.setTimestamp()
.setFooter('Sentencia Bot • Invalid Username', 'https://cdn.discordapp.com/attachments/832714326258614326/834808899717955584/SENTENCIA.png');

const alreadyverifiedembed = new Discord.MessageEmbed()
.setColor('#ff0000 ')
.setAuthor('SENTENCIA | Skyblock Guild')
.setThumbnail('https://cdn.discordapp.com/attachments/832714326258614326/834808899717955584/SENTENCIA.png')
.setTitle('You are already verified!')
.setDescription('If you want to unverify, type `s!unverify`, then re run s!verify!')
.setTimestamp()
.setFooter('Sentencia Bot', 'https://cdn.discordapp.com/attachments/832714326258614326/834808899717955584/SENTENCIA.png');

const succesfullyunverifiedembed = new Discord.MessageEmbed()
.setColor('#ED820E ')
.setAuthor('SENTENCIA | Skyblock Guild')
.setThumbnail('https://cdn.discordapp.com/attachments/832714326258614326/834808899717955584/SENTENCIA.png')
.setTitle('Succesfully Unverified!')
.setDescription('To re-verify, run `s!verify (your minecraft name)`. For help, type `verify help`!')
.setTimestamp()
.setFooter('Sentencia Bot', 'https://cdn.discordapp.com/attachments/832714326258614326/834808899717955584/SENTENCIA.png');


module.exports = {tagHelp,guildroleHelp,verifyHelp,succesfullyunverifiedembed,wrongusername,alreadyverifiedembed,greqHelp,syncHelp,suggesstionHelp}