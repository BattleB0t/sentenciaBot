// Packages
require('dotenv').config() // .env file configuration
const Discord = require('discord.js'); //
const Hypixel = require('hypixel');
let prefix = 's!'; // Prefix for bot
const MojangAPI = require('mojang-api');
const axios = require('axios');
const hypixel = require('hypixel');
const client = new Discord.Client();
const hypixelClient = new Hypixel({ key: process.env.HYPIXELKEY })
// Importing other files (functions, api fetching etc.)


// Embeds
const verifyembed = new Discord.MessageEmbed()
.setColor('#00ff10 ')
.setTitle('Succesfully Verified!')
.setDescription('')
.setTimestamp()
.setFooter('Sentencia Bot');

const unverifiedembed = new Discord.MessageEmbed()
.setColor('#00ff10 ')
.setTitle('Incorrect username')
.setDescription("The username's discord you provided does not match with your own.")
.addFields(
    { name: 'Take a look at our verify help guide', value: 'Run s!verifyhelp for the guide' }
)
.setTimestamp()
.setFooter('Sentencia Bot');
// Variables
const sentencia_id = "5f9c9c7a8ea8c992ddb8cd67"


// Main code
client.on('ready', () => {
    client.user.setActivity('s!verify', { type: 'WATCHING' })
    .then(presence => console.log(`Activity set to ${presence.activities[0].name}`))
    console.log(`Bot connected as ${client.user.username}#${client.user.discriminator} with the id of ${client.user.id}`)
}) // Misc stuff, settings RPC.



// Developer commands (eval)
const clean = text => {
    if (typeof(text) === "string")
      return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
        return text;
  }
  

  
client.on("message", msg => {
    const args = msg.content.split(" ").slice(1);
    if (msg.content.startsWith(prefix + 'eval')) {
        if (msg.author.id != developerID1 || msg.author.id != developerID2) return;
        try {
        const code = args.join(" ");
        let evaled = eval(code);

        if (typeof evaled !== "string")
            evaled = require("util").inspect(evaled);


        } catch (err) {
        msg.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
        }
    }
});

// Main commands
// const errorembed = new Discord.MessageEmbed()
// .setColor('#ff0000 ')
// .setTitle('Error!')
// .addFields(
//     { name: 'An error occured!', value: 'Please forward this to a developer! ```' + err + "```" }
// )
// .setDescription('')
// .setTimestamp()
// .setFooter('Sentencia Bot');
// msg.channel.send(errorembed)
// Verify

client.on("message", msg => {
    const username = msg.content.split(" ").slice(1);
    const { guild } = msg;
    const verifiedRole = guild.roles.cache.find((role => role.name == 'Hypixel Verified'));
    const sentenciaRole = guild.roles.cache.find((role => role.name == 'Sentencia Member'));
    let authorID = msg.author.id
    const member = guild.members.cache.get(authorID);


    if (msg.content.startsWith(prefix + 'verify')) {
        MojangAPI.nameToUuid(username, function(err, result) {
            if (err) {

            } else {
                try {
                    axios.get("https://api.hypixel.net/guild?key=" + process.env.HYPIXELKEY + "&name=" + username)
                    .then(res => {

                    })         
                    axios.get("https://api.hypixel.net/player?key=" + process.env.HYPIXELKEY +  "&uuid=" + result[0].id)
                    .then(res => {
                        if (msg.author.tag == res.data.player.socialMedia.links.DISCORD) {
                            msg.channel.send(verifyembed)
                            member.roles.add(verifiedRole)
                        } else {
                            msg.channel.send(unverifiedembed)
    
                        }
                    hypixelClient.findGuildByPlayer(result[0].id, (err, guildId) => { 
                        if (guildId == sentencia_id) {
                            console.log('Sentencia Member!')
                            member.roles.add(sentenciaRole)
                        }
                    });
                    })
                    .catch(err => {
                        const errorembed = new Discord.MessageEmbed()
                        .setColor('#ff0000 ')
                        .setTitle('Error!')
                        .addFields(
                            { name: 'An error occured!', value: 'Please forward this to a developer! ```' + err + "```" }
                        )
                        .setDescription('This is probably because of an invalid username')
                        .setTimestamp()
                        .setFooter('Sentencia Bot • Errors');
                        msg.channel.send(errorembed)})


                } catch {
                    const errorembed = new Discord.MessageEmbed()
                    .setColor('#ff0000 ')
                    .setTitle('Error!')
                    .addFields(
                        { name: 'An error occured!', value: 'Please forward this to a developer! ```' + err + "```" }
                    )
                    .setDescription('')
                    .setTimestamp()
                    .setFooter('Sentencia Bot');
                    msg.channel.send(errorembed)
                }


            }
        });

    }
})


client.login(process.env.TOKEN); // Gets token from .env file (the last bit is the variable within .env)
