const { REST, Routes, SlashCommandBuilder } = require('discord.js');


const fs = require('fs');
const path = require('path');
const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8'));
const TOKEN = config.token;
const CLIENT_ID = config.clientId;
const GUILD_ID = config.guildId;

const commands = [
  new SlashCommandBuilder()
    .setName('ekle')
    .setDescription('Bir kullanıcıya gün cinsinden süre ekler')
    .addUserOption(option => option.setName('user').setDescription('Kullanıcı').setRequired(true))
    .addStringOption(option => option.setName('nick').setDescription('Kullanıcı takma adı').setRequired(true))
    .addIntegerOption(option => option.setName('sure').setDescription('Süre (gün)').setRequired(true)),
  new SlashCommandBuilder()
    .setName('ekliler')
    .setDescription('Süre eklenen kişileri listeler'),
  new SlashCommandBuilder()
    .setName('sil')
    .setDescription('Birinin süresini siler')
    .addUserOption(option => option.setName('user').setDescription('Kullanıcı').setRequired(false))
    .addStringOption(option => option.setName('nick').setDescription('Kullanıcı takma adı').setRequired(false)),
  new SlashCommandBuilder()
    .setName('sürem')
    .setDescription('Kendi sürenizi görüntüleyin'),
  new SlashCommandBuilder()
    .setName('dm')
    .setDescription('Bir kullanıcıya DM ile mesaj gönder')
    .addUserOption(option => option.setName('user').setDescription('Kullanıcı').setRequired(true))
    .addStringOption(option => option.setName('mesaj').setDescription('Gönderilecek mesaj').setRequired(true))
]
  .map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
  try {
    console.log('Komutlar yükleniyor...');
    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands }
    );
    console.log('Komutlar başarıyla yüklendi!');
  } catch (error) {
    console.error(error);
  }
})();
