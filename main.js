// Packages
require('dotenv').config() // .env file configuration
const Discord = require('discord.js'); //
const Hypixel = require('hypixel');
let prefix = 's!'; // Prefix for bot
const MojangAPI = require('mojang-api');
const axios = require('axios');
const hypixel = require('hypixel');
const mongoose = require('mongoose')
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
    { name: 'Take a look at our verify help guide', value: 'Type "verify help" for the guide!' }
)
.setTimestamp()
.setFooter('Sentencia Bot');
// Variables
const sentencia_id = "5f9c9c7a8ea8c992ddb8cd67"

// Mongoose variables
mongoose.connect("mongodb://localhost:27017/tagDB", {useNewUrlParser: true, useCreateIndex: true,  useUnifiedTopology: true});
mongoose.set("useCreateIndex", true);

const tagSchema = new mongoose.Schema ({
    tagName: String,
    tagContent: String
  });

const tags = new mongoose.model("Tags", tagSchema);
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
        if (msg.author.id != process.env.DEVID) {
            msg.channel.send('Invalid Permissions. I see you lmao')
        };
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

// Verify commands

client.on("message", msg => {
    if (msg.content.startsWith('verify help')) {
        const verifyhelp = new Discord.MessageEmbed()
        .setColor('#ED820E ')
        .setTitle('Verify Instructions')
        .addFields(
            { name: 'Step 1', value: 'Log into Hypixel' },
            { name: 'Step 2', value: 'Go to the second slot with your skin head and right click' },
            { name: 'Step 3', value: 'Click the twitter icon (above the diamond)' },
            { name: 'Step 4', value: 'Hover over the discord icon and left click' },
            { name: 'Step 5', value: 'Go back to discord and copy your name and discriminator (yours is ' + msg.author.tag + ') and paste that into your chat'},
            { name: 'Step 6', value: 'Go back and try to verify again using ' + prefix + 'verify!' },
            { name: 'Video tutorial', value: 'Click [here](https://forms.gle/6dvCTWBXRDwscTo69) to see the tutorial'}
        )
        .setTimestamp()
        .setFooter('Sentencia Bot');
        msg.channel.send(verifyhelp)
    };

})

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
                            member.setNickname(res.data.player.displayname);
                        } else {
                            msg.channel.send(unverifiedembed)
    
                        }
                    hypixelClient.findGuildByPlayer(result[0].id, (err, guildId) => { 
                        if (guildId == sentencia_id) {
                            console.log('Sentencia Member!')
                            member.roles.add(sentenciaRole)
                        }
                        
                    });})
                    .catch(err => {
                        const errorembed = new Discord.MessageEmbed()
                        .setColor('#ff0000 ')
                        .setTitle('Error!')
                        .addFields(
                            { name: 'An error occured!', value: 'Please forward this to a developer(<@504196872706064415>)! ```' + err + "```" }
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
                        { name: 'An error occured!', value: 'Please forward this to a developer (<@504196872706064415>)! ```' + err + "```" }
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


// Tag system

client.on('message', msg => {
    const tagArgs = msg.content.split(" ").slice(1);
    if (msg.content.startsWith(prefix + 'tag')) {
        // New tag
        if (tagArgs[0] == 'new') {
            let tagtitlesplit = tagArgs.slice(1,2);
            let tagcontentsplit = tagArgs.slice(2);
            let tagcontent = tagcontentsplit.join(' ')
            let tagtitle = tagtitlesplit.join(' ')
            console.log(tagtitle + ' content: ' + tagcontent)
            const newTag = new tags({
                tagName: tagtitle,
                tagContent: tagcontent
            })
            newTag.save()
            .then(msg.channel.send('Your tag, ' + tagtitle + ', has been saved!'))

    }
        // Calling upon tag
        try {
            if (tagArgs[0] == 'call') {
                tags.findOne({tagName: tagArgs[1]}, function (err, tag) {
                    if (err) {
                        const errorembed = new Discord.MessageEmbed()
                        .setColor('#ff0000 ')
                        .setTitle('Error!')
                        .addFields(
                            { name: 'An error occured!', value: 'Please forward this to a developer (<@504196872706064415>)! ```' + err + "```" }
                        )
                        .setDescription('')
                        .setTimestamp()
                        .setFooter('Sentencia Bot');
                        msg.channel.send(errorembed)
                        
                    } else {
                        let tagObject = tag.toObject(); 
                        msg.channel.send(tagObject.tagContent)
                    }
                })
            }
        } catch (err) {
            const errorembed = new Discord.MessageEmbed()
            .setColor('#ff0000 ')
            .setTitle('Error!')
            .addFields(
                { name: 'An error occured!', value: 'Please forward this to a developer (<@504196872706064415>)! ```' + err + "```" }
            )
            .setDescription('')
            .setTimestamp()
            .setFooter('Sentencia Bot');
            msg.channel.send(errorembed)
        }

        // Delete tag



}});


client.login(process.env.TOKEN); // Gets token from .env file (the last bit is the variable within .env)
