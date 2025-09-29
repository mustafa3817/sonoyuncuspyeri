module.exports = {
  name: 'ekle',
  async execute(interaction, config, data, saveData) {
    if (!config.admins.includes(interaction.user.id)) {
      await interaction.reply({ content: 'Bu komutu kullanma yetkiniz yok.', flags: 64 });
      return;
    }
    const fs = require('fs');
    const path = require('path');
    // Kullanıcı ve/veya nick ve süreyi al
    const user = interaction.options.getUser('user');
    const nick = interaction.options.getString('nick');
    const sure = interaction.options.getInteger('sure');
    let targetId = user ? user.id : null;
    let targetNick = nick || (user ? user.username : null);
    if (!targetId && targetNick) {
      const guild = interaction.guild;
      const member = guild.members.cache.find(m => m.user.username === targetNick || m.nickname === targetNick);
      if (member) targetId = member.id;
    }
    // Karalisteyi kdata.json'dan oku
    let kdata = {};
    try {
      kdata = JSON.parse(fs.readFileSync(path.join(__dirname, '../kdata.json'), 'utf8'));
    } catch (e) {}
    // Karaliste kontrolü
    if ((targetId && kdata[targetId]) || (targetNick && Object.values(kdata).includes(targetNick))) {
      await interaction.reply({ content: 'Bu kişi karalistededir.', flags: 64 });
      return;
    }
    if (targetId) {
      // ID ile ekle
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
    } else if (targetNick) {
      // Sadece nick ile ekle (ID yok)
      data[targetNick] = {
        nick: targetNick,
        bitis: (new Date(Date.now() + sure * 24 * 60 * 60 * 1000)).toISOString().slice(0, 10)
      };
      saveData(data);
      await interaction.reply({ content: `${targetNick} için ${sure} gün süre eklendi. (ID yok, rol verilmedi)`, flags: 64 });
    } else {
      await interaction.reply({ content: 'Kullanıcı veya nick girilmedi.', flags: 64 });
    }
  }
};