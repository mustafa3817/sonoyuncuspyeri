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
    for (const [uid, info] of Object.entries(data)) {
      msg += `<@${uid}> (${info.nick}): ${info.bitis}\n`;
    }
    await interaction.reply(msg);
  }
};