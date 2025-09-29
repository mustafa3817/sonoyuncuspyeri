
const fs = require('fs');
const path = require('path');
module.exports = {
  name: 'kekle',
  async execute(interaction, config) {
    if (!config.admins.includes(interaction.user.id)) {
      await interaction.reply({ content: 'Bu komutu kullanma yetkiniz yok.', flags: 64 });
      return;
    }
    const user = interaction.options.getUser('user');
    const nick = interaction.options.getString('nick');
    let targetId = user ? user.id : null;
    let targetNick = nick || (user ? user.username : null);
    const kdataPath = path.join(__dirname, '../kdata.json');
    let kdata = {};
    try {
      kdata = JSON.parse(fs.readFileSync(kdataPath, 'utf8'));
    } catch (e) {}
    if (targetId) {
      kdata[targetId] = targetNick;
      fs.writeFileSync(kdataPath, JSON.stringify(kdata, null, 2), 'utf8');
      await interaction.reply({ content: `<@${targetId}> (${targetNick}) karalisteye eklendi.`, flags: 64 });
    } else if (targetNick) {
      // Sadece nick girildiyse ID olmadan ekle
      kdata[targetNick] = null;
      fs.writeFileSync(kdataPath, JSON.stringify(kdata, null, 2), 'utf8');
      await interaction.reply({ content: `${targetNick} karalisteye eklendi (ID yok).`, flags: 64 });
    } else {
      await interaction.reply({ content: 'Kullanıcı veya nick girilmedi.', flags: 64 });
    }
  }
};