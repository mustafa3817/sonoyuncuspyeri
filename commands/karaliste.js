module.exports = {
  name: 'karaliste',
  async execute(interaction, config) {
    if (!config.admins.includes(interaction.user.id)) {
      await interaction.reply({ content: 'Bu komutu kullanma yetkiniz yok.', flags: 64 });
      return;
    }
  const fs = require('fs');
  const path = require('path');
  const kdata = JSON.parse(fs.readFileSync(path.join(__dirname, '../kdata.json'), 'utf8'));
  const liste = Object.entries(kdata);
    if (liste.length === 0) {
      await interaction.reply('Karaliste boş.');
      return;
    }
    let msg = 'Karaliste:\n';
    for (const [id, nick] of liste) {
      msg += `<@${id}> (${nick})\n`;
    }
    await interaction.reply(msg);
  }
};