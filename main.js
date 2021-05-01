// Packages
require('dotenv').config() // .env file configuration
const Discord = require('discord.js'); //
const Hypixel = require('hypixel');
const hyp = require('hy-profile')
let prefix = 's!'; // Prefix for bot
const MojangAPI = require('mojang-api');
const axios = require('axios');
const mongoose = require('mongoose');
const sbApi = require('hypixel-api-wrapper');
const hypixelClient = new Hypixel({ key: process.env.HYPIXELKEY})
const paginationEmbed = require('discord.js-pagination');
require('events').EventEmitter.defaultMaxListeners = 20;
const client = new Discord.Client();
const { Client, getSkyBlockProfileMemberSkills} = require("@zikeji/hypixel");
const sbclient = new Client(process.env.HYPIXELKEY);
sbApi.setKey(process.env.HYPIXELKEY)

client.snipes = new Map();


// Importing other files (functions, api fetching etc.)
const {tagHelp,guildroleHelp,verifyHelp,succesfullyunverifiedembed,wrongusername,alreadyverifiedembed,greqHelp,syncHelp,suggesstionHelp} = require('./variables/embeds.js');





// Variables
const sentencia_id = "5f9c9c7a8ea8c992ddb8cd67"
const inferior_id = "5ec3449f8ea8c93479da1423"
const legend_id = "6085b5f78ea8c9849e3f89d7"
let err = "";
let inGuild = true;
let num = 0;
let guildname = '';
let hasdone = false;
let sugnum = 0;

// reaction variables
const giveawayreaction = '<a:giveaway:831469774302740540>';
const eventreaction = '<a:events:831469773602160702>';
const announcementreaction = '<:announcement:831469769571434537>';
const susreaction = '<a:SUS:831469774042300447>';


 // Mongoose variables


mongoose.connect("mongodb+srv://Admin-Arahan:" + process.env.MONGOKEY + "@tagdb.leypg.mongodb.net/tagDB?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false});

// mongoose.connect("mongodb://localhost:27017/tagDB", { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false});
mongoose.set("useCreateIndex", true);

const tagSchema = new mongoose.Schema ({
    tagName: String,
    tagContent: String
  });

const tags = new mongoose.model("Tags", tagSchema);

const suggestionSchema = new mongoose.Schema ({
    suggestionnum: Number,
    suggestion: String,
    msgid: String
})

const suggestions = new mongoose.model('Suggestions', suggestionSchema)

// Functions

async function greq(membersChosen, res, profilenum) {
    let reachesCata = '✅'
    let reachesSlayer = '✅'
    let reachesSkill = '✅'
    let cata = membersChosen.dungeons.dungeon_types.catacombs.experience
    let slayer = membersChosen.slayer.zombie.xp + membersChosen.slayer.spider.xp + membersChosen.slayer.wolf.xp
    try {
        let skills = membersChosen.skills.combat.level + membersChosen.skills.mining.level + membersChosen.skills.alchemy.level + membersChosen.skills.farming.level + membersChosen.skills.taming.level + membersChosen.skills.enchanting.level + membersChosen.skills.fishing.level + membersChosen.skills.foraging.level
        skills = skills / 8
        if (skills < 26) {
            reachesSkill = '❌'
        }
    } catch (e) {
        let skills = 0
        reachesSkill = '❌'
    }

    if (cata == '') {
        reachesCata = '❌'
    } else if (cata == undefined) {
        reachesCata = '❌'
    }
    if (cata < 70040) {
        reachesCata = '❌'
    } 
    if (slayer < 60000){
        reachesSlayer = '❌'
    }

    let eternalReqsEmbed = new Discord.MessageEmbed()
    .setColor('#ED820E ')
    .setTitle(`Does ${membersChosen.player.username} meet the requirements?`)
    .setDescription('')
    .addFields(
        { name: '26+ Skill Average', value: reachesSkill, inline: true },
        { name: '60k+ Slayer XP', value: reachesSlayer, inline: true },
        { name: 'Catacombs level 18+', value: reachesCata, inline: true},
        { name: 'Profile: ', value: res.data.cute_name, inline: true}
        // ✅ ❌
    )
    .setTimestamp()
    .setThumbnail('https://cdn.discordapp.com/attachments/832714326258614326/834808899717955584/SENTENCIA.png')
    .setFooter('Sentencia Bot', 'https://cdn.discordapp.com/attachments/832714326258614326/834808899717955584/SENTENCIA.png')
    return eternalReqsEmbed;


    
}

// Main code
client.on('ready', () => {
    client.user.setActivity('s!verify', { type: 'WATCHING' })
    .then(presence => console.log(`Activity set to ${presence.activities[0].name}`))
    console.log(`Bot connected as ${client.user.username}#${client.user.discriminator} with the id of ${client.user.id}`)
}) // Misc stuff, settings RPC.



// Developer commands 

const clean = text => {
    if (typeof(text) === "string")
      return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
        return text;
  }




client.on("message", msg => {
    let args = msg.content.split(" ").slice(1);
    args = args.map(args => args.toLowerCase())
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
            .then(setTimeout(() => process.exit(0), 2000))
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
        .setAuthor('SENTENCIA | Skyblock Guild')
        .setThumbnail('https://cdn.discordapp.com/attachments/832714326258614326/834808899717955584/SENTENCIA.png')
        .addFields(
            { name: 'Step 1', value: 'Log into Hypixel' },
            { name: 'Step 2', value: 'Open your Profile, which is the second slot with your skin head and right click.' },
            { name: 'Step 3', value: 'Click Social, which is the twitter icon (above the diamond).' },
            { name: 'Step 4', value: 'Hover over the discord icon and left click' },
            { name: 'Step 5', value: 'Go back to discord and copy your name and discriminator (yours is ' + msg.author.tag + ') and paste that into all chat (/ac or /chat all)'},
            { name: 'Step 6', value: 'Go back and try to verify again using ' + prefix + 'verify!' },
            { name: 'Video tutorial', value: 'Click [here](https://www.youtube.com/watch?v=ll00q-1jyI8) to see the tutorial'}
        )
        .setTimestamp()
        .setFooter('Sentencia Bot', 'https://cdn.discordapp.com/attachments/832714326258614326/834808899717955584/SENTENCIA.png');
        msg.channel.send(verifyhelp)
    };

})

client.on("message", msg => {
    let username = msg.content.split(" ").slice(1);
    username = username.map(args => args.toLowerCase())
    let authorID = msg.author.id
    const { guild } = msg;
    const verifiedRole = guild.roles.cache.find((role => role.id == '830185985400373278'));
    const sentenciaRole = guild.roles.cache.find((role => role.id == '829850153476816907'));
    const legendrole = guild.roles.cache.find((role => role.id === '835968069741838357'))
    const inferiorrole = guild.roles.cache.find((role => role.id === '833538348135481344'));
    const viprole = guild.roles.cache.find((role => role.id == '830219786196746241'));
    const vipplusrole = guild.roles.cache.find((role => role.id == '830219785689104434'));
    const mvprole = guild.roles.cache.find((role => role.id == '830219785089450014'));
    const mvpplusrole = guild.roles.cache.find((role => role.id == '830219784506703922'));
    const mvpplusplusrole = guild.roles.cache.find((role => role.id == '830219784020033596'));
    const member = guild.members.cache.get(authorID);
    if (msg.content.startsWith(prefix + 'verify')) {
        if (username == '') {
            msg.channel.send(verifyHelp)
        } else if (username == undefined) {
            msg.channel.send(verifyHelp)
        } else if (username[0] == 'help'){
            msg.channel.send(verifyHelp)
        }else {
            MojangAPI.nameToUuid(username, function(err, result) {
                if (err) {
                    const errorembed = new Discord.MessageEmbed()
                    .setColor('#ff0000 ')
                    .setTitle('Error!')
                    .setAuthor('SENTENCIA | Skyblock Guild')
                    .setThumbnail('https://cdn.discordapp.com/attachments/832714326258614326/834808899717955584/SENTENCIA.png')
                    .addFields(
                        { name: 'An error occured!', value: 'Please forward this to a developer (<@504196872706064415>)! ```' + err + "```" }
                    )
                    .setDescription('')
                    .setTimestamp()
                    .setFooter('Sentencia Bot • Error Handling', 'https://cdn.discordapp.com/attachments/832714326258614326/834808899717955584/SENTENCIA.png');
                    msg.channel.send(errorembed)
                } else if (result == '') {
                    msg.channel.send(wrongusername)
                } else {
                    if (msg.member.roles.cache.some((role) => role.id === '830185985400373278')){ 
                        msg.channel.send(alreadyverifiedembed)
                    } else {
                            axios.get("https://api.hypixel.net/player?key=" + process.env.HYPIXELKEY +  "&uuid=" + result[0].id)
                            .then(res => {
                            if (res.data.player == null) {
                                msg.channel.send(wrongusername)
                            } else if (res == ''){
                                msg.channel.send(wrongusername)
                            } else if (res.data.player.socialMedia == undefined){
                                const unmatchingembed = new Discord.MessageEmbed()
                                .setColor('#ff0000 ')
                                .setAuthor('SENTENCIA | Skyblock Guild')
                                .setThumbnail('https://cdn.discordapp.com/attachments/832714326258614326/834808899717955584/SENTENCIA.png')
                                .setTitle("You haven't linked!")
                                .setDescription("Your discord tag doesn't match with your in game tag!")
                                .addFields(
                                    { name: `Your tag: ${msg.author.tag}`, value: 'The one you set: `None Set!`' },
                                    { name: 'Take a look at our guide!', value: 'Type verify help'}
                                )
                                .setTimestamp()
                                .setFooter('Sentencia Bot • Invalid Username', 'https://cdn.discordapp.com/attachments/832714326258614326/834808899717955584/SENTENCIA.png');
                                msg.channel.send(unmatchingembed)
                            }else {
                                hypixelClient.findGuildByPlayer(result[0].id, (err, guildId) => {
                                    guildname = '';
                                    inGuild = true
                                    if (guildId == null) {
                                        inGuild = false
                                        guildname = 'none'
                                    }
                                    if (msg.author.tag == res.data.player.socialMedia.links.DISCORD) {
                                        hypixelClient.getGuild(guildId, (err, guildinfo) => {
                                            if (guildinfo == null) {
                                                inGuild = false
                                                guildname = 'none'
                                            }
                                            if (inGuild == true) {
                                                guildname = guildinfo.name
                                                axios.get('https://api.slothpixel.me/api/players/' + username[0])
                                                .then(res => {
                                                    let rank = res.data.rank
                                                    if (rank == 'VIP') {
                                                        member.roles.add(viprole)
                                                    } else if (rank == 'VIP_PLUS') {
                                                        member.roles.add(vipplusrole)
                                                    } else if (rank == 'MVP') {
                                                        member.roles.add(mvprole)
                                                    } else if (rank == 'MVP_PLUS') {
                                                        member.roles.add(mvpplusrole)
                                                    } else if (rank == 'MVP_PLUS_PLUS') {
                                                        member.roles.add(mvpplusplusrole)
                                                    } 
                                                })
                                                const verifyembed = new Discord.MessageEmbed()
                                                .setColor('#00ff10 ')
                                                .setAuthor('SENTENCIA | Skyblock Guild')
                                                .setTitle('Succesfully Verified!')
                                                .setThumbnail('https://crafatar.com/avatars/' + result[0].id)
                                                .setDescription("You're now verified as `" + res.data.player.displayname + '` \n In the guild `' +  guildname + '`')
                                                .setTimestamp()
                                                .setFooter('Sentencia Bot', 'https://cdn.discordapp.com/attachments/832714326258614326/834808899717955584/SENTENCIA.png');
                
                                                msg.channel.send(verifyembed)
                                                member.roles.add(verifiedRole)
                                                member.setNickname(res.data.player.displayname);
                                            } else {
                                                axios.get('https://api.slothpixel.me/api/players/' + username[0])
                                                .then(res => {
                                                    let rank = res.data.rank
                                                    if (rank == 'VIP') {
                                                        member.roles.add(viprole)
                                                    } else if (rank == 'VIP+') {
                                                        member.roles.add(vipplusrole)

                                                    } else if (rank == 'MVP') {
                                                        member.roles.add(mvprole)
                                                        
                                                    } else if (rank == 'MVP+') {
                                                        member.roles.add(mvpplusrole)
                                                    } else if (rank == 'MVP++') {
                                                        member.roles.add(mvpplusplusrole)
                                                    } 
                                                })
                                                const verifyembed = new Discord.MessageEmbed()
                                                .setColor('#00ff10 ')
                                                .setAuthor('SENTENCIA | Skyblock Guild')
                                                .setTitle('Succesfully Verified!')
                                                .setThumbnail('https://crafatar.com/avatars/' + result[0].id)
                                                .setDescription("You're now verified as `" + res.data.player.displayname + '` \n In the guild `' +  guildname + '`')
                                                .setTimestamp()
                                                .setFooter('Sentencia Bot', 'https://cdn.discordapp.com/attachments/832714326258614326/834808899717955584/SENTENCIA.png');
                
                                                msg.channel.send(verifyembed)
                                                member.roles.add(verifiedRole)
                                                member.setNickname(res.data.player.displayname);
                                            }
                                            // msg.channel.send('**To verify your Discord account on our server, you must have it linked to Hypixel in the game, if you have it linked please use this command:**```s!verify username```')
                                            })
    
                            
                                    } else {
                                        let setDiscord = res.data.player.socialMedia.links.DISCORD
                                        if (res.data.player.socialMedia.links.DISCORD == undefined) {
                                            setDiscord = 'None set!'
                                        }
                                        const unmatchingembed = new Discord.MessageEmbed()
                                        .setColor('#ff0000 ')
                                        .setAuthor('SENTENCIA | Skyblock Guild')
                                        .setThumbnail('https://cdn.discordapp.com/attachments/832714326258614326/834808899717955584/SENTENCIA.png')
                                        .setTitle("You haven't linked!")
                                        .setDescription("Your discord tag doesn't match with your in game tag!")
                                        .addFields(
                                            { name: `Your tag: ${msg.author.tag}`, value: 'The one you set: `' + setDiscord + '`' },
                                            { name: 'Take a look at our guide!', value: 'Type verify help'}
                                        )
                                        .setTimestamp()
                                        .setFooter('Sentencia Bot • Invalid Username', 'https://cdn.discordapp.com/attachments/832714326258614326/834808899717955584/SENTENCIA.png');
                                        msg.channel.send(unmatchingembed)
        
                                    }
        
                                    if (guildId == sentencia_id) {
                                        member.roles.add(sentenciaRole)
                                    } else if (guildId == inferior_id) {
                                        member.roles.add(inferiorrole)
                                    } else if (guildId == legend_id) {
                                        member.roles.add(legendrole)
                                    }
        
                                });
        
                            }
        
                        })  .catch(err => {
                            const errorembed = new Discord.MessageEmbed()
                            .setColor('#ff0000 ')
                            .setTitle('Error!')
                            .setAuthor('SENTENCIA | Skyblock Guild')
                            .setThumbnail('https://cdn.discordapp.com/attachments/832714326258614326/834808899717955584/SENTENCIA.png')
                            .addFields(
                                { name: 'An error occured!', value: 'Please forward this to a developer (<@504196872706064415>)! ```' + err + "```" }
                            )
                            .setDescription('')
                            .setTimestamp()
                            .setFooter('Sentencia Bot • Error Handling', 'https://cdn.discordapp.com/attachments/832714326258614326/834808899717955584/SENTENCIA.png');
                            msg.channel.send(errorembed)})
        
    
    
                    }
                }
            });
        }

    }
})

client.on("message", msg => {
    const { guild } = msg;
    const verifiedRole = guild.roles.cache.find((role => role.name == 'Hypixel Verified'));
    const sentenciaRole = guild.roles.cache.find((role => role.name == 'Sentencia Eternal'));
    const inferiorrole = guild.roles.cache.find((role => role.id === '833538348135481344'))
    const member = guild.members.cache.get(msg.author.id);
    if (msg.content.startsWith(prefix + 'unverify')) {
        member.setNickname(msg.author.username)
        .catch(err => msg.channel.send('An error occured! Please forward this to your local developer `' + err + '`'))
        member.roles.remove(verifiedRole)
        .then(member.roles.remove(sentenciaRole))
        .then(member.roles.remove(inferiorrole))
        .then(msg.channel.send(succesfullyunverifiedembed))
        .catch(err => msg.channel.send('An error occured! Please forward this to your local developer `' + err + '`'))
    }
})


// Tag system

client.on('message', msg => {
    let tagArgs = msg.content.split(" ").slice(1);
    // tagArgs = tagArgs.map(args => args[0].toLowerCase())
    if (msg.content.startsWith(prefix + 'tag')) {
        // New tag
        if (msg.member.roles.cache.has('812691760425598986')) {
            if (tagArgs[0] == 'new') {
                let tagtitlesplit = tagArgs.slice(1,2);
                let tagcontentsplit = tagArgs.slice(2);
                let tagcontent = tagcontentsplit.join(' ')
                let tagtitle = tagtitlesplit.join(' ')
                const newTag = new tags({
                    tagName: tagtitle,
                    tagContent: tagcontent
                })

                if (tags.exists({tagName: tagtitle}, function(err, result){
                    if (result == false) {

                        if (tagcontent == '') {
                            msg.channel.send("Please enter your tag's content!")
                        } else {
                            newTag.save()
                            .then(msg.channel.send('Your tag, ' + tagtitle + ', has been saved!'))
                        }
                        
                    } else {
                        msg.channel.send('This tag already exists!')
                    }
                }))
                if (tagcontent == '') {
                    msg.channel.send("Please enter your tag's content!")
                }
    
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
                    } else if (tag.n == 0) {
                        msg.channel.send(`${tagArgs[1]} already does not exist!`)
                    }else {
                        msg.delete(msg)
                        msg.channel.send(`${msg.author.username} has deleted the tag ${tagArgs[1]}!`)
                    }
                })
            } else if (tagArgs[0] == 'all') {
                tags.find().lean()
                .then(docs => {
                    num = 0;
                    let allTagsembed = new Discord.MessageEmbed()
                    .setColor('#00ff10 ')
                    .setTitle('All Tags')
                    .setAuthor('SENTENCIA | Skyblock Guild')
                    .setThumbnail('https://cdn.discordapp.com/attachments/832714326258614326/834808899717955584/SENTENCIA.png')
                    for (amountoftags in docs) {
                        let tagname = JSON.stringify(docs[num].tagName);
                        tagname = tagname.substring(1,tagname.length-1)
                        allTagsembed.addFields(
                            {name: tagname,value: 'Tag #' + num}
                        )
                        num = num + 1
                    }
                    allTagsembed.setTimestamp()
                    allTagsembed.setFooter('Sentencia Bot', 'https://cdn.discordapp.com/attachments/832714326258614326/834808899717955584/SENTENCIA.png');
                    msg.channel.send(allTagsembed)
    
                })
    
                .catch(err => {errorembed = new Discord.MessageEmbed()
                .setColor('#ff0000 ')
                .setTitle('Error!')
                .setAuthor('SENTENCIA | Skyblock Guild')
                .setThumbnail('https://cdn.discordapp.com/attachments/832714326258614326/834808899717955584/SENTENCIA.png')
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
                .setAuthor('SENTENCIA | Skyblock Guild')
                .setThumbnail('https://cdn.discordapp.com/attachments/832714326258614326/834808899717955584/SENTENCIA.png')
                .addFields(
                    { name: 'An error occured!', value: 'Please forward this to a developer (<@504196872706064415>)! ```' + err + "```" }
                )
                .setDescription('')
                .setTimestamp()
                .setFooter('Sentencia Bot • Error Handling', 'https://cdn.discordapp.com/attachments/832714326258614326/834808899717955584/SENTENCIA.png')
                msg.channel.send(errorembed)})
            } else if (tagArgs == '') {
                msg.channel.send(tagHelp)
    
    
            } else if (tagArgs[0] == 'help') {
                msg.channel.send(tagHelp)
            }else {
                tags.findOne({tagName: tagArgs[0]}, function(err, result) {
                    if (result == null) {
                        msg.channel.send('This tag does not exist!')
                    } else {
                        msg.channel.send(result.tagContent)
                        msg.delete(msg)
                        .catch(err => {
                            msg.channel.send('An error has occured! ' + err)
                        })
                    }
                })
            }


        } else {
            msg.channel.send('Tag System can only be used by Guild Admins!')
        }
        




}});

// Grq command

// Requirement command

// client.on("message", msg => {
//     let username = msg.content.split(" ").slice(1);
//     if (msg.content.startsWith(prefix + 'greq')) {
//         if (username[1] == '') {
//             msg.channel.send(greqHelp)
//         } else if (username[0] == '') {
//             msg.channel.send(greqHelp)
//         } else if (username == '') {
//             msg.channel.send(greqHelp)
//         } else {
//             MojangAPI.nameToUuid(username, function(err, result) {
//                 if (result == '') {
//                     msg.channel.send('This user does not exist!')
//                 } else {
//                     axios.get('https://api.slothpixel.me/api/skyblock/profile/' + result[0].id)
//                     .then(res => {
//                         axios.get('https://sky.shiiyu.moe/api/v2/profile/' + result[0].id)
//                         .then(resu => {
//                             let profilename = ''
//                             if (username[1] == '') {
//                                 profilename = ''
//                             } else {
//                                 profilename = username[1]
//                             }
        
//                             axios.get(`https://api.slothpixel.me/api/skyblock/profile/${result[0].id}/${profilename}`)
//                             .then(profileres => {
//                                 const profileid = profileres.id
//                                 axios.get('https://sky.shiiyu.moe/api/v2/profile/' + profileid)
//                                 .then(res => {
//                                     const prof = Object.values(res.data.profiles)[0]
//                                     // console.log(prof)
//                                     // let zombiexp = prof.raw.slayer_bosses.zombie.xp
//                                     // let taraxp = prof.raw.slayer_bosses.spider.xp
//                                     // let svenxp = prof.raw.slayer_bosses.wolf.xp
//                                     const slayerxp = prof.data.slayer_xp
//                                     let reachesSlayer = true;
//                                     let slayer = '✅'
//                                     if (slayerxp < 60000) {
//                                         reachesSlayer = false;
//                                         slayer = '❌'
//                                     }
//                                     // Dungeons now
//                                     const cataxp = prof.raw.dungeons.dungeon_types.catacombs.experience
//                                     let reachesCata = true;
//                                     let cata = '✅'
//                                     if (cataxp < 70040) {
//                                         reachesCata = false
//                                         cata = '❌'
//                                     }
//                                     const skill = prof.data.average_level_no_progress
//                                     // console.log(prof)
//                                     let reachesSkill = true;
//                                     skillav = '✅'
//                                     if (skill < 25) {
//                                         reachesSkill = false;
//                                         skillav = '❌'
//                                     }

//                                     // Checking if they have even reached the area

//                                     if (prof.raw.dungeons.dungeon_types.catacombs == '') {
//                                         reachesCata = false;
//                                         cata = '❌';
//                                     }
//                                     let eternalReqsEmbed = new Discord.MessageEmbed()
//                                     .setColor('#ED820E ')
//                                     .setTitle(`Does ${prof.data.display_name} meet the requirements?`)
//                                     .setDescription('')
//                                     .addFields(
//                                         { name: '26+ Skill Average', value: skillav, inline: true },
//                                         { name: '60k+ Slayer XP', value: slayer, inline: true },
//                                         { name: 'Catacombs level 18+', value: cata, inline: true},
//                                         { name: 'Profile: ', value: prof.cute_name, inline: true}
//                                         // ✅ ❌
//                                     )
//                                     .setTimestamp()
//                                     .setThumbnail('https://cdn.discordapp.com/attachments/832714326258614326/834808899717955584/SENTENCIA.png')
//                                     .setFooter('Sentencia Bot', 'https://cdn.discordapp.com/attachments/832714326258614326/834808899717955584/SENTENCIA.png')
//                                     msg.channel.send(eternalReqsEmbed)
        
//                                 })
//                             .catch(error => msg.channel.send(error))
        
//                             })
//                             .catch(err => {
//                                 msg.channel.send(err)
//                             })
//                         })
        
                        
//                     })
//                     .catch(err => {
//                         if (err.response.status == 520) {
//                             msg.channel.send('There is an API error!')
//                         } else if (err.response.status == 524) {
//                             msg.channel.send('There is an API error!')
//                         }else {
//                             msg.channel.send('This user does not play skyblock!')

//                         }
//                     })
//                 }

//             })

//         }
        



//     }
// });

client.on("message", msg => {
    let username = msg.content.split(" ").slice(1);
    if (msg.content.startsWith(prefix + 'greq')) {
        let profilenum = 0;
        if (username[1] == '') {
            msg.channel.send(greqHelp)
        } else if (username[0] == '') {
            msg.channel.send(greqHelp)
        } else if (username == '') {
            msg.channel.send(greqHelp)
        } else {
            MojangAPI.nameToUuid(username, function(err, result) {
                if (result == '') {
                    msg.channel.send('This user does not exist!')
                } else {
                    let uuid = result[0].id
                    axios.get(`https://api.slothpixel.me/api/skyblock/profiles/${username}`) // Gets profiles to get the IDs
                    .then(profileids => {
                        let profile = Object.values(profileids.data)  // Gets the first profile ID
                        let allProfiles = Object.keys(profileids.data)
                        let chosenprofile = allProfiles[0]  // the choosing of profiles!!!
                        axios.get(`https://api.slothpixel.me/api/skyblock/profile/${username}/${chosenprofile}`)
                        .then(res => {
                            let members = res.data.members
                            let membersChosen = Object.values(members)[0]
                            if (membersChosen.uuid != uuid) {
                                membersChosen = Object.values(members)[1]
                                if (membersChosen.uuid != uuid) {
                                    membersChosen = Object.values(members)[2]
                                    if (membersChosen.uuid != uuid) {
                                        membersChosen = Object.values(members)[3]
                                        if (membersChosen.uuid != uuid) {
                                            membersChosen = Object.values(members)[4]
                                            if (membersChosen.uuid != uuid) {
                                                membersChosen = Object.values(members)[5]
                                            } else {
                                                greq(membersChosen, res, profilenum)
                                                .then(eternalReqsEmbed => msg.channel.send(eternalReqsEmbed))
                                                .then(message => {
                                                    message.react('🔄')
                                                    const filter = (reaction, user) => {
                                                        return reaction.emoji.name === '🔄' && user.id === msg.author.id;
                                                    };
                                                    
                                                    const collector = message.createReactionCollector(filter, { time: 15000 });
                                                    
                                                    collector.on('collect', (reaction, user) => {
                                                        profilenum = profilenum + 1
                                                        msg.channel.send('Change Profile logic')
                                                    });
                                                });
                                                
                                            }
                                        } else {
                                            greq(membersChosen, res, profilenum)
                                            .then(eternalReqsEmbed => msg.channel.send(eternalReqsEmbed))
                                            .then(message => {
                                                message.react('🔄')
                                                const filter = (reaction, user) => {
                                                    return reaction.emoji.name === '🔄' && user.id === msg.author.id;
                                                };
                                                
                                                const collector = message.createReactionCollector(filter, { time: 15000 });
                                                
                                                collector.on('collect', (reaction, user) => {
                                                    profilenum = profilenum + 1
                                                    msg.channel.send('Change Profile logic')
                                                });
                                            });
                                            
                                        }

                                    } else {
                                        greq(membersChosen, res, profilenum)
                                        .then(eternalReqsEmbed => msg.channel.send(eternalReqsEmbed))
                                        .then(message => {
                                            message.react('🔄')
                                            const filter = (reaction, user) => {
                                                return reaction.emoji.name === '🔄' && user.id === msg.author.id;
                                            };
                                            
                                            const collector = message.createReactionCollector(filter, { time: 15000 });
                                            
                                            collector.on('collect', (reaction, user) => {
                                                profilenum = profilenum + 1
                                                msg.channel.send('Change Profile logic')
                                            });
                                        });
                                    }
                                } else {
                                    greq(membersChosen, res, profilenum)
                                    .then(eternalReqsEmbed => msg.channel.send(eternalReqsEmbed))
                                    .then(message => {
                                        message.react('🔄')
                                        const filter = (reaction, user) => {
                                            return reaction.emoji.name === '🔄' && user.id === msg.author.id;
                                        };
                                        
                                        const collector = message.createReactionCollector(filter, { time: 15000 });
                                        
                                        collector.on('collect', (reaction, user) => {
                                            profilenum = profilenum + 1
                                            msg.channel.send('Change Profile logic')
                                        });
                                    });

                                    
                                }
                            } else {
                                greq(membersChosen, res, profilenum)
                                    .then(eternalReqsEmbed => msg.channel.send(eternalReqsEmbed))
                                    .then(message => {
                                        message.react('🔄')
                                        const filter = (reaction, user) => {
                                            return reaction.emoji.name === '🔄' && user.id === msg.author.id;
                                        };
                                        
                                        const collector = message.createReactionCollector(filter, { time: 15000 });
                                        
                                        collector.on('collect', (reaction, user) => {
                                            profilenum = profilenum + 1
                                            greq(membersChosen, res, profilenum)
                                            .then(eternalReqsEmbed => msg.channel.send(eternalReqsEmbed))
                                            .then(message => {
                                                message.react('🔄')
                                                const filter = (reaction, user) => {
                                                    return reaction.emoji.name === '🔄' && user.id === msg.author.id;
                                                };
                                                
                                                const collector = message.createReactionCollector(filter, { time: 15000 });
                                                
                                                collector.on('collect', (reaction, user) => {
                                                    profilenum = profilenum + 1
                                                    greq(membersChosen, res, profilenum)
                                                    .then(eternalReqsEmbed => msg.channel.send(eternalReqsEmbed))
                                                    .then(message => {
                                                        message.react('🔄')
                                                        const filter = (reaction, user) => {
                                                            return reaction.emoji.name === '🔄' && user.id === msg.author.id;
                                                        };
                                                        
                                                        const collector = message.createReactionCollector(filter, { time: 15000 });
                                                        
                                                        collector.on('collect', (reaction, user) => {
                                                            profilenum = profilenum + 1
                                                            greq(membersChosen, res, profilenum)
                                                            .then(eternalReqsEmbed => msg.channel.send(eternalReqsEmbed))
                                                            .then(message => {
                                                                message.react('🔄')
                                                                const filter = (reaction, user) => {
                                                                    return reaction.emoji.name === '🔄' && user.id === msg.author.id;
                                                                };
                                                                
                                                                const collector = message.createReactionCollector(filter, { time: 15000 });
                                                                
                                                                collector.on('collect', (reaction, user) => {
                                                                    profilenum = profilenum + 1
                                                                    msg.channel.send('Change Profile logic')
                                                                });
                                                            });
                                                            msg.channel.send('Change Profile logic')
                                                        });
                                                    });

                                                    msg.channel.send('Change Profile logic')
                                                });
                                            });
                                            msg.channel.send('Change Profile logic')
                                        });
                                    });
                                
                            }


                        })

                    })

                }});
            };
        



    }
});


// Guildrole Command

client.on('message', msg => {
    let args = msg.content.split(" ").slice(1);
    args = args.map(arg => arg.toLowerCase())
    const { guild } = msg;
    const sentenciaRole = guild.roles.cache.find((role => role.name == 'Sentencia Eternal'));
    const inferiorrole = guild.roles.cache.find((role => role.id === '833538348135481344'));
    const legendrole = guild.roles.cache.find((role => role.id === '835968069741838357'))
    const member = guild.members.cache.get(msg.author.id)
    let rMember =
    msg.mentions.members.first() // `.first()` is a function.
    try {
        if (msg.content.startsWith(prefix + 'guildrole')){
            if (args[0] == 'e') {
                if (msg.member.roles.cache.has('830600208760176701')) {
                    if (msg.member.roles.cache.has(legendrole)) { 
                        msg.roles.remove(legendrole)
                    } else if (msg.member.roles.cache.has(inferiorrole)) {
                        msg.roles.remove(inferiorrole)
                        
                    }
                    rMember.roles.add(sentenciaRole)
                    .then(msg.channel.send('Added role succesfully!'))
                    .catch(err => msg.channel.send('We have an error! ' + err))
                } else {
                    msg.channel.send('Invalid permissions. I see you ;)')
                }
            } else if (args[0] == 'i') {
                if (msg.member.roles.cache.has('830600208760176701')) {
                    if (msg.member.roles.cache.has(legendrole)) { 
                        msg.roles.remove(legendrole)
                    } else if (msg.member.roles.cache.has(sentenciaRole)) {
                        msg.roles.remove(sentenciaRole)
                        
                    }
                    rMember.roles.add(inferiorrole)
                    .then(msg.channel.send('Added role succesfully!'))
                    .catch(err => msg.channel.send('We have an error! ' + err))
                } else {
                    msg.channel.send('Invalid permissions. I see you ;)')
                }
            } else if (args[0] == 'eternal') {
                if (msg.member.roles.cache.has('830600208760176701')) {
                    if (msg.member.roles.cache.has(legendrole)) { 
                        msg.roles.remove(legendrole)
                    } else if (msg.member.roles.cache.has(inferiorrole)) {
                        msg.roles.remove(inferiorrole)
                        
                    }
                    rMember.roles.add(sentenciaRole)
                    .then(msg.channel.send('Added role succesfully!'))
                    .catch(err => msg.channel.send('We have an error! ' + err))
                } else {
                    msg.channel.send('Invalid permissions. I see you ;)')
                }
            } else if (args[0] == 'inferior') {
                if (msg.member.roles.cache.has('830600208760176701')) {
                    if (msg.member.roles.cache.has(legendrole)) { 
                        msg.roles.remove(legendrole)
                    } else if (msg.member.roles.cache.has(sentenciaRole)) {
                        msg.roles.remove(sentenciaRole)
                        
                    }
                    rMember.roles.add(inferiorrole)
                    .then(msg.channel.send('Added role succesfully!'))
                    .catch(err => msg.channel.send('We have an error! ' + err))
                } else {
                    msg.channel.send('Invalid permissions. I see you ;)')
                }
                
            } else if (args[0] == 'l'){
                if (msg.member.roles.cache.has('830600208760176701')) {
                    if (msg.member.roles.cache.has(inferiorrole)) { 
                        msg.roles.remove(inferiorrole)
                    } else if (msg.member.roles.cache.has(sentenciaRole)) {
                        msg.roles.remove(sentenciaRole)
                        
                    }
                    rMember.roles.add(legendrole)
                    .then(msg.channel.send('Added role succesfully!'))
                    .catch(err => msg.channel.send('We have an error! ' + err))
                } else {
                    msg.channel.send('Invalid permissions. I see you ;)')
                }

            } else if (args [0] == 'legend') {
                if (msg.member.roles.cache.has('830600208760176701')) {
                    if (msg.member.roles.cache.has(inferiorrole)) { 
                        msg.roles.remove(inferiorrole)
                    } else if (msg.member.roles.cache.has(sentenciaRole)) {
                        msg.roles.remove(sentenciaRole)
                        
                    }
                    rMember.roles.add(legendrole)
                    .then(msg.channel.send('Added role succesfully!'))
                    .catch(err => msg.channel.send('We have an error! ' + err))
                } else {
                    msg.channel.send('Invalid permissions. I see you ;)')
                }
            }else {
                msg.channel.send(guildroleHelp)
            }
        }
    } catch (err) {
        const errorembed = new Discord.MessageEmbed()
        .setColor('#ff0000')
        .setTitle('Error!')
        .setAuthor('SENTENCIA | Skyblock Guild')
        .setThumbnail('https://cdn.discordapp.com/attachments/832714326258614326/834808899717955584/SENTENCIA.png')
        .addFields(
            { name: 'An error occured!', value: 'Please forward this to a developer (<@504196872706064415>)! ```' + err + "```" }
        )
        .setDescription('')
        .setTimestamp()
        .setFooter('Sentencia Bot • Error Handling', 'https://cdn.discordapp.com/attachments/832714326258614326/834808899717955584/SENTENCIA.png');
        msg.channel.send(errorembed)
    }

});








// QoL commands



client.on('message', msg => {
    if (msg.content.startsWith('ping')) {
        msg.channel.send('Pong!')
        .then(message => {
            let ping = message.createdTimestamp - msg.createdTimestamp
            msg.channel.send(`Ping: ${ping}ms \nAPI Ping: ${client.ws.ping}ms`);
        
        })
    }
  });



client.on("message", msg => {
    if (msg.content.startsWith(prefix + 'suggest')) {
        let args = msg.content.split(" ").slice(1);
        const { guild } = msg;
        if (args[0] == 'deny') {
            if (msg.member.roles.cache.has('812691760425598986')) {
                let hasShifted = false;
                suggestions.findOne({suggestionnum:args[1]}, function(err, res) {
                    if (res == null) {
                        msg.channel.send('This suggestion does not exist!')
                    } else {
                        suggestions.deleteOne({suggestionnum:args[1]}, function(err, result) { 
                            if (err) {
                                msg.channel.send('There was an error deleting this from our database!')
                            }
    
                        })
                        // console.log(res.msgid)
                        client.channels.cache.get("755059507041665166").messages.fetch(res.msgid)
                        .then(messages => {
                            // console.log(messages.embeds[0].fields[0].name)
                            messages.embeds[0].fields[0].name = 'Suggestion: Denied!'
                            // console.log(console.log(messages.embeds[0].fields[0].name))
                            if (args[2] == undefined) {
                                deniedReason = 'no reason specified'
                            } else {
                                for (amountofargs in args) {
                                    if (hasShifted == false) {
                                        args.shift()
                                        hasShifted = true;
                                    } else {
                                        // args = args.toString()
                                        if (hasShifted == true) {
                                            args.shift()
                                            deniedReason = args.join(' ')
                                            hasShifted = 'Inapplicable now'
                                            const deniedSuggestion = new Discord.MessageEmbed()
                                        .setColor('RED')
                                        .setAuthor('SENTENCIA | Skyblock Guild')
                                        .setThumbnail('https://cdn.discordapp.com/attachments/832714326258614326/834808899717955584/SENTENCIA.png')
                                        .addFields(
                                            { name: 'Sent by:', value: msg.author.username},
                                            { name: 'Suggestion:', value: res.suggestion},
                                            { name: 'Status:', value: '*DENIED* by ' + msg.author.username},
                                            { name: 'Reason: ', value: deniedReason}
                                        )
                                        .setTimestamp()
                                        .setFooter('Sentencia Bot - Suggestion ID #' + res.suggestionnum, 'https://cdn.discordapp.com/attachments/832714326258614326/834808899717955584/SENTENCIA.png');
                                        messages.edit(deniedSuggestion);
                                        messages.reactions.removeAll();
                                        msg.channel.send('Denied Suggestion!');
                                    }
                                }

                            }

                        }});
                    }
                });

            } else {
                msg.channel.send('Invalid Permissions!')
            }

        } else if (args[0] == 'accept') {
            if (msg.member.roles.cache.has('812691760425598986')) {
                let hasShifted = false;
                suggestions.findOne({suggestionnum:args[1]}, function(err, res) {
                    if (res == null) {
                        msg.channel.send('This suggestion does not exist!')
                    } else {
                        suggestions.deleteOne({suggestionnum:args[1]}, function(err, result) { 
                            if (err) {
                                msg.channel.send('There was an error deleting this from our database!')
                            }
    
                        })
                        // console.log(res.msgid)
                        client.channels.cache.get("755059507041665166").messages.fetch(res.msgid)
                        .then(messages => {
                            // console.log(messages.embeds[0].fields[0].name)
                            messages.embeds[0].fields[0].name = 'Suggestion: Accepted!'
                            // console.log(console.log(messages.embeds[0].fields[0].name))
                            if (args[2] == undefined) {
                                acceptedReason = 'No reason specificed'
                            } else {
                                for (amountofargs in args) {
                                    if (hasShifted == false) {
                                        args.shift()
                                        hasShifted = true;
                                    } else {
                                        // args = args.toString()
                                        if (hasShifted == true) {
                                            args.shift()
                                            acceptedReason = args.join(' ')
                                            hasShifted = 'Inapplicable now'
                                            const acceptedSuggestion = new Discord.MessageEmbed()
                                            .setColor('GREEN')
                                            .setAuthor('SENTENCIA | Skyblock Guild')
                                            .setThumbnail('https://cdn.discordapp.com/attachments/832714326258614326/834808899717955584/SENTENCIA.png')
                                            .addFields(
                                                { name: 'Sent by:', value: msg.author.username},
                                                { name: 'Suggestion:', value: res.suggestion},
                                                { name: 'Status:', value: '*ACCEPTED* by ' + msg.author.username},
                                                { name: 'Reason: ', value: acceptedReason}
                                            )
                                            .setTimestamp()
                                            .setFooter('Sentencia Bot - Suggestion ID #' + res.suggestionnum, 'https://cdn.discordapp.com/attachments/832714326258614326/834808899717955584/SENTENCIA.png');
                                            messages.edit(acceptedSuggestion);
                                            messages.reactions.removeAll();
                                            msg.channel.send('Accepted Suggestion!');
                                        }

                                    }
                                }
                            }

                        });
                    }
                })

            } else {
                msg.channel.send('Invalid Permissions!')
            }

        } else if (args[0] == 'delete') {
            if (msg.member.roles.cache.has('812691760425598986')) {
                suggestions.findOne({suggestionnum:args[1]}, function(err, res) {
                    if (res == undefined) {
                        msg.channel.send('This suggestion does not exist!')
                    } else {
                        suggestions.deleteOne({suggestionnum:args[1]}, function(err, result) { 
                            if (err) {
                                msg.channel.send('There was an error deleting this from our database!')
                            }
            
                        })
                        // console.log(res.msgid)
                        client.channels.cache.get("755059507041665166").messages.fetch(res.msgid)
                        .then(messages => {
                            messages.delete()
                            msg.channel.send('Deleted the suggestion!')
            
                        })
                    }

                })    

            } else {
                msg.channel.send('Invalid Permissions!')
            }



            
        } else {
            if (args == '') {
                msg.channel.send(suggesstionHelp)
            } else if (args[0] == '@everyone') {
                msg.channel.send('No.')
            } else if (args[0] == '@here') {
                msg.channel.send('No.')
            } else {
                suggestions.findOne().sort({$natural: -1}).limit(1).exec(function(err, res){
                    if (res == null) {
                        let sugnum = 0
                    } else {
                        let sugnum = res.suggestionnum
                    }
                    if(err){
                        msg.channel.send('There was an error!' + err)
                    }
                    else{
                        args = args.join(" ")
                        sugnum = sugnum + 1
                        const suggestionEmbed = new Discord.MessageEmbed()
                        .setColor('GREEN')
                        .setAuthor('SENTENCIA | Skyblock Guild')
                        .setThumbnail('https://cdn.discordapp.com/attachments/832714326258614326/834808899717955584/SENTENCIA.png')
                        .addFields(
                            { name: 'Sent by:', value: msg.author.username},
                            { name: 'Suggestion:', value: args},
                            { name: 'Status:', value: 'To be accepted/denied'}
                        )
                        .setTimestamp()
                        .setFooter('Sentencia Bot - Suggestion ID #' + sugnum, 'https://cdn.discordapp.com/attachments/832714326258614326/834808899717955584/SENTENCIA.png');
                        client.channels.cache.get('755059507041665166').send(suggestionEmbed)
                        .then(msg => {
                            msg.react('✅')
                            msg.react('❌')
                            const dbsuggestion = new suggestions({
                                suggestionnum: sugnum,
                                suggestion: args,
                                msgid: msg.id
                            })
                
                            dbsuggestion.save()
                            
                        })
            
        
                        msg.channel.send('Suggestion Sent!')
                    }
                })

    
            }
        }

        

    }
});

// Testing stuff cmd below

// client.on('message', msg => {
//     if (msg.content.startsWith(prefix + 'e')) {
//         hyp.getProfiles('5a8b1b90ccec48a4a5d536f731c5f926', process.env.HYPIXELKEY).then(console.log)

//     }
// })

client.on('messageDelete', msg => {
    client.snipes.set(msg.channel.id, {
        content: msg.content,
        author: msg.author
    })
});


client.on("message", message => {
    if (message.content.startsWith(prefix + 'snipe')) {

        const msg = client.snipes.get(message.channel.id)
        if (!msg) return message.channel.send('There is no message to snipe.')
        const snipedmsg = new Discord.MessageEmbed()
        .setColor('GREEN')
        .setAuthor(msg.author.tag, msg.author.displayAvatarURL())
        .setThumbnail('https://cdn.discordapp.com/attachments/832714326258614326/834808899717955584/SENTENCIA.png')
        .addFields({ name: 'Sniped Message:', value: msg.content})
        .setTimestamp()
        .setFooter('Sentencia Bot', 'https://cdn.discordapp.com/attachments/832714326258614326/834808899717955584/SENTENCIA.png');
        message.channel.send(snipedmsg)
        

    }
});


client.on("message", msg => {
    if (msg.content.startsWith(prefix + 'sync')) {
        let args = msg.content.split(" ").slice(1);
        const { guild } = msg;
        const sentenciaRole = guild.roles.cache.find((role => role.id == '829850153476816907'));
        const inferiorrole = guild.roles.cache.find((role => role.id === '833538348135481344'));
        const legendrole = guild.roles.cache.find((role => role.id === '835968069741838357'));
        const viprole = guild.roles.cache.find((role => role.id == '830219786196746241'));
        const vipplusrole = guild.roles.cache.find((role => role.id == '830219785689104434'));
        const mvprole = guild.roles.cache.find((role => role.id == '830219785089450014'));
        const mvpplusrole = guild.roles.cache.find((role => role.id == '830219784506703922'));
        const mvpplusplusrole = guild.roles.cache.find((role => role.id == '830219784020033596'));
        const member = guild.members.cache.get(msg.author.id)
        // Rank Checking
        axios.get('https://api.slothpixel.me/api/players/' + msg.member.displayName)
        .then(res => {
            if (msg.member.roles.cache.has('830185985400373278')) {
                let rank = res.data.rank
                if (rank == 'VIP') {
                    member.roles.add(viprole)
                } else if (rank == 'VIP_PLUS') {
                    member.roles.add(vipplusrole)
                } else if (rank == 'MVP') {
                    member.roles.add(mvprole)
                } else if (rank == 'MVP_PLUS') {
                    member.roles.add(mvpplusrole)
                } else if (rank == 'MVP_PLUS_PLUS') {
                    member.roles.add(mvpplusplusrole)
                } 
            } else {
                msg.channel.send('Please verify using `s!verify` before using this command!')
            }
            axios.get('https://api.slothpixel.me/api/guilds/' + msg.member.displayName)
            .then(res => {
                if (msg.member.roles.cache.has('830185985400373278')) {
                    if (res.data.id == sentencia_id) {
                        member.roles.add(sentenciaRole)
                        msg.channel.send('Synced your account with the corresponding roles!')
                    } else if (res.data.id == inferior_id) {
                        member.roles.add(inferiorrole)
                        msg.channel.send('Synced your account with the corresponding roles!')
                    } else if (res.data.id == legend_id) {
                        member.roles.add(legendrole)
                        msg.channel.send('Synced your account with the corresponding roles!')
                    }
                } else {
                    msg.channel.send('Please verify using `s!verify` before using this command!')
                }
    
            })
            .catch(err => console.log(err))
        })
        .catch(err => msg.channel.send('Please verify using `s!verify` before using this command!'))



    }
});

client.on("message", msg => {
    if (msg.content.startsWith(prefix + 'skycrypt')) {
        let args = msg.content.split(" ").slice(1);
        if (args[0] == '') {
            msg.channel.send('Enter a username and a profile (optional) afterwards!')
        } else {
            let profile = args[1]
            if (profile == '') {
                msg.channel.send(`The skycrypt link is https://sky.shiiyu.moe/stats/${args[0]}/`)
            } else {
                msg.channel.send(`The skycrypt link is https://sky.shiiyu.moe/stats/${args[0]}/${args[1]}`)
            }


        }

    }
})


// client.on("message", msg => {
//     if (msg.content.startsWith(prefix + 'forcesync')) {
//         let args = msg.content.split(" ").slice(1);
//         const { guild } = msg;
//         const sentenciaRole = guild.roles.cache.find((role => role.id == '829850153476816907'));
//         const inferiorrole = guild.roles.cache.find((role => role.id === '833538348135481344'));
//         const viprole = guild.roles.cache.find((role => role.id == '830219786196746241'));
//         const vipplusrole = guild.roles.cache.find((role => role.id == '830219785689104434'));
//         const mvprole = guild.roles.cache.find((role => role.id == '830219785089450014'));
//         const mvpplusrole = guild.roles.cache.find((role => role.id == '830219784506703922'));
//         const mvpplusplusrole = guild.roles.cache.find((role => role.id == '830219784020033596'));
//         const member = guild.members.cache.get(msg.author.id)
//         // Rank Checking
//         axios.get('https://api.slothpixel.me/api/players/' + args[0])
//         .then(res => {
//             if (msg.member.roles.cache.has('830185985400373278')) {
//                 let rank = res.data.rank
//                 if (rank == 'VIP') {
//                     member.roles.add(viprole)
//                 } else if (rank == 'VIP_PLUS') {
//                     member.roles.add(vipplusrole)
//                 } else if (rank == 'MVP') {
//                     member.roles.add(mvprole)
//                 } else if (rank == 'MVP_PLUS') {
//                     member.roles.add(mvpplusrole)
//                 } else if (rank == 'MVP_PLUS_PLUS') {
//                     member.roles.add(mvpplusplusrole)
//                 } 
//             } else {
//                 msg.channel.send('Please verify using `s!verify` before using this command!')
//             }
//             axios.get('https://api.slothpixel.me/api/guilds/' + args[0])
//             .then(res => {
//                 if (msg.member.roles.cache.has('830185985400373278')) {
//                     if (res.data.id == sentencia_id) {
//                         member.roles.add(sentenciaRole)
//                         msg.channel.send('Synced your account with the corresponding roles!')
//                     } else if (res.data.id == inferior_id) {
//                         member.roles.add(inferiorrole)
//                         msg.channel.send('Synced your account with the corresponding roles!')
//                     }
//                 } else {
//                     msg.channel.send('Please verify using `s!verify` before using this command!')
//                 }
    
//             })
//             .catch(err => console.log(err))
//         })
//         .catch(err => msg.channel.send('Please verify using `s!verify` before using this command!'))



//     }
// });

client.on("message", msg => {
    if (msg.content.startsWith(prefix + 'say')) {
        if (msg.member.roles.cache.has('812691760425598986')) {
            let args = msg.content.split(" ").slice(1);
            msg.delete()
            args = args.slice(0)
            args = args.join(' ')
            msg.channel.send(args)

        } else {
            msg.channel.send('This command can only be used by Guild Admins!')
            .then(msg => setTimeout(() => {
                msg.delete()
            }, 5000)
            )


        }
    }
});

client.on("message", msg => {
    if (msg.content.startsWith(prefix + 'help')) {
        pages = [
            tagHelp,
            verifyHelp,
            guildroleHelp,
            greqHelp,
            syncHelp,
            suggesstionHelp
        ];
        paginationEmbed(msg, pages);
    }
});





// developer things

// All commands:
// Verify
// Tag
// Greq
// GuildRole
// Ping
// Suggest
// Snipe
// Sync
// Say








client.login(process.env.TOKEN); // Gets token from .env file (the last bit is the variable within .env)
