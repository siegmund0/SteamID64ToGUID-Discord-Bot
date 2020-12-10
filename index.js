const axios = require('axios');
const { steamapi } = require('./config.json');
const { Client, Collection, MessageEmbed, Discord } = require("discord.js");
const fs = require("fs");

const client = new Client({
    disableEveryone: true
});
const { config } = require("dotenv");

const express = require("express");
const https = require('https');
const path = require('path');
const mongoose = require('mongoose');
const prefix = require('./database/prefix');

//Conexion a la base de datos MONGODB
mongoose.connect('mongodb://localhost:27017/id64toguidTest', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const app = express();
const _PORT = process.env.PORT || 80;

app.get('/', (req, res) => {
    res.redirect('/gb-status');
});

//TOP.GG - START SEND DATA FROM API
// const DBL = require("dblapi.js");
// const dbl = new DBL('Your-top.gg-bot-token', client);

// dbl.on('posted', () => {
//     console.log('Server count posted');
// });

// dbl.on('error', e => {
//     console.log(`Oops! ${e}`);
// });

client.commands = new Collection();
client.aliases = new Collection();
client.categories = fs.readdirSync("./commands/");

//CONFIG PATH .ENV
config({
    path: __dirname + "/.env"
});

//HANDLER COMANDS
["command"].forEach(handler => {
    require(`./handler/${handler}`)(client);
});

//START BOT INFORMATION
client.on("ready", () => {
    const socketStats = require('socketstats');
    const server = new socketStats(app, client);
    server.listen(_PORT, () => {
        console.log("Listening to port: "+_PORT);
    });
    console.log(`Estoy online, mi nombre es ${client.user.username}`);
	let actividades = [ `${client.guilds.cache.size} Servers`, `Bohemia Int.`, `Dayz`, `Arma`], i = 0;
    setInterval(() => client.user.setActivity(`-help | ${actividades[i++ % actividades.length]}`, { type: "WATCHING"}), 20000);  
	setInterval(() => {
        dbl.postStats(client.guilds.size, client.shards.total);
    }, 1800000);
});

//MESSAGE LISTENER - ASYNC
client.on("message", async message => {
    if (message.author.bot) return;
    //const prefix = process.env.PREFIX;
    const data = await prefix.findOne({
        GuildID: message.guild.id
    });

    const messageArray = message.content.split(' ');
    const cmd = messageArray[0];
    const args = messageArray.slice(1);

    if(data) {
        const prefix = data.Prefix;

        if (!message.content.startsWith(prefix)) return;
        const commandfile = client.commands.get(cmd.slice(prefix.length)) || bot.commands.get(bot.aliases.get(cmd.slice(prefix.length)));
        commandfile.run(client, message, args);
    } else if (!data) {
        //set the default prefix here
        const prefix = "!";
        
        if (!message.content.startsWith(prefix)) return;
        const commandfile = client.commands.get(cmd.slice(prefix.length)) || bot.commands.get(bot.aliases.get(cmd.slice(prefix.length)));
        commandfile.run(client, message, args);
    }

});

//BOT LOGIN - YOUR DISCORD BOT BE HERE.
client.login(process.env.TOKEN);