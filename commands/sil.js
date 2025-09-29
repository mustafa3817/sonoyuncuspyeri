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
    let removedId = null;
    for (const [uid, info] of Object.entries(data)) {
      if ((user && uid === user.id) || (nick && info.nick === nick)) {
        delete data[uid];
        removed = true;
        removedId = /^\d+$/.test(uid) ? uid : null;
      }
    }
    saveData(data);
    if (removed) {
      // Rolü geri al
      if (removedId) {
        try {
          const member = await interaction.guild.members.fetch(removedId);
          await member.roles.remove(config.roleId);
        } catch {}
      }
      await interaction.reply('Süre silindi ve rol geri alındı.');
    } else {
      await interaction.reply('Kişi bulunamadı.');
    }
  }
};