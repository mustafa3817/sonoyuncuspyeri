module.exports = {
  name: 'dm',
  async execute(interaction, config) {
    if (!config.admins.includes(interaction.user.id)) {
      await interaction.reply({ content: 'Bu komutu kullanma yetkiniz yok.', flags: 64 });
      return;
    }
    const user = interaction.options.getUser('user');
    const mesaj = interaction.options.getString('mesaj');
    try {
      await user.send(mesaj);
      await interaction.reply({ content: `Mesaj başarıyla ${user} kullanıcısına DM olarak gönderildi.`, flags: 64 });
    } catch (err) {
      await interaction.reply({ content: 'Mesaj gönderilemedi.', flags: 64 });
    }
  }
};