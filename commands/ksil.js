const fs = require('fs');
const path = require('path');
module.exports = {
  name: 'ksil',
  async execute(interaction, config) {
    if (!config.admins.includes(interaction.user.id)) {
      await interaction.reply({ content: 'Bu komutu kullanma yetkiniz yok.', flags: 64 });
      return;
    }
    const fs = require('fs');
    const path = require('path');
    const user = interaction.options.getUser('user');
    const nick = interaction.options.getString('nick');
    const kdataPath = path.join(__dirname, '../kdata.json');
    let kdata = {};
    try {
      kdata = JSON.parse(fs.readFileSync(kdataPath, 'utf8'));
    } catch (e) {}
    let found = false;
    // Discord ID ile silme
    if (user && kdata[user.id]) {
      delete kdata[user.id];
      found = true;
    }
    // Sadece nick ile silme
    if (!found && nick) {
      for (const key of Object.keys(kdata)) {
        if (key === nick || kdata[key] === nick) {
          delete kdata[key];
          found = true;
          break;
        }
      }
    }
    if (found) {
      fs.writeFileSync(kdataPath, JSON.stringify(kdata, null, 2), 'utf8');
      await interaction.reply({ content: 'Karalisteden silindi.', flags: 64 });
    } else {
      await interaction.reply({ content: 'Kullanıcı veya nick karalistede bulunamadı.', flags: 64 });
    }
  }
};