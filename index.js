const { Client, GatewayIntentBits, Partials, Events } = require('discord.js');
const fs = require('fs');
const cron = require('node-cron');
const path = require('path');

const commands = {};
const commandsPath = path.join(__dirname, 'commands');
fs.readdirSync(commandsPath).forEach(file => {
  if (file.endsWith('.js')) {
    const command = require(path.join(commandsPath, file));
    commands[command.name] = command;
  }
});

function loadData() {
  if (!fs.existsSync(DATA_FILE)) return {};
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8'));
const TOKEN = config.token;
const DATA_FILE = path.join(__dirname, 'data.json');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages
  ],
  partials: [Partials.Channel]
});

client.once(Events.ClientReady, () => {
  console.log(`Bot ${client.user.tag} olarak giriş yaptı!`);
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;
  const data = loadData();
  const commandName = interaction.commandName;
  const command = commands[commandName];
  if (!command) return;
  // Komutun execute fonksiyonunu çağır
  await command.execute(interaction, config, data, saveData);
});

// Her gün 00:00'da kontrol
cron.schedule('0 0 * * *', async () => {
  const data = loadData();
  const now = new Date();
  for (const [uid, info] of Object.entries(data)) {
    const bitis = new Date(info.bitis);
    const kalan = Math.ceil((bitis - now) / (1000 * 60 * 60 * 24));
    if (kalan === 1) {
      let dmSent = false;
      try {
        const user = await client.users.fetch(uid);
        const userMsg = config.dmUserMessage.replace('{username}', user.username).replace('{nick}', info.nick);
        await user.send(userMsg);
        dmSent = true;
      } catch {}
      // Adminlere haber ver
      for (const guild of client.guilds.cache.values()) {
        for (const member of guild.members.cache.values()) {
          if (config.admins.includes(member.id)) {
            try {
              const adminMsg = config.dmAdminMessage.replace('{username}', user ? user.username : '').replace('{nick}', info.nick);
              await member.send(adminMsg);
            } catch {}
          }
        }
      }
      // Log kanalına yaz
      if (config.logChannelId && dmSent) {
        try {
          const logChannel = await client.channels.fetch(config.logChannelId);
          await logChannel.send(`<@${uid}> kişisine DM gönderildi.`);
        } catch {}
      }
    }
    if (kalan <= 0) {
      // Süresi biten kişiden rolü al
      for (const guild of client.guilds.cache.values()) {
        try {
          const member = await guild.members.fetch(uid);
          await member.roles.remove(config.roleId);
        } catch {}
      }
      // Süreyi sil
      delete data[uid];
      saveData(data);
    }
  }
});

client.login(TOKEN);