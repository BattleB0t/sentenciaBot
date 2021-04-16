// Packages
require('dotenv').config() // .env file configuration
const Discord = require('discord.js'); //
const Hypixel = require('hypixel');
let prefix = 's!'; // Prefix for bot
const MojangAPI = require('mojang-api');
const axios = require('axios');
const mongoose = require('mongoose');
const sb = require('hy-profile')
const sbApi = require('hypixel-api-wrapper');
const hypixelClient = new Hypixel({ key: process.env.HYPIXELKEY})
const client = new Discord.Client();
sbApi.setKey(process.env.HYPIXELKEY)


// Importing other files (functions, api fetching etc.)

// Variables
const sentencia_id = "5f9c9c7a8ea8c992ddb8cd67"
let err = "";
let num = 0;
// reaction variables
const giveawayreaction = '<a:giveaway:831469774302740540>';
const eventreaction = '<a:events:831469773602160702>';
const announcementreaction = '<:announcement:831469769571434537>';
const susreaction = '<a:SUS:831469774042300447>';

 // Mongoose variables
 mongoose.connect("mongodb+srv://Admin-Arahan:yvycdvf5cnkoqdB7@tagdb.leypg.mongodb.net/tagDB?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false});
mongoose.set("useCreateIndex", true);

const tagSchema = new mongoose.Schema ({
    tagName: String,
    tagContent: String
  });

const tags = new mongoose.model("Tags", tagSchema);

// Embeds


const tagHelp = new Discord.MessageEmbed()
            .setColor('#ED820E ')
            .setTitle('Tag Help')
            .setDescription('Here are all valid commands')
            .addFields(
                { name: 's!tag new (tag name) (tag content)', value: 'Creates a new tag' },
                { name: 's!tag call (tag name)', value: 'Calls the tag name' },
                { name: 's!tag edit (tag name) (edited tag content)', value: 'Edits your tag' },
                { name: 's!tag (tag name)', value: 'Same as s!tag call, but just shorter' },
                { name: 's!tag all', value: 'Shows all tags' }
            )
            .setTimestamp()
            .setFooter('Sentencia Bot')


const unverifiedembed = new Discord.MessageEmbed()
.setColor('#ff0000 ')
.setTitle('Incorrect username')
.setDescription("The username's discord you provided does not match with your own.")
.addFields(
    { name: 'Take a look at our verify help guide', value: 'Type "verify help" for the guide!' }
)
.setTimestamp()
.setFooter('Sentencia Bot • Incorrect Username');



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
        if (!msg.member.roles.cache.some((role) => role.name === '★ Developer')) {
            msg.channel.send('Invalid Permissions. I see you lmao')
        } else {
            try {
                const code = args.join(" ");
                let evaled = eval(code);
        
                if (typeof evaled !== "string")
                    evaled = require("util").inspect(evaled);
            } catch (err) {
            msg.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
            }
        }

    }
    
});

client.on("message", msg => {
    if (msg.content == prefix + 'restart') {
        if (!msg.member.roles.cache.some((role) => role.name === '★ Developer')) {
            msg.channel.send('Invalid Permissions.')
        } else {
            msg.channel.send('Restarting...')
            .then(setTimeout(() => process.exit(1), 2000)) // requires PM2 to restart
           };  
        }
  
});

client.on("message", msg => {
    if (msg.content == prefix + 'stop') {
        if (!msg.member.roles.cache.some((role) => role.name === '★ Developer')) {
            msg.channel.send('Insufficient Perms.')
        } else {
            msg.channel.send('Stopping bot...')
            .then(setTimeout(() => process.exit(1), 2000))
        }

    }
})


/// Main commands

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
    let authorID = msg.author.id
    const { guild } = msg;
    const verifiedRole = guild.roles.cache.find((role => role.name == 'Hypixel Verified'));
    const sentenciaRole = guild.roles.cache.find((role => role.name == 'Sentencia Member'));
    const member = guild.members.cache.get(authorID);
    if (msg.content.startsWith(prefix + 'verify')) {
        MojangAPI.nameToUuid(username, function(err, result) {
            if (err) {

            } else {
                try {       
                    axios.get("https://api.hypixel.net/player?key=" + process.env.HYPIXELKEY +  "&uuid=" + result[0].id)
                    .then(res => {
                    if (res.data.player == null) {
                        msg.channel.send('Invalid Username!')
                    } else {
                        hypixelClient.findGuildByPlayer(result[0].id, (err, guildId) => { 
                            if (msg.author.tag == res.data.player.socialMedia.links.DISCORD) {
                                hypixelClient.getGuild(guildId, (err, guildinfo) => {
                                const verifyembed = new Discord.MessageEmbed()
                                .setColor('#00ff10 ')
                                .setTitle('Succesfully Verified!')
                                .setThumbnail('https://crafatar.com/avatars/' + result[0].id)
                                .setDescription("You're now verified as `" + res.data.player.displayname + '` \n In the guild `' +  guildinfo.name + '`')
                                .setTimestamp()
                                .setFooter('Sentencia Bot');
    
                                msg.channel.send(verifyembed)
                                member.roles.add(verifiedRole)
                                member.setNickname(res.data.player.displayname);
                                // msg.channel.send('**To verify your Discord account on our server, you must have it linked to Hypixel in the game, if you have it linked please use this command:**```s!verify username```')
                                })
                            } else {
                                msg.channel.send(unverifiedembed)
        
                            }
    
                            if (guildId == sentencia_id) {
                                member.roles.add(sentenciaRole)
                            }
                            
                        });
                        
                    }

                })
                    .catch(err => {
                        const errorembed = new Discord.MessageEmbed()
                        .setColor('#ff0000 ')
                        .setTitle('Error!')
                        .addFields(
                            { name: 'An error occured!', value: 'Please forward this to a developer (<@504196872706064415>)! ```' + err + "```" }
                        )
                        .setDescription('')
                        .setTimestamp()
                        .setFooter('Sentencia Bot • Error Handling');
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
                    .setFooter('Sentencia Bot • Error Handling');
                    msg.channel.send(errorembed)
                }


            }
        });

    }
})

client.on("message", msg => {
    const { guild } = msg;
    const verifiedRole = guild.roles.cache.find((role => role.name == 'Hypixel Verified'));
    const sentenciaRole = guild.roles.cache.find((role => role.name == 'Guild: Sentencia Eternal'));
    const member = guild.members.cache.get(msg.author.id);
    if (msg.content.startsWith(prefix + 'unverify')) {
        member.setNickname(msg.author.username)
        .catch(err => msg.channel.send('An error occured! Please forward this to your local developer `' + err + '`'))
        member.roles.remove(verifiedRole)
        .then(member.roles.remove(sentenciaRole))
        .then(msg.channel.send('Succesfully unverified. Please re-verify yourself.'))
        .catch(err => msg.channel.send('An error occured! Please forward this to your local developer `' + err + '`'))
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
            const newTag = new tags({
                tagName: tagtitle,
                tagContent: tagcontent
            })
            newTag.save()
            .then(msg.channel.send('Your tag, ' + tagtitle + ', has been saved!'))

    } else if (tagArgs[0] == 'call') {
            tags.findOne({tagName: tagArgs[1]}, function (err, tag) {
                if (err) {

                    msg.channel.send(errorembed)
                    
                } else {
                    if (tag == null) {
                        msg.channel.send('This tag does not exist!')
                    } else {
                        let tagObject = tag.toObject(); 
                        msg.channel.send(tagObject.tagContent)
                        msg.delete(msg)
                    }
                }
            })
        } else if (tagArgs[0] == 'delete') {
            tags.deleteOne({tagName: tagArgs[1]}, function (err, tag) {
                if (err) {
                    msg.channel.send(errorembed)
                } else {
                    msg.channel.send('Deleted the tag!')
                }
            })
        } else if (tagArgs[0] == 'all') {
            tags.find().lean()
            .then(docs => {
                num = 0;
                let allTagsembed = new Discord.MessageEmbed()
                .setColor('#00ff10 ')
                .setTitle('All Tags')
                for (amountoftags in docs) {
                    let tagname = JSON.stringify(docs[num].tagName);
                    tagname = tagname.substring(1,tagname.length-1)
                    allTagsembed.addFields(
                        {name: tagname,value: 'Tag #' + num}
                    )
                    num = num + 1
                }
                allTagsembed.setTimestamp()
                allTagsembed.setFooter('Sentencia Bot');       
                msg.channel.send(allTagsembed)
            
            })

            .catch(err => {errorembed = new Discord.MessageEmbed()
            .setColor('#ff0000 ')
            .setTitle('Error!')
            .addFields(
                { name: 'An error occured!', value: 'Please forward this to a developer (<@504196872706064415>)! ```' + err + "```" }
            )
            .setDescription('')
            .setTimestamp()
            .setFooter('Sentencia Bot • Error Handling');
            msg.channel.send(errorembed)})

        } else if (tagArgs[0] == 'edit'){
            tags.findOneAndUpdate({ tagName: tagArgs[1] }, { tagContent: tagArgs[2]})
            .then(docs => {
                if (docs == null) {
                    msg.channel.send('This tag does not exist!')
                } else {
                    msg.channel.send('Updated ' + tagArgs[1] + '!')
                }

                
        })
            .catch(err => {errorembed = new Discord.MessageEmbed()
            .setColor('#ff0000 ')
            .setTitle('Error!')
            .addFields(
                { name: 'An error occured!', value: 'Please forward this to a developer (<@504196872706064415>)! ```' + err + "```" }
            )
            .setDescription('')
            .setTimestamp()
            .setFooter('Sentencia Bot • Error Handling')
            msg.channel.send(errorembed)})
        } else if (tagArgs == '') {
            msg.channel.send(tagHelp)
            
            
        } else {
            let hasDoneBefore = false;
            if (hasDoneBefore == false) {
                msg.channel.send('s!tag call ' + tagArgs[0])
                .then(msg.delete(msg))
            };
        }




}});




// QoL commands

client.on('message', msg => {
    const roledmember = msg.content.split(" ").slice(1);
    const { guild } = msg;
    const sentenciaRole = guild.roles.cache.find((role => role.name == 'Sentencia Member'));
    const member = guild.members.cache.get(msg.author.id)
    let rMember =
    msg.mentions.members.first() || // `.first()` is a function.
    msg.guild.members.cache.find((member) => member.user.tag === roledmember) ||
    msg.guild.members;
    try {
        if (msg.content.startsWith(prefix + 'guildrole')){
            if (msg.member.roles.cache.has('830600208760176701')) {
                rMember.roles.add(sentenciaRole)
                .then(msg.channel.send('Added role succesfully!'))
                .catch(err => msg.channel.send('We have an error! ' + err))
            } else {
                msg.channel.send('Invalid permissions. I see you ;)')
            }
        }
    } catch (err) {
        const errorembed = new Discord.MessageEmbed()
        .setColor('#ff0000')
        .setTitle('Error!')
        .addFields(
            { name: 'An error occured!', value: 'Please forward this to a developer (<@504196872706064415>)! ```' + err + "```" }
        )
        .setDescription('')
        .setTimestamp()
        .setFooter('Sentencia Bot • Error Handling');
        msg.channel.send(errorembed) 
    }
   
});

// Requirement command

client.on("message", msg => {
    const username = msg.content.split(" ").slice(1);
    if (msg.content.startsWith(prefix + 'greq')) {
        MojangAPI.nameToUuid(username, function(err, result) {
            sb.getProfiles(result[0].id, process.env.HYPIXELKEY)
            .then(res => {
                console.log(res.a6cbde05853a419a87066050db83f492)

            })
            .catch(err => console.log(err))
        })

    }
});

// WIP Commands

// Auto Role



// client.on("message", msg => {
//     if (msg.content == prefix + 'autorole') {
//         msg.channel.send('React with an emoji to get the corresponding roles! The roles in order: Announcement Ping, Giveaway Ping, Event Ping, sus (hover over reactions if unsure)')
//         .then(msg => {
//             msg.react(announcementreaction)
//             msg.react(giveawayreaction)
//             msg.react(eventreaction)
//             msg.react(susreaction)
//         })
//         const reactionfilter = (reaction, user) => (reaction.emoji.name == announcementreaction || reaction.emoji.name == giveawayreaction || reaction.emoji.name == eventreaction || reaction.emoji.name == susreaction)
//         msg.awaitReactions(reactionfilter, {time: 10000})
//         .then(reactions => {
//             console.log(reactions)
//         })
//     } 
// })









client.login(process.env.TOKEN); // Gets token from .env file (the last bit is the variable within .env)
