const Discord = require('discord.js')
const db = require('quick.db')
const client = new Discord.Client()

// FUNCTIONS
function isOdd(num) {
  if ((num % 2) == 0) return false;
  else if ((num % 2) == 1) return true;
}

// ------------- COMMANDS ----------------
client.on('message', async (message) => {
  if (message.content.startsWith('!work')) {
    let monin = Math.floor(Math.random() * 200) + 1

    message.channel.send(`If you worked and you get ${monin}`)
    db.add(`monin_${message.author.id}`, monin)
  }
})

client.on('message', async (message) => {
  if (message.content.startsWith('!bal')) {
    let bal = db.get(`monin_${message.author.id}`)

    message.channel.send(`This is your bal ${bal}`)
  }
})

client.on('message', async (message) => {
  let args = message.content
      .slice(message.lenght)
      .trim()
      .split(/ +/g)
  let cmd = args.shift().toLowerCase()

  if (message.content.startsWith('!bet')) {
    let colour = args[0]
    let money = parseInt(args[1])
    let moneydb = await db.fetch(`monin_${message.author.id}`)

    let random = Math.floor((Math.random() * 10));
    
    let moneyhelp = "specify an amount to gumble"
    let moneymore = 'you are betting more than you have'
    let colorbad = 'specify a color. red, black, green'

    if (!colour) return message.channel.send(colorbad)
    colour = colour.toLowerCase()
    if (!money) return message.channel.send(moneyhelp)
    if (money > moneydb) return message.channel.send(moneymore)

    if (!colour == "b" || colour.includes('black')) colour = 0;
    else if (!colour == "r" || colour.includes('red')) colour = 1;
    else if (!colour == "g" || colour.includes('green')) colour = 2;
    else return message.channel.send(colorbad)

    if (random == 1 && colour == 2) { // Green bet
       money *= 15
       db.add(`monin_${message.author.id}`, money)
       message.channel.send(`u bet on green and congrats! u won ${money} coins\n\nmultiplier: 15x`)
    } else if (isOdd(random) && colour == 1) { // Red bet
      money = parseInt(money * 1.5)
      db.add(`monin_${message.author.id}`, money)
      message.channel.send(`u bet on red and congrats! u won ${money} coins\n\nmultiplier: 1.5x`)
    } else if (!isOdd(random) && colour == 0) {
      money = parseInt(money * 2)
      db.add(`monin_${message.author.id}`, money)
      message.channel.send(`u bet on black and congrats! u won ${money} coins\n\nmultiplier: 2x`)
    } else {
      db.subtract(`monin_${message.author.id}`, money)
      message.channel.send(`you missed the bet and lose ${money}`)
    }
  }
})

client.login('token-bot-here')