
const Discord = require('discord.js');
const config = require("./config.json");
const bot = new Discord.Client();

//Client ID: 455251974250823680 

const mainChannel = "sachi-test";
const rolesChannel = "roles";

bot.on('ready', () => {
  console.log('I, Komine Sachi, am ready!');
});

bot.on('guildCreate', guild => {
  console.log(`Sachi has joined the guild ${guild.name}!`);
  if(!guild.channels.exists("name", rolesChannel) )
  {
    console.log(`Creating a channel for roles!`);
    guild.createChannel(rolesChannel,"text");
  } else console.log(`Role channel exists!`);
})

//Emits event when a new member joins a server
bot.on('guildMemberAdd',(member) => {
  console.log(`New user "${member.user.username}" has joined "${member.guild.name}"!`);
  member.send("Hey " + member.id.toString + ", and welcome to " + member.guild.name + "!");
})

//creates an event listener for messages
bot.on('message',(message) => {
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    //ensures the bot only scans applicable messages, and deletes those that aren't
    if( !message.guild || message.author.bot ) return;
    //the following commands are only accessible in the roles channel
    if(message.channel.name === rolesChannel)
    {
       switch(command)
       {
        case "roles":
        message.channel.send(message.author.toString() + "'s roles are: " + message.members.roles);
        break;

        case "addrole":
        if(message.channel.name === rolesChannel)
        {
          let myRole = args.join(' ');  //joins the arguments of args and allows the bot to read roles containing whitespaces
          if(message.member.roles.exists("name",myRole))  //if the user already has the role, the bot will tell them
           {
             message.channel.send(`You already have the "${myRole}" role!`);
             return;
           }
        if(message.guild.roles.exists("name",myRole))  //checks the list of guild roles for any roles with names that match that of myRole
        {
          let newRole = message.guild.roles.find("name", myRole);  //newRole is the actual role that will be given, not the psuedo role

          if(message.member.highestRole.position < newRole.position)
          {
            message.channel.send("You don't have permission to get that role!");
          } else {
            message.member.addRole(newRole).catch(console.error);    
            message.channel.send(`You now have the role "${myRole}"!`);
          }
        } else {
          message.channel.send(`Role "${myRole}" does not exist!`);  //if myRole does not match with a real role, will tell user
        }
      } else {
        message.channel.send(`You must be in the ${message.guild.channels.find(channel => channel.name === "roles").toString()} channel to add roles!`);
      }
      break;

      default:
      if(!message.content.startsWith(config.prefix) || message.author.bot || message.member.highestRole)
      {
        message.delete();
      }
    }
  } else {
      //these commands can be accessed across all channels
      switch (command) 
      {
        case "ping":
          message.channel.send("Pong!");
        break;

        case "red70":
          message.channel.send("One of us!");
        break;

        case "sachi":
          message.channel.send("I'm Sachi!");
        break;
      }
    }
})

bot.on("error", (e) => console.error(e));
bot.on("warn", (e) => console.warn(e));
bot.on("debug", (e) => console.info(e));

//make sure the bot is tidus bot
bot.login(config.token);