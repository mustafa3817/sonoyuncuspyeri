module.exports = {
  name: 'ekle',
  async execute(interaction, config, data, saveData) {
    if (!config.admins.includes(interaction.user.id)) {
      await interaction.reply({ content: 'Bu komutu kullanma yetkiniz yok.', flags: 64 });
      return;
    }
    // Kullanıcı ve/veya nick ve süreyi al
    const user = interaction.options.getUser('user');
    const nick = interaction.options.getString('nick');
    const sure = interaction.options.getInteger('sure');
    let targetId = user ? user.id : null;
    let targetNick = nick || (user ? user.username : null);
    if (!targetId && targetNick) {
      // Nick ile kullanıcıyı bul
      const guild = interaction.guild;
      const member = guild.members.cache.find(m => m.user.username === targetNick || m.nickname === targetNick);
      if (member) targetId = member.id;
    }
    if (!targetId) {
      await interaction.reply({ content: 'Kullanıcı bulunamadı.', flags: 64 });
      return;
    }
    // Karaliste kontrolü
    if (config.karaliste[targetId] || (targetNick && Object.values(config.karaliste).includes(targetNick))) {
      await interaction.reply({ content: 'Bu kişi karalistededir.', flags: 64 });
      return;
    }
    // Süre ekle
    data[targetId] = {
      nick: targetNick,
      bitis: (new Date(Date.now() + sure * 24 * 60 * 60 * 1000)).toISOString().slice(0, 10)
    };
    saveData(data);
    // Rol ver
    try {
      const member = await interaction.guild.members.fetch(targetId);
      await member.roles.add(config.roleId);
    } catch {}
    await interaction.reply({ content: `<@${targetId}> (${targetNick}) için ${sure} gün süre eklendi ve rol verildi.`, flags: 64 });
  }
};