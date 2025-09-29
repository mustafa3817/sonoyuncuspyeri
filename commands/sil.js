module.exports = {
  name: 'sil',
  async execute(interaction, config, data, saveData) {
    if (!config.admins.includes(interaction.user.id)) {
      await interaction.reply({ content: 'Bu komutu kullanma yetkiniz yok.', flags: 64 });
      return;
    }
    const user = interaction.options.getUser('user');
    const nick = interaction.options.getString('nick');
    let removed = false;
    for (const [uid, info] of Object.entries(data)) {
      if ((user && uid === user.id) || (nick && info.nick === nick)) {
        delete data[uid];
        removed = true;
      }
    }
    saveData(data);
    if (removed) {
      await interaction.reply('Süre silindi.');
    } else {
      await interaction.reply('Kişi bulunamadı.');
    }
  }
};