module.exports = {
  name: 'sürem',
  async execute(interaction, config, data) {
    const info = data[interaction.user.id];
    if (info) {
      await interaction.reply(`Sayın ${interaction.user}, kalan süreniz: ${info.bitis}`);
    } else {
      await interaction.reply('Süreniz doldu veya hiç eklenmedi.');
    }
  }
};