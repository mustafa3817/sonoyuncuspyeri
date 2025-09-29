module.exports = {
  name: 'ekliler',
  async execute(interaction, config, data) {
    if (!config.admins.includes(interaction.user.id)) {
      await interaction.reply({ content: 'Bu komutu kullanma yetkiniz yok.', flags: 64 });
      return;
    }
    if (Object.keys(data).length === 0) {
      await interaction.reply('Hiç kimseye süre eklenmemiş.');
      return;
    }
    let msg = 'Süre eklenenler:\n';
      for (const [idOrNick, obj] of Object.entries(data)) {
        if (/^\d+$/.test(idOrNick)) {
          // ID ise
          msg += `<@${idOrNick}> (${obj.nick}): ${obj.bitis}\n`;
        } else {
          // Sadece nick ise
          msg += `(dcsi yok) (${obj.nick}): ${obj.bitis}\n`;
        }
    }
    await interaction.reply(msg);
  }
};