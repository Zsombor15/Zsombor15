const Discord = require('discord.js');
const tokenfile = require('./tokenfile.json');
const botconfig = require('./botconfig.json');
//const bot = new Discord.Client({ disableEveryone: true });
const bot = new Discord.Client({
    ws : {
        properties: {
            $browser: "Discord iOS",
        },
    },
    intents: ['GUILDS', 'GUILD_MEMBERS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS'],
});
var weather = require('weather-js')

const fs = require('fs')
const money = require('./money.json');
const prefix = require('./botconfig.json')


let botname = "Chill bot"

bot.on('guildMemberRemove', member =>{
    //This is the leave code
    const channel = member.guild.channels.cache.find(channel => channel.name === "welcome"); //You can change welcome to any text channel you want, "general", "new-doods", ect.
    if(!channel) return;

    channel.send(`●▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬●\n${member}  sajnos elhagyta a szervert :tractor::dash:Reméljük vissza jössz....😭\n●▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬●`)
});
bot.on('guildMemberAdd', member =>{
    //This is the welcome code
    const channel = member.guild.channels.cache.find(channel => channel.name === "welcome"); //You can change welcome to any text channel you want, "general", "new-doods", ect.
    if(!channel) return;

    channel.send(`●▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬●\nSzió ! ${member} köszönjük hogy be léptél a szerverünkre!Ha bármi kérdésed van kérdezz bátran!Ha van lehetőséged fusd át a szabályok szobát!😘\n●▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬●!`)
});

bot.on('ready', async() => {
    console.log(`${bot.user.username} Elindult`)

    let státuszok = [
        `Help: ${prefix}help`,
        "Készítő: Valaki#9932",
        "Discord: shorturl.at/crGPW",
        "Weboldal: Készül"
    ]

    setInterval(function() {
        let status = státuszok[Math.floor(Math.random()* státuszok.length)]

        bot.user.setActivity(status, {type: "WATCHING"})
    }, 5000)
})

bot.on("message", async message => {
    let MessageArray = message.content.split(" ");
    let cmd = MessageArray[0];
    let args = MessageArray.slice(1);
    let prefix = botconfig.prefix;

    if(message.author.bot) return;
    if(message.channel.type === 'dm') return;

    if(!money[message.author.id]) {
        money[message.author.id] = {
            money: 100
        };
    }
    fs.writeFile('./money.json', JSON.stringify(money), (err) => {
        if(err) console.log(err)
    });
    let selfMoney = money[message.author.id].money;

    if(cmd === `${prefix}money`){
        let profilkep = message.author.displayAvatarURL();

        let moneyembed = new Discord.MessageEmbed()
        .setAuthor(message.author.username)
        .setColor("RANDOM")
        .addField("Egyenleg:", `${selfMoney}ft`)
        .setThumbnail(profilkep)
        .setFooter(botname)

        message.channel.send(moneyembed)
    }

    if(message.guild){
        let drop_money = Math.floor(Math.random()*40 + 1)
        let random_money = Math.floor(Math.random()*900 + 1)

        if(drop_money === 25){
            let uzenetek = ["Kiraboltál egy boltot:", "Elloptál egy biciklit:", "Kifosztottál egy nénit:"]
            let random_uzenet_szam = Math.floor(Math.random()*uzenetek.length)

            const drp = new Discord.MessageEmbed()
            .setAuthor(message.author.username)
            .addField("Szerencséd volt:", `${uzenetek[random_uzenet_szam]} Ezért kaptál: ${random_money}FT-ot!`)
            .setColor("RANDOM")
            .setThumbnail(message.author.displayAvatarURL())


            message.channel.send(drp)

            money[message.author.id] = {
                money: selfMoney + random_money
            }
        }
    }

    if(cmd === `${prefix}shop`){
        let shopemb = new Discord.MessageEmbed()
        .setAuthor(message.author.username + message.author.discriminator)
        .setDescription(`${prefix}vasarol-vip [ÁR: 500FT] `)
        .setColor("RANDOM")
        .setThumbnail(bot.user.displayAvatarURL())

        message.channel.send(shopemb)
    }

    if(cmd === `${prefix}vasarol-vip`){
        //let viprang = "VIP"
        let viprang = message.guild.roles.cache.find(role => role.name === "VIP");
        let price = "5000";
        if(message.member.roles.cache.has(viprang)) return message.reply("Ezt a rangot már megvetted!");
        if(selfMoney < price) return message.reply(`Erre a rangra nincs pénzed. Egyenleged: ${selfMoney}Ft. Ára: ${price}Ft`)

        money[message.author.id] = {
            money: selfMoney - parseInt(price)
        }

        message.guild.member(message.author.id).roles.add(viprang)

        message.reply("Köszönöm a vásárlást, további szép napot!")
    }

    if(cmd === `${prefix}daily`){
        money[message.author.id] = {
            money: selfMoney + 300
        }
        message.reply(`Lekérted a napi 300Ft-t. Ezért most ${selfMoney}ft-od van`)
    }

    if(cmd === `${prefix}hello`){
        message.channel.send("Csá")
        message.reply("UwU")
        message.react("<a:pepeSmoke:940680075660128386>")
    }

    if(cmd === `${prefix}ftadd`){
        //if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("Ehhez a parancshoz nincs jogod!")
        let pay_money = Math.round(args[0]*100)/100
        if(isNaN(pay_money)) return message.reply(`A parancs helyes használata: ${prefix}ftadd <összeg> <@név>`)
        
        let pay_user = message.mentions.members.first();

        if(args[1] && pay_user){
            if(!money[pay_user.id]) {
                money[pay_user.id] = {
                    money: 100,
                    user_id: pay_user.id
                }
            }

            money[pay_user.id] = {
                money: money[pay_user.id].money + pay_money,
                user_id: pay_user.id
            }

         

        message.channel.send(`Sikeresen átutaltál <@${pay_user.id}> számlájára ${pay_money}FT-ot!`)

        fs.writeFile("./money.json", JSON.stringify(money), (err) => {
            if(err) console.log(err);
        });
    } else {
        message.reply(`A parancs helyes használata: ${prefix}ftadd <összeg> <@név> \n Esetleg nincs ennyi pénzed!`)
    }
}

    if(cmd === `${prefix}szöveg`){
        let szöveg = args.join(" ")

        if(szöveg) {
        message.react("<a:igen:941804818538835979>")
            let duembe = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .addField("Szöveg:", szöveg)
        .setFooter(`${botname} | ${message.createdAt}`)
        message.delete()
        message.channel.send(duembe)
        } else {
            message.reply("Írj szöveget")
            message.react("<a:nem:941804818417213440>")
            message.delete()
        }
    }

    if(cmd === `${prefix}help`){
        let embe = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setAuthor(message.author.username)
        .setThumbnail(message.author.displayAvatarURL())        
        .setDescription("Help Embed")
        .addField("Fun:\n")
        .setFooter(`${botname} | ${message.createdAt}`)

        message.channel.send(embe)
    }
    if(cmd === `${prefix}kick`){
        if(!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send("Ehhez a parancshoz nincs jogod!")
        let kick_user = message.mentions.members.first();
        if(args[0] && kick_user){

            if(args[1]){

                let kickemb = new Discord.MessageEmbed()
                .setTitle("KICK")
                .setColor("RANDOM")
                .setDescription(`***Kickelte:*** ${message.author.tag}\n***Kickelve lett:*** ${kick_user.user.tag}\n***Kick indoka:*** ${args.slice(1).join(" ")}`)
             

            message.channel.send(kickemb);

            kick_user.kick(args.slice(1).join(" "))    

            } else {
                let parancsemb = new Discord.MessageEmbed()
            .setTitle("Parancs használata")
            .addField(`${prefix}kick @név [indok]`, "-")
            .setColor("RANDOM")
            .setDescription("***HIBA:*** Kérlek adj meg egy indokot")
             

            message.channel.send(parancsemb);
            }

        } else {
            let parancsemb = new Discord.MessageEmbed()
            .setTitle("Parancs használata")
            .addField(`${prefix}kick @név [indok]`, "-")
            .setColor("RANDOM")
            .setDescription("***HIBA:*** Kérlek említs meg egy embert")
             

            message.channel.send(parancsemb);
        }

    }
    if(cmd === `${prefix}ban`){
        if(!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send("Ehhez a parancshoz nincs jogod!")
        let ban_user = message.mentions.members.first();
        if(args[0] && ban_user){

            if(args[1]){

                let BanEmbed = new Discord.MessageEmbed()
                .setTitle("BAN")
                .setColor("RED")
                .setDescription(`**Banolta:** ${message.author.tag}\n**Banolva lett:** ${ban_user.user.tag}\n**Ban indoka:** ${args.slice(1).join(" ")}`)

            message.channel.send(BanEmbed);
                ban_user.ban({ reason: args.slice(1).join(" ") });
               
            } else {
            let parancsEmbed = new Discord.MessageEmbed()
            .setTitle("Parancs használata:")
            .addField(`\`${prefix}ban <@név> [indok]\``, "˘˘˘")
            .setColor("BLUE")
            .setDescription("HIBA: Kérlek adj meg egy indokot!!")

            message.channel.send(parancsEmbed);
            }

        } else {
            let parancsEmbed = new Discord.MessageEmbed()
            .setTitle("Parancs használata:")
            .addField(`\`${prefix}ban <@név> [indok]\``, "˘˘˘")
            .setColor("BLUE")
            .setDescription("HIBA: Kérlek említs meg egy embert!")

            message.channel.send(parancsEmbed);

        }
    }

    if(cmd === `${prefix}weather`){
        if(args[0]){
            weather.find({search: args.join(" "), degreeType: "C"}, function(err, result) {
                if (err) message.reply(err);

                if(result.length === 0){
                    message.reply("Kérlek adj meg egy létező település nevet!")
                    return;
                }

                let current = result[0].current;
                let location = result[0].location;

                let WeatherEmbed = new Discord.MessageEmbed()
                .setDescription(`**${current.skytext}**`)
                .setAuthor(`Időjárás itt: ${current.observationpoint}`)
                .setThumbnail(current.imageUrl)
                .setColor("GREEN")
                .addField("Időzóna:", `UTC${location.timezone}`, true)
                .addField("Fokozat típusa:", `${location.degreetype}`, true)
                .addField("Hőfok", `${current.temperature}°C`, true)
                .addField("Hőérzet:", `${current.feelslike}°C`, true)
                .addField("Szél", `${current.winddisplay}`, true)
                .addField("Páratartalom:", `${current.humidity}%`, true)

                message.channel.send(WeatherEmbed);
            })

        } else {
            message.reply("Kérlek adj meg egy település nevet!")
        }
    }
})


bot.login(tokenfile.token);

//bot.on("guildMemberRemove", (member) => {
//    const channelID = "941767945879711794";
//    const  message = `Viszlát <@${member.user.tag}>! Remélem vissza jössz egyszer!`
//    const channel = member.guild.channels.cache.get(channelID);
//    channel.send(message)
//}
