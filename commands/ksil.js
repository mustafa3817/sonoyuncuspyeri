module.exports = {
  name: 'ksil',
  async execute(interaction, config) {
    if (!config.admins.includes(interaction.user.id)) {
      await interaction.reply({ content: 'Bu komutu kullanma yetkiniz yok.', flags: 64 });
      return;
    }
    const user = interaction.options.getUser('user');
    const nick = interaction.options.getString('nick');
    let targetId = user ? user.id : null;
    let targetNick = nick || (user ? user.username : null);
    if (!targetId && targetNick) {
      const guild = interaction.guild;
      const member = guild.members.cache.find(m => m.user.username === targetNick || m.nickname === targetNick);
      if (member) targetId = member.id;
    }
    if (!targetId) {
      await interaction.reply({ content: 'Kullanıcı bulunamadı.', flags: 64 });
      return;
    }
    if (config.karaliste[targetId]) {
      delete config.karaliste[targetId];
      fs.writeFileSync(path.join(__dirname, '../config.json'), JSON.stringify(config, null, 2), 'utf8');
      await interaction.reply({ content: `<@${targetId}> karalisteden silindi.`, flags: 64 });
    } else {
      await interaction.reply({ content: 'Kişi karalistede değil.', flags: 64 });
    }
  }
};